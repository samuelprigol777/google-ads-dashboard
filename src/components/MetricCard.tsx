type MetricCardProps = {
  title: string;
  value: string;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  color?: "blue" | "green" | "yellow" | "red";
};

const colorMap = {
  blue: "border-blue-500",
  green: "border-green-500",
  yellow: "border-yellow-500",
  red: "border-red-500",
};

export function MetricCard({ title, value, subtitle, color = "blue" }: MetricCardProps) {
  return (
    <div className={`bg-[var(--color-card)] rounded-xl p-5 border-l-4 ${colorMap[color]}`}>
      <p className="text-sm text-[var(--color-muted)] mb-1">{title}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
      {subtitle && (
        <p className="text-xs text-[var(--color-muted)] mt-1">{subtitle}</p>
      )}
    </div>
  );
}
