"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type ClientConfig = {
  name: string;
  basePath: string;
  color: string;
  colorAccent: string;
};

const navLinks = [
  { suffix: "", label: "Visao Geral", icon: "dashboard" },
  { suffix: "/search-terms", label: "Termos de Pesquisa", icon: "search" },
  { suffix: "/quality", label: "Quality Score", icon: "star" },
];

export function ClientLayout({
  children,
  config,
}: {
  children: React.ReactNode;
  config: ClientConfig;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-[var(--color-card)] border-b border-[var(--color-border)] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <span className={`w-3 h-3 rounded-full ${config.color}`}></span>
              <h1 className="text-lg font-bold text-white">{config.name}</h1>
            </div>
            <span className="text-xs text-[var(--color-muted)] px-3 py-1 rounded-full bg-[var(--color-background)] border border-[var(--color-border)]">
              Google Ads Dashboard
            </span>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-[var(--color-card)]/80 backdrop-blur-sm border-b border-[var(--color-border)] sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 h-12">
            {navLinks.map((link) => {
              const href = `${config.basePath}${link.suffix}`;
              const isActive =
                link.suffix === ""
                  ? pathname === config.basePath
                  : pathname.startsWith(href);

              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? `${config.colorAccent} text-white`
                      : "text-[var(--color-muted)] hover:text-white hover:bg-[var(--color-card-hover)]"
                  }`}
                >
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {link.icon === "dashboard" && (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    )}
                    {link.icon === "search" && (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    )}
                    {link.icon === "star" && (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    )}
                  </svg>
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] bg-[var(--color-card)]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-xs text-[var(--color-muted)] text-center">
            {config.name} &middot; Dashboard de Performance Google Ads
          </p>
        </div>
      </footer>
    </div>
  );
}
