"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

type ChartData = {
  name: string;
  impressions: number;
  clicks: number;
  conversions: number;
  cost: number;
};

export function PerformanceChart({ data }: { data: ChartData[] }) {
  if (data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-[var(--color-muted)]">
        Sem dados para exibir
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis
          dataKey="name"
          tick={{ fill: "#94a3b8", fontSize: 11 }}
          axisLine={{ stroke: "#334155" }}
          tickLine={false}
          angle={-20}
          textAnchor="end"
          height={60}
        />
        <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={{ stroke: "#334155" }} tickLine={false} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1e293b",
            border: "1px solid #334155",
            borderRadius: "8px",
            color: "#e2e8f0",
          }}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          formatter={(value: any, name: any) => {
            const v = Number(value) || 0;
            if (name === "cost") return [`R$ ${v.toFixed(2)}`, "Custo"];
            if (name === "impressions") return [v.toLocaleString("pt-BR"), "Impressões"];
            if (name === "clicks") return [v.toLocaleString("pt-BR"), "Cliques"];
            if (name === "conversions") return [v.toFixed(1), "Conversões"];
            return [value, name];
          }}
        />
        <Legend
          wrapperStyle={{ color: "#94a3b8", fontSize: 12 }}
          formatter={(value: string) => {
            const labels: Record<string, string> = { clicks: "Cliques", conversions: "Conversões", cost: "Custo (R$)" };
            return labels[value] || value;
          }}
        />
        <Bar dataKey="clicks" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        <Bar dataKey="conversions" fill="#22c55e" radius={[4, 4, 0, 0]} />
        <Bar dataKey="cost" fill="#f59e0b" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
