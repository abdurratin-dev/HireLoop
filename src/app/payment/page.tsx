"use client";

import { useState, type FormEvent } from "react";
import {
  ArrowLeft,
  ChevronDown,
  CreditCard,
  Lock,
} from "lucide-react";

type CurrencyCode = "BDT" | "USD";

const currencies: { code: CurrencyCode; flag: string; label: string }[] = [
  { code: "BDT", flag: "🇧🇩", label: "BDT 2,553.33" },
  { code: "USD", flag: "🇺🇸", label: "$20.00" },
];

const countries = [
  "Bangladesh",
  "United States",
  "United Kingdom",
  "India",
  "Canada",
  "Australia",
  "Singapore",
  "Germany",
  "France",
  "Japan",
];

function formatCardNumber(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)} / ${digits.slice(2)}`;
}

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-zinc-500"
    >
      {children}
    </label>
  );
}

/** Small brand marks shown inside the card-number field. */
function CardBrandMarks() {
  return (
    <span className="flex items-center gap-1.5 pr-3" aria-hidden>
      {/* Mastercard */}
      <span className="relative grid size-6 place-items-center overflow-hidden rounded bg-[#1a1f71]">
        <span className="absolute left-1 size-3 rounded-full bg-[#eb001b]" />
        <span className="absolute right-1 size-3 rounded-full bg-[#f79e1b] opacity-90" />
      </span>
      {/* Visa */}
      <span className="grid size-6 place-items-center rounded bg-[#1434cb]">
        <span className="text-[7px] font-bold italic tracking-tight text-white">
          VISA
        </span>
      </span>
      {/* Amex */}
      <span className="grid size-6 place-items-center rounded bg-[#2e77bc]">
        <span className="text-[6px] font-bold tracking-tight text-white">
          AMEX
        </span>
      </span>
    </span>
  );
}

export default function PaymentPage() {
  const [currency, setCurrency] = useState<CurrencyCode>("BDT");
  const [email, setEmail] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [cardholder, setCardholder] = useState("");
  const [country, setCountry] = useState("Bangladesh");
  const [saveInfo, setSaveInfo] = useState(false);
  const [paying, setPaying] = useState(false);

  const price = currency === "BDT" ? "BDT 2,553.33" : "$20.00";

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (paying) return;
    setPaying(true);
    window.setTimeout(() => setPaying(false), 1500);
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* ── Top bar ─────────────────────────────────────── */}
      <header className="flex items-center justify-between px-6 py-5 sm:px-10">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Go back"
            onClick={() => window.history.back()}
            className="grid size-8 place-items-center rounded-md text-white transition-colors hover:bg-white/10"
          >
            <ArrowLeft className="size-4" />
          </button>
          <span className="grid size-8 place-items-center rounded-md border border-white/10 bg-white/[0.04]">
            <Lock className="size-3.5 text-zinc-300" />
          </span>
        </div>
        <span className="rounded-md bg-white/10 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-zinc-300">
          SANDBOX
        </span>
      </header>

      {/* ── Checkout ────────────────────────────────────── */}
      <main className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-12 px-6 pb-16 pt-4 sm:px-10 lg:grid-cols-2 lg:gap-16">
        {/* Left: currency + order summary */}
        <section className="lg:pt-2">
          <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
            Choose a currency:
          </p>

          <div className="mt-3 grid grid-cols-2 gap-3">
            {currencies.map((c) => {
              const active = currency === c.code;
              return (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => setCurrency(c.code)}
                  aria-pressed={active}
                  className={`flex h-14 items-center justify-center gap-2.5 rounded-lg border text-sm font-semibold transition-colors ${
                    active
                      ? "border-white bg-white/[0.03]"
                      : "border-white/15 text-zinc-300 hover:border-white/40"
                  }`}
                >
                  <span className="text-base leading-none">{c.flag}</span>
                  {c.label}
                </button>
              );
            })}
          </div>

          <p className="mt-3 text-xs text-zinc-500">1 USD = 127.6665 BDT</p>

          <div className="mt-8 border-t border-white/10 pt-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-lg font-bold tracking-tight">
                  Hireloop Pro Plan
                </h1>
                <p className="mt-1 text-sm text-zinc-500">
                  Access to all features
                </p>
              </div>
              <p className="text-lg font-bold tracking-tight">{price}</p>
            </div>
          </div>
        </section>

        {/* Right: payment form */}
        <section className="mx-auto w-full max-w-md lg:mx-0">
          <form onSubmit={submit}>
            {/* Link express checkout */}
            <button
              type="button"
              className="flex h-12 w-full items-center justify-center gap-2.5 rounded-lg bg-[#00d66f] text-sm font-semibold text-black transition-colors hover:bg-[#00c264]"
            >
              <span className="grid size-5 place-items-center rounded-full bg-black">
                <span className="size-1.5 rounded-full bg-[#00d66f]" />
              </span>
              link
              <span className="ml-1 rounded bg-[#1a1f71] px-1.5 py-0.5 text-[9px] font-bold italic text-white">
                VISA
              </span>
              <span className="text-black/70">4242</span>
            </button>

            <div className="my-5 flex items-center gap-4">
              <span aria-hidden className="h-px flex-1 bg-white/10" />
              <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                or
              </span>
              <span aria-hidden className="h-px flex-1 bg-white/10" />
            </div>

            {/* Contact information */}
            <h2 className="text-sm font-semibold">Contact information</h2>
            <div className="mt-3">
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <input
                id="email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 w-full rounded-lg border border-transparent bg-[#262626] px-3.5 text-sm text-white outline-none transition-colors placeholder:text-zinc-500 focus:border-zinc-500"
              />
            </div>

            {/* Payment method */}
            <h2 className="mt-7 text-sm font-semibold">Payment method</h2>
            <div className="mt-3 overflow-hidden rounded-xl border border-white/10 bg-[#141414]">
              <div className="flex items-center gap-2.5 border-b border-white/10 px-4 py-3.5 text-sm font-medium">
                <CreditCard className="size-4 text-zinc-400" />
                Card
              </div>

              <div className="space-y-4 p-4">
                {/* Card number + expiry + CVC */}
                <div>
                  <FieldLabel htmlFor="card-number">
                    Card information
                  </FieldLabel>
                  <div className="overflow-hidden rounded-lg bg-[#262626] ring-1 ring-transparent transition-shadow focus-within:ring-zinc-500">
                    <div className="flex items-center">
                      <input
                        id="card-number"
                        name="card-number"
                        inputMode="numeric"
                        autoComplete="cc-number"
                        placeholder="1234 1234 1234 1234"
                        value={cardNumber}
                        onChange={(e) =>
                          setCardNumber(formatCardNumber(e.target.value))
                        }
                        className="h-11 min-w-0 flex-1 bg-transparent px-3.5 text-sm text-white outline-none placeholder:text-zinc-500"
                      />
                      <CardBrandMarks />
                    </div>
                    <div className="grid grid-cols-2 border-t border-white/10">
                      <input
                        aria-label="Expiry date"
                        name="expiry"
                        inputMode="numeric"
                        autoComplete="cc-exp"
                        placeholder="MM / YY"
                        value={expiry}
                        onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                        className="h-11 bg-transparent px-3.5 text-sm text-white outline-none placeholder:text-zinc-500"
                      />
                      <input
                        aria-label="CVC"
                        name="cvc"
                        inputMode="numeric"
                        autoComplete="cc-csc"
                        placeholder="CVC"
                        value={cvc}
                        onChange={(e) =>
                          setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))
                        }
                        className="h-11 border-l border-white/10 bg-transparent px-3.5 text-sm text-white outline-none placeholder:text-zinc-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Cardholder name */}
                <div>
                  <FieldLabel htmlFor="cardholder">Cardholder name</FieldLabel>
                  <input
                    id="cardholder"
                    name="cardholder"
                    autoComplete="cc-name"
                    placeholder="Full name on card"
                    value={cardholder}
                    onChange={(e) => setCardholder(e.target.value)}
                    className="h-11 w-full rounded-lg bg-[#262626] px-3.5 text-sm text-white outline-none ring-1 ring-transparent transition-shadow placeholder:text-zinc-500 focus:ring-zinc-500"
                  />
                </div>

                {/* Country */}
                <div>
                  <FieldLabel htmlFor="country">Country or region</FieldLabel>
                  <div className="relative">
                    <select
                      id="country"
                      name="country"
                      autoComplete="country-name"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="h-11 w-full appearance-none rounded-lg bg-[#262626] px-3.5 pr-10 text-sm text-white outline-none ring-1 ring-transparent transition-shadow focus:ring-zinc-500"
                    >
                      {countries.map((c) => (
                        <option key={c} value={c} className="bg-[#262626]">
                          {c}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Save info */}
            <label className="mt-4 flex cursor-pointer gap-3 rounded-xl border border-white/10 bg-[#141414] p-4">
              <input
                type="checkbox"
                checked={saveInfo}
                onChange={(e) => setSaveInfo(e.target.checked)}
                className="mt-0.5 size-4 shrink-0 rounded accent-[#3b82f6]"
              />
              <span>
                <span className="block text-sm font-semibold">
                  Save my information for faster checkout
                </span>
                <span className="mt-0.5 block text-xs text-zinc-500">
                  Pay securely on this site and everywhere Link is accepted.
                </span>
              </span>
            </label>

            {/* Pay */}
            <button
              type="submit"
              disabled={paying}
              className="mt-4 h-12 w-full rounded-lg bg-[#3b82f6] text-sm font-semibold text-white transition-colors hover:bg-[#2563eb] active:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {paying ? "Processing…" : "Pay"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
