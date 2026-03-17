import { AccountSearchTerms } from "@/components/AccountSearchTerms";

export const dynamic = "force-dynamic";

export default function ZanfirSearchTermsPage() {
  return <AccountSearchTerms accountId={2} basePath="/zanfir" />;
}
