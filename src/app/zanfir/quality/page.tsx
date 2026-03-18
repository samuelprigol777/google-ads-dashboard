import { AccountQuality } from "@/components/AccountQuality";

export const dynamic = "force-dynamic";

export default async function ZanfirQualityPage() {
  return <AccountQuality accountId={2} basePath="/zanfir" />;
}
