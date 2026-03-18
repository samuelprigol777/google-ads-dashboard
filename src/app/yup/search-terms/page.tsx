import { AccountSearchTerms } from "@/components/AccountSearchTerms";
import { parseDateRangeFromParams } from "@/lib/date-utils";

export const dynamic = "force-dynamic";

export default async function YupSearchTermsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const dateRange = parseDateRangeFromParams(params);
  return <AccountSearchTerms accountId={1} basePath="/yup" dateRange={dateRange} />;
}
