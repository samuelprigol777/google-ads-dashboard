import { AccountDashboard } from "@/components/AccountDashboard";
import { parseDateRangeFromParams } from "@/lib/date-utils";

export const dynamic = "force-dynamic";

export default async function YupPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const dateRange = parseDateRangeFromParams(params);
  return <AccountDashboard accountId={1} basePath="/yup" dateRange={dateRange} />;
}
