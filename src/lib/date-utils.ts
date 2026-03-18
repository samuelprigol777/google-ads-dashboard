import type { DateRange } from "./data";

function getDateRange(preset: string): { from: string; to: string } {
  const today = new Date();
  const to = new Date(today);
  const from = new Date(today);

  switch (preset) {
    case "hoje":
      break;
    case "7d":
      from.setDate(from.getDate() - 7);
      break;
    case "30d":
      from.setDate(from.getDate() - 30);
      break;
    case "este-mes":
      from.setDate(1);
      break;
    case "mes-passado": {
      const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      from.setFullYear(lastMonth.getFullYear());
      from.setMonth(lastMonth.getMonth());
      from.setDate(1);
      to.setDate(0);
      break;
    }
    default: {
      const days = parseInt(preset) || 30;
      from.setDate(from.getDate() - days);
    }
  }

  return {
    from: from.toISOString().split("T")[0],
    to: to.toISOString().split("T")[0],
  };
}

export function parseDateRangeFromParams(
  searchParams: Record<string, string | string[] | undefined>
): DateRange {
  const periodo = (searchParams?.periodo as string) || "7d";
  const de = searchParams?.de as string;
  const ate = searchParams?.ate as string;

  if (periodo === "custom" && de && ate) {
    return { from: de, to: ate };
  }

  const range = getDateRange(periodo);
  return { from: de || range.from, to: ate || range.to };
}
