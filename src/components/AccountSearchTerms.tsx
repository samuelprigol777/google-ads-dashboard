import { SearchTermsTable } from "@/components/SearchTermsTable";
import { DateFilter } from "@/components/DateFilter";
import { getAccount, getSearchTerms } from "@/lib/data";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export async function AccountSearchTerms({ accountId, basePath }: { accountId: number; basePath: string }) {
  const account = await getAccount(accountId);
  if (!account) notFound();

  const terms = await getSearchTerms(accountId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Termos de Pesquisa</h1>
          <p className="text-[var(--color-muted)] text-sm mt-1">{terms.length} termos encontrados</p>
        </div>

        <div className="bg-[var(--color-card)] rounded-xl px-4 py-3">
          <Suspense fallback={<div className="h-8" />}>
            <DateFilter />
          </Suspense>
        </div>
      </div>

      <div className="bg-[var(--color-card)] rounded-xl p-5">
        <SearchTermsTable terms={terms} />
      </div>
    </div>
  );
}
