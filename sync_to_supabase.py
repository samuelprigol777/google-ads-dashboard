"""Sync Google Ads data to Supabase database."""

import os
import sys
from datetime import datetime, timedelta

# Add parent directory to path for gads_reports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from gads_reports import (
    get_client,
    list_accessible_accounts,
    get_account_info,
    get_child_accounts,
    report_performance,
    report_search_terms,
    report_quality_score,
    report_conversions,
)

from supabase import create_client

# Config
SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")

# Accounts to sync
TARGET_ACCOUNTS = {
    "1206981886": {"name": "Y-U-P Cosméticos", "mcc": None},
    "7502967093": {"name": "Zanfir (Ótica Erechim)", "mcc": None},
}


def get_supabase():
    if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
        print("[ERROR] Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars")
        sys.exit(1)
    return create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)


def find_mcc_for_accounts():
    """Find which MCC manages each target account."""
    account_ids = list_accessible_accounts()
    print(f"Accessible accounts: {len(account_ids)}")

    for acc_id in account_ids:
        info = get_account_info(acc_id, acc_id)
        if info and not info.get("error") and info.get("is_manager"):
            print(f"  Found MCC: {info['name']} ({acc_id})")
            children = get_child_accounts(acc_id)
            for child in children:
                cid = child["id"]
                if cid in TARGET_ACCOUNTS:
                    TARGET_ACCOUNTS[cid]["mcc"] = acc_id
                    TARGET_ACCOUNTS[cid]["name"] = child.get("name", TARGET_ACCOUNTS[cid]["name"])
                    print(f"    -> {child['name']} ({cid}) mapped to MCC {acc_id}")

    # For accounts without MCC, try using themselves
    for acc_id, config in TARGET_ACCOUNTS.items():
        if not config["mcc"]:
            info = get_account_info(acc_id, acc_id)
            if info and not info.get("error"):
                config["mcc"] = acc_id
                print(f"  {acc_id} uses itself as login_customer_id")


def sync_account(sb, google_ads_id: str, config: dict, date_from: str, date_to: str):
    """Sync one Google Ads account to Supabase."""
    login_cid = config["mcc"] or google_ads_id
    name = config["name"]

    print(f"\n{'='*50}")
    print(f"Syncing: {name} ({google_ads_id}) via MCC {login_cid}")
    print(f"{'='*50}")

    # Upsert account
    account_data = {
        "google_ads_id": google_ads_id,
        "name": name,
        "currency": "BRL",
        "timezone": "America/Sao_Paulo",
        "status": "ENABLED",
        "parent_mcc": login_cid if login_cid != google_ads_id else None,
        "updated_at": datetime.now().isoformat(),
    }
    result = sb.table("accounts").upsert(account_data, on_conflict="google_ads_id").execute()
    account_id = result.data[0]["id"]
    print(f"  Account ID in Supabase: {account_id}")

    total_records = 0

    # 1. Performance / Campaigns
    print("  Fetching performance data...")
    perf = report_performance(google_ads_id, login_cid, date_from, date_to)
    print(f"    {len(perf)} campaigns found")

    for row in perf:
        # Upsert campaign
        campaign_data = {
            "account_id": account_id,
            "name": row["campanha"],
            "type": row["tipo"],
            "status": row["status"],
            "daily_budget": float(row["orcamento_diario"]),
            "updated_at": datetime.now().isoformat(),
        }
        camp_result = sb.table("campaigns").upsert(
            campaign_data, on_conflict="account_id,name"
        ).execute()
        campaign_id = camp_result.data[0]["id"]

        # Upsert metrics
        metric_data = {
            "campaign_id": campaign_id,
            "date": date_to,
            "impressions": int(row["impressoes"]),
            "clicks": int(row["cliques"]),
            "ctr": float(row["ctr"].replace("%", "")) / 100 if isinstance(row["ctr"], str) else float(row["ctr"]),
            "avg_cpc": float(row["cpc_medio"]),
            "conversions": float(row["conversoes"]),
            "cost": float(row["custo"]),
            "cpa": float(row["cpa"]),
        }
        sb.table("campaign_metrics").upsert(
            metric_data, on_conflict="campaign_id,date"
        ).execute()
        total_records += 1

    # 2. Search Terms
    print("  Fetching search terms...")
    terms = report_search_terms(google_ads_id, login_cid, date_from, date_to)
    print(f"    {len(terms)} terms found")

    # Delete old search terms for this account and re-insert
    sb.table("search_terms").delete().eq("account_id", account_id).execute()
    for row in terms:
        term_data = {
            "account_id": account_id,
            "campaign_name": row["campanha"],
            "ad_group": row["grupo_anuncios"],
            "term": row["termo_busca"],
            "impressions": int(row["impressoes"]),
            "clicks": int(row["cliques"]),
            "ctr": float(row["ctr"].replace("%", "")) / 100 if isinstance(row["ctr"], str) else float(row["ctr"]),
            "conversions": float(row["conversoes"]),
            "cost": float(row["custo"]),
            "date_from": date_from,
            "date_to": date_to,
        }
        sb.table("search_terms").insert(term_data).execute()
        total_records += 1

    # 3. Quality Score
    print("  Fetching quality scores...")
    qs = report_quality_score(google_ads_id, login_cid)
    print(f"    {len(qs)} keywords found")

    # Delete old and re-insert
    sb.table("keywords_quality").delete().eq("account_id", account_id).execute()
    for row in qs:
        qs_val = row["quality_score"]
        kw_data = {
            "account_id": account_id,
            "campaign_name": row["campanha"],
            "ad_group": row["grupo_anuncios"],
            "keyword": row["palavra_chave"],
            "quality_score": int(qs_val) if qs_val != "N/A" else None,
            "expected_ctr": row["ctr_esperado"],
            "ad_relevance": row["relevancia_anuncio"],
            "landing_page_exp": row["experiencia_landing"],
            "updated_at": datetime.now().isoformat(),
        }
        sb.table("keywords_quality").insert(kw_data).execute()
        total_records += 1

    # Log sync
    sb.table("sync_log").insert({
        "account_id": account_id,
        "status": "success",
        "records_count": total_records,
        "details": f"Performance: {len(perf)}, Search Terms: {len(terms)}, Quality: {len(qs)}",
    }).execute()

    print(f"  DONE: {total_records} records synced")
    return total_records


def main():
    print("=" * 50)
    print("  GOOGLE ADS → SUPABASE SYNC")
    print("=" * 50)

    date_to = datetime.now().date() - timedelta(days=1)
    date_from = date_to - timedelta(days=29)
    date_from_str = date_from.strftime("%Y-%m-%d")
    date_to_str = date_to.strftime("%Y-%m-%d")
    print(f"Period: {date_from_str} to {date_to_str}")

    sb = get_supabase()
    find_mcc_for_accounts()

    grand_total = 0
    for google_ads_id, config in TARGET_ACCOUNTS.items():
        if not config["mcc"]:
            print(f"\n[SKIP] {config['name']} ({google_ads_id}) - no MCC found")
            continue
        total = sync_account(sb, google_ads_id, config, date_from_str, date_to_str)
        grand_total += total

    print(f"\n{'='*50}")
    print(f"  SYNC COMPLETE: {grand_total} total records")
    print(f"{'='*50}")


if __name__ == "__main__":
    main()
