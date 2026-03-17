import { ClientLayout } from "@/components/ClientLayout";

const yupConfig = {
  name: "Y-U-P Cosmeticos",
  basePath: "/yup",
  color: "bg-purple-500",
  colorAccent: "bg-purple-600",
};

export default function YupLayout({ children }: { children: React.ReactNode }) {
  return <ClientLayout config={yupConfig}>{children}</ClientLayout>;
}
