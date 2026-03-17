import { AccountDashboard } from "@/components/AccountDashboard";

export const dynamic = "force-dynamic";

export default function ZanfirPage() {
  return <AccountDashboard accountId={2} basePath="/zanfir" />;
}
