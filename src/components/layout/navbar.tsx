"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "@/assets/images/logo.png"
import Image from "next/image";

const links = [
  { label: "Browse Jobs", href: "/jobs" },
  { label: "Company", href: "/company" },
  { label: "Pricing", href: "/pricing" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Auth pages are full-screen and render without the site navbar.
  if (pathname === "/sign-up" || pathname === "/sign-in") return null;

  return (
    <header className="sticky top-0 z-50 px-4 pt-4 sm:px-6 lg:px-11">
      <nav className="flex h-20 items-center justify-between rounded-[22px] border border-border bg-card/80 px-5 shadow-lg shadow-black/20 backdrop-blur-xl sm:h-[90px] sm:px-6 lg:px-11">
      <Link href='/'>
        <Image
          src={Logo}
          alt="hireLoop Logo"
          width={154}
          height={44}
          priority
        />
      </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}

          <span aria-hidden className="h-6 w-px bg-border" />

          <Link
            href="/sign-in"
            className="text-sm font-semibold text-violet-400 transition-colors hover:text-violet-300"
          >
            Sign In
          </Link>

          <Link
            href="/sign-up"
            className="rounded-xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-indigo-500/25 transition-colors hover:bg-indigo-400"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="grid size-9 place-items-center rounded-lg border border-border text-foreground/80 transition-colors hover:text-foreground md:hidden"
        >
          {open ? <X className="size-4.5" /> : <Menu className="size-4.5" />}
        </button>
      </nav>

      {/* Mobile navigation */}
      <div
        className={cn(
          "mt-2 overflow-hidden rounded-2xl border border-border bg-card/95 backdrop-blur-xl transition-all duration-200 md:hidden",
          open ? "max-h-80 opacity-100" : "max-h-0 border-transparent opacity-0"
        )}
      >
        <div className="flex flex-col gap-1 p-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}

          <div className="my-1 h-px bg-border" />

          <Link
            href="/sign-in"
            onClick={() => setOpen(false)}
            className="rounded-lg px-3 py-2.5 text-sm font-semibold text-indigo-400 transition-colors hover:bg-accent"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            onClick={() => setOpen(false)}
            className="mt-1 rounded-lg bg-indigo-500 px-3 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-indigo-400"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
