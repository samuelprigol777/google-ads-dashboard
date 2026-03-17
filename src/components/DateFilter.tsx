"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

const presets = [
  { label: "7 dias", value: "7d" },
  { label: "14 dias", value: "14d" },
  { label: "30 dias", value: "30d" },
  { label: "90 dias", value: "90d" },
];

function getDateRange(preset: string): { from: string; to: string } {
  const to = new Date();
  const from = new Date();
  const days = parseInt(preset) || 30;
  from.setDate(from.getDate() - days);
  return {
    from: from.toISOString().split("T")[0],
    to: to.toISOString().split("T")[0],
  };
}

export function DateFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPreset = searchParams.get("periodo") || "30d";
  const customFrom = searchParams.get("de") || "";
  const customTo = searchParams.get("ate") || "";
  const [showCustom, setShowCustom] = useState(currentPreset === "custom");
  const [fromDate, setFromDate] = useState(customFrom || getDateRange("30").from);
  const [toDate, setToDate] = useState(customTo || getDateRange("0").to);

  const applyFilter = useCallback(
    (preset: string, from?: string, to?: string) => {
      const params = new URLSearchParams();
      if (preset === "custom" && from && to) {
        params.set("periodo", "custom");
        params.set("de", from);
        params.set("ate", to);
      } else {
        params.set("periodo", preset);
        const range = getDateRange(preset);
        params.set("de", range.from);
        params.set("ate", range.to);
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router]
  );

  return (
    <div className="flex flex-wrap items-center gap-2">
      {presets.map((p) => (
        <button
          key={p.value}
          onClick={() => {
            setShowCustom(false);
            applyFilter(p.value);
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            currentPreset === p.value && !showCustom
              ? "bg-[var(--color-primary)] text-white"
              : "bg-[var(--color-card)] text-[var(--color-muted)] hover:bg-[var(--color-card-hover)] hover:text-white"
          }`}
        >
          {p.label}
        </button>
      ))}

      <button
        onClick={() => setShowCustom(!showCustom)}
        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
          showCustom
            ? "bg-[var(--color-primary)] text-white"
            : "bg-[var(--color-card)] text-[var(--color-muted)] hover:bg-[var(--color-card-hover)] hover:text-white"
        }`}
      >
        Personalizado
      </button>

      {showCustom && (
        <div className="flex items-center gap-2 ml-2">
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="px-2 py-1.5 rounded-lg text-xs bg-[var(--color-card)] text-white border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)]"
          />
          <span className="text-[var(--color-muted)] text-xs">a</span>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="px-2 py-1.5 rounded-lg text-xs bg-[var(--color-card)] text-white border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)]"
          />
          <button
            onClick={() => applyFilter("custom", fromDate, toDate)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--color-primary)] text-white hover:opacity-90 transition-opacity"
          >
            Aplicar
          </button>
        </div>
      )}
    </div>
  );
}
