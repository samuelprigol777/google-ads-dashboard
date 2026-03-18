import { AccountDashboard } from "@/components/AccountDashboard";
import { parseDateRangeFromParams } from "@/lib/date-utils";

export const dynamic = "force-dynamic";

export default async function ZanfirPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const dateRange = parseDateRangeFromParams(params);
  return <AccountDashboard accountId={2} basePath="/zanfir" dateRange={dateRange} />;
}
