"use client";

import Link from "next/link";
import { useState } from "react";
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

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-3 sm:px-6">
      <nav className="flex h-16 items-center justify-between rounded-2xl border border-border bg-card/80 px-5 shadow-lg shadow-black/20 backdrop-blur-xl sm:px-7">
      <Link href='/'>
        <Image
          src={Logo}
          alt="hireLoop Logo"
          width={154}
          height={44}
          style={{ width: 120, height: "auto" }}
          priority
        />
      </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[13px] font-medium text-foreground/80 transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}

          <span aria-hidden className="h-5 w-px bg-border" />

          <Link
            href="/sign-in"
            className="text-[13px] font-semibold text-indigo-400 transition-colors hover:text-indigo-300"
          >
            Sign In
          </Link>

          <Link
            href="/sign-up"
            className="rounded-lg bg-indigo-500 px-4 py-2.5 text-[13px] font-semibold text-white shadow-sm shadow-indigo-500/25 transition-colors hover:bg-indigo-400"
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
