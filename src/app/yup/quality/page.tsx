import { AccountQuality } from "@/components/AccountQuality";

export const dynamic = "force-dynamic";

export default async function YupQualityPage() {
  return <AccountQuality accountId={1} basePath="/yup" />;
}
