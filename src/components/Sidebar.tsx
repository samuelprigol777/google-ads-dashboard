"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const projects = [
  {
    id: 1,
    name: "Y-U-P Cosméticos",
    base: "/yup",
    color: "bg-purple-500",
    links: [
      { href: "/yup", label: "Dashboard" },
      { href: "/yup/search-terms", label: "Termos de Busca" },
      { href: "/yup/quality", label: "Quality Score" },
    ],
  },
  {
    id: 2,
    name: "Zanfir (Ótica)",
    base: "/zanfir",
    color: "bg-blue-500",
    links: [
      { href: "/zanfir", label: "Dashboard" },
      { href: "/zanfir/search-terms", label: "Termos de Busca" },
      { href: "/zanfir/quality", label: "Quality Score" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[var(--color-card)] border-r border-[var(--color-border)] flex flex-col z-50">
      <Link href="/" className="block p-5 border-b border-[var(--color-border)] hover:bg-[var(--color-card-hover)] transition-colors">
        <h1 className="text-lg font-bold text-white">Google Ads</h1>
        <p className="text-xs text-[var(--color-muted)] mt-1">Dashboard de Performance</p>
      </Link>

      <nav className="flex-1 p-3 space-y-4 overflow-y-auto">
        {/* Overview Link */}
        <Link
          href="/"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
            pathname === "/"
              ? "bg-[var(--color-primary)] text-white"
              : "text-[var(--color-muted)] hover:bg-[var(--color-card-hover)] hover:text-white"
          }`}
        >
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" />
          </svg>
          <span>Visão Geral</span>
        </Link>

        {/* Project Sections */}
        {projects.map((project) => {
          const isProjectActive = pathname.startsWith(project.base);
          return (
            <div key={project.id}>
              <div className="flex items-center gap-2 px-3 py-2">
                <span className={`w-2 h-2 rounded-full ${project.color}`}></span>
                <span className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider">
                  {project.name}
                </span>
              </div>
              <div className="space-y-0.5 ml-2">
                {project.links.map((link) => {
                  const isExact = pathname === link.href;
                  const isActive = isExact ||
                    (pathname.startsWith(link.href) && link.href !== project.base);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                        isActive
                          ? "bg-[var(--color-primary)]/20 text-[var(--color-primary)] font-medium"
                          : isProjectActive
                          ? "text-white/70 hover:bg-[var(--color-card-hover)] hover:text-white"
                          : "text-[var(--color-muted)] hover:bg-[var(--color-card-hover)] hover:text-white"
                      }`}
                    >
                      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {link.label === "Dashboard" && (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        )}
                        {link.label === "Termos de Busca" && (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        )}
                        {link.label === "Quality Score" && (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        )}
                      </svg>
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[var(--color-border)]">
        <p className="text-xs text-[var(--color-muted)]">Dados demo</p>
      </div>
    </aside>
  );
}
