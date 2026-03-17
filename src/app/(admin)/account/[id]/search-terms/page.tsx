import { SearchTermsTable } from "@/components/SearchTermsTable";
import { DateFilter } from "@/components/DateFilter";
import { getAccount, getSearchTerms } from "@/lib/data";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function SearchTermsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const accountId = parseInt(id);
  const account = await getAccount(accountId);
  if (!account) notFound();

  const terms = await getSearchTerms(accountId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <Link href={`/account/${accountId}`} className="text-[var(--color-primary)] text-sm hover:underline">
              ← {account.name}
            </Link>
            <h1 className="text-2xl font-bold text-white mt-1">Termos de Busca</h1>
            <p className="text-[var(--color-muted)] text-sm mt-1">{terms.length} termos encontrados</p>
          </div>
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
