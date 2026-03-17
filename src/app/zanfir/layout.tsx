import { ClientLayout } from "@/components/ClientLayout";

const zanfirConfig = {
  name: "Otica Zanfir",
  basePath: "/zanfir",
  color: "bg-blue-500",
  colorAccent: "bg-blue-600",
};

export default function ZanfirLayout({ children }: { children: React.ReactNode }) {
  return <ClientLayout config={zanfirConfig}>{children}</ClientLayout>;
}
