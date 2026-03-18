import { AccountSearchTerms } from "@/components/AccountSearchTerms";
import { parseDateRangeFromParams } from "@/lib/date-utils";

export const dynamic = "force-dynamic";

export default async function ZanfirSearchTermsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const dateRange = parseDateRangeFromParams(params);
  return <AccountSearchTerms accountId={2} basePath="/zanfir" dateRange={dateRange} />;
}
