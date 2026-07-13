"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PawPrint } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { useDictionary } from "@/i18n/lt";

const NAV_ITEMS = [
  { href: "/", key: "home" as const },
  { href: "/assessment", key: "newAssessment" as const },
  { href: "/history", key: "history" as const },
  { href: "/diary", key: "diary" as const },
  { href: "/risk-analysis", key: "risk" as const },
];

export function TopNav() {
  const pathname = usePathname();
  const dict = useDictionary();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <PawPrint className="h-5 w-5" />
          </span>
          {dict.appName}
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                pathname === item.href && "bg-muted text-foreground"
              )}
            >
              {dict.nav[item.key]}
            </Link>
          ))}
        </nav>
        <ThemeToggle />
      </div>
      <nav className="flex items-center gap-1 overflow-x-auto border-t border-border px-2 py-1.5 md:hidden">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground",
              pathname === item.href && "bg-muted text-foreground"
            )}
          >
            {dict.nav[item.key]}
          </Link>
        ))}
      </nav>
    </header>
  );
}
