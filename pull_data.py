"""Pull real Google Ads data and save as JSON for the dashboard."""
import json
import os
import sys
from datetime import datetime, timedelta
from pathlib import Path

# Add parent directory to path so we can import gads_reports
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from gads_reports import (
    get_client, get_account_info, get_child_accounts,
    list_accessible_accounts, report_performance,
    report_search_terms, report_quality_score
)

# Target accounts
TARGET_ACCOUNTS = {
    "1206981886": {"name": "Y-U-P Cosméticos", "id": 1},
    "7502967093": {"name": "Zanfir (Ótica Erechim)", "id": 2},
}

def find_login_customer_id(target_id):
    """Find the MCC (login_customer_id) for a target account."""
    accessible = list_accessible_accounts()

    for acc_id in accessible:
        info = get_account_info(acc_id, acc_id)
        if info and not info.get("error"):
            if info.get("is_manager"):
                children = get_child_accounts(acc_id)
                for child in children:
                    if child["id"] == target_id:
                        return acc_id
            elif info["id"] == target_id:
                return acc_id
    return target_id


def pull_account_data(customer_id, login_customer_id, date_from, date_to):
    """Pull all data for an account."""
    print(f"  Performance report ({date_from} to {date_to})...")
    perf = report_performance(customer_id, login_customer_id, date_from, date_to)
    print(f"    -> {len(perf)} campaigns")

    print(f"  Search terms report...")
    terms = report_search_terms(customer_id, login_customer_id, date_from, date_to)
    print(f"    -> {len(terms)} terms")

    print(f"  Quality score report...")
    qs = report_quality_score(customer_id, login_customer_id)
    print(f"    -> {len(qs)} keywords")

    return {
        "performance": perf,
        "search_terms": terms,
        "quality_score": qs,
    }


def main():
    print("=" * 60)
    print("  PULLING REAL GOOGLE ADS DATA FOR DASHBOARD")
    print("=" * 60)

    # Date ranges - pull last 90 days of daily data
    today = datetime.now().date()
    yesterday = today - timedelta(days=1)

    # We'll pull data for multiple periods to support the date filter
    periods = {
        "last_90d": (yesterday - timedelta(days=89), yesterday),
    }

    output_dir = Path(__file__).resolve().parent / "public" / "data"
    output_dir.mkdir(parents=True, exist_ok=True)

    print("\n[STEP 1] Finding accessible accounts...")
    accessible = list_accessible_accounts()
    print(f"  Accessible accounts: {len(accessible)}")

    # Find MCCs and map target accounts
    mcc_map = {}
    for acc_id in accessible:
        info = get_account_info(acc_id, acc_id)
        if info and not info.get("error") and info.get("is_manager"):
            print(f"  [MCC] {info['name']} ({info['id']})")
            children = get_child_accounts(acc_id)
            for child in children:
                if child["id"] in TARGET_ACCOUNTS:
                    mcc_map[child["id"]] = acc_id
                    print(f"    -> Found target: {child['name']} ({child['id']})")

    # For accounts not found via MCC, try direct access
    for target_id in TARGET_ACCOUNTS:
        if target_id not in mcc_map:
            info = get_account_info(target_id, target_id)
            if info and not info.get("error"):
                mcc_map[target_id] = target_id
                print(f"  [DIRECT] {info['name']} ({target_id})")

    all_data = {"accounts": [], "last_updated": datetime.now().isoformat()}

    for target_id, target_info in TARGET_ACCOUNTS.items():
        login_cid = mcc_map.get(target_id)
        if not login_cid:
            print(f"\n[SKIP] Could not find access for {target_info['name']} ({target_id})")
            continue

        print(f"\n{'='*60}")
        print(f"  {target_info['name']} ({target_id}) via MCC {login_cid}")
        print(f"{'='*60}")

        # Get account info
        account_info = get_account_info(target_id, login_cid)

        account_data = {
            "id": target_info["id"],
            "google_ads_id": target_id,
            "name": target_info["name"],
            "currency": account_info.get("currency", "BRL") if account_info else "BRL",
            "timezone": account_info.get("timezone", "America/Sao_Paulo") if account_info else "America/Sao_Paulo",
            "status": account_info.get("status", "ENABLED") if account_info else "ENABLED",
            "campaigns": [],
            "search_terms": [],
            "keywords_quality": [],
            "daily_metrics": [],
        }

        # Pull daily data for last 90 days (one day at a time for date filter)
        date_from = (yesterday - timedelta(days=89)).strftime("%Y-%m-%d")
        date_to = yesterday.strftime("%Y-%m-%d")

        # Get campaign performance (aggregated for last 90 days)
        print(f"\n  [PERF] Pulling campaign performance...")
        perf = report_performance(target_id, login_cid, date_from, date_to)

        campaign_id_counter = (target_info["id"] - 1) * 100 + 1
        for p in perf:
            campaign = {
                "id": campaign_id_counter,
                "account_id": target_info["id"],
                "name": p["campanha"],
                "type": p["tipo"],
                "status": p["status"],
                "daily_budget": float(p["orcamento_diario"]),
                "impressions": p["impressoes"],
                "clicks": p["cliques"],
                "ctr": float(p["ctr"].replace("%", "")) / 100 if isinstance(p["ctr"], str) else p["ctr"],
                "avg_cpc": float(p["cpc_medio"]),
                "conversions": float(p["conversoes"]),
                "cost": float(p["custo"]),
                "cpa": float(p["cpa"]),
            }
            account_data["campaigns"].append(campaign)
            campaign_id_counter += 1

        # Pull daily metrics for the date filter (weekly buckets to reduce API calls)
        print(f"  [DAILY] Pulling daily metrics for date filter...")
        for week_start_offset in range(0, 90, 7):
            w_start = yesterday - timedelta(days=min(week_start_offset + 6, 89))
            w_end = yesterday - timedelta(days=week_start_offset)
            w_from = w_start.strftime("%Y-%m-%d")
            w_to = w_end.strftime("%Y-%m-%d")

            daily_perf = report_performance(target_id, login_cid, w_from, w_to)
            for dp in daily_perf:
                account_data["daily_metrics"].append({
                    "date_from": w_from,
                    "date_to": w_to,
                    "campaign_name": dp["campanha"],
                    "type": dp["tipo"],
                    "status": dp["status"],
                    "daily_budget": float(dp["orcamento_diario"]),
                    "impressions": dp["impressoes"],
                    "clicks": dp["cliques"],
                    "ctr": float(dp["ctr"].replace("%", "")) / 100 if isinstance(dp["ctr"], str) else dp["ctr"],
                    "avg_cpc": float(dp["cpc_medio"]),
                    "conversions": float(dp["conversoes"]),
                    "cost": float(dp["custo"]),
                    "cpa": float(dp["cpa"]),
                })
            print(f"    Week {w_from} to {w_to}: {len(daily_perf)} campaigns")

        # Search terms
        print(f"  [SEARCH] Pulling search terms...")
        terms = report_search_terms(target_id, login_cid, date_from, date_to)
        term_id = (target_info["id"] - 1) * 1000 + 1
        for t in terms:
            account_data["search_terms"].append({
                "id": term_id,
                "account_id": target_info["id"],
                "campaign_name": t["campanha"],
                "ad_group": t["grupo_anuncios"],
                "term": t["termo_busca"],
                "impressions": t["impressoes"],
                "clicks": t["cliques"],
                "ctr": float(t["ctr"].replace("%", "")) / 100 if isinstance(t["ctr"], str) else t["ctr"],
                "conversions": float(t["conversoes"]),
                "cost": float(t["custo"]),
            })
            term_id += 1

        # Quality score
        print(f"  [QS] Pulling quality score...")
        qs = report_quality_score(target_id, login_cid)
        qs_id = (target_info["id"] - 1) * 500 + 1
        for q in qs:
            account_data["keywords_quality"].append({
                "id": qs_id,
                "account_id": target_info["id"],
                "campaign_name": q["campanha"],
                "ad_group": q["grupo_anuncios"],
                "keyword": q["palavra_chave"],
                "quality_score": int(q["quality_score"]) if q["quality_score"] != "N/A" else None,
                "expected_ctr": q["ctr_esperado"],
                "ad_relevance": q["relevancia_anuncio"],
                "landing_page_exp": q["experiencia_landing"],
            })
            qs_id += 1

        all_data["accounts"].append(account_data)
        print(f"\n  Summary for {target_info['name']}:")
        print(f"    Campaigns: {len(account_data['campaigns'])}")
        print(f"    Daily metric buckets: {len(account_data['daily_metrics'])}")
        print(f"    Search terms: {len(account_data['search_terms'])}")
        print(f"    Keywords QS: {len(account_data['keywords_quality'])}")

    # Save to JSON
    output_file = output_dir / "google-ads-data.json"
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(all_data, f, ensure_ascii=False, indent=2)

    print(f"\n{'='*60}")
    print(f"  DATA SAVED TO: {output_file}")
    print(f"  Last updated: {all_data['last_updated']}")
    print(f"{'='*60}")


if __name__ == "__main__":
    main()
