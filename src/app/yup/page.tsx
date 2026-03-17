import { AccountDashboard } from "@/components/AccountDashboard";

export const dynamic = "force-dynamic";

export default function YupPage() {
  return <AccountDashboard accountId={1} basePath="/yup" />;
}
