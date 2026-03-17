import { AccountSearchTerms } from "@/components/AccountSearchTerms";

export const dynamic = "force-dynamic";

export default function YupSearchTermsPage() {
  return <AccountSearchTerms accountId={1} basePath="/yup" />;
}
