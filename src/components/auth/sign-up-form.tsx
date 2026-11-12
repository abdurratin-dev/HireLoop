"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowRight,
  BarChart3,
  Briefcase,
  Check,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Rocket,
  ShieldCheck,
  User,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import googleLogo from "@/assets/logos/google.png";

const roles = [
  {
    id: "seeker",
    label: "Job Seeker",
    description: "Find your perfect job",
    icon: Briefcase,
  },
  {
    id: "recruiter",
    label: "Recruiter",
    description: "Hire the best talent",
    icon: Users,
  },
  {
    id: "admin",
    label: "Admin",
    description: "Manage platform and users",
    icon: ShieldCheck,
  },
] as const;

type Role = "seeker" | "recruiter" | "admin" ;

const features: { icon: LucideIcon; label: string }[] = [
  { icon: Zap, label: "Fast & Easy Application" },
  { icon: ShieldCheck, label: "Trusted by Top Companies" },
  { icon: BarChart3, label: "Grow Your Career" },
];

const rolePillClass =
  "flex h-full w-full cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border px-2 py-3 text-sm tracking-[-0.0125rem] transition-colors has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-[#5C53FE]/60"

function LoopMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 28" fill="none" className={className} aria-hidden>
      <defs>
        <linearGradient id="loop-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="50%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#f472b6" />
        </linearGradient>
      </defs>
      <circle
        cx="14"
        cy="14"
        r="8.5"
        stroke="url(#loop-grad)"
        strokeWidth="5"
      />
      <circle
        cx="34"
        cy="14"
        r="8.5"
        stroke="url(#loop-grad)"
        strokeWidth="5"
      />
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14 0 1.55-.01 2.8-.01 3.18 0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.73V1.73C24 .77 23.21 0 22.23 0Z" />
    </svg>
  );
}

function TextField({
  icon: Icon,
  trailing,
  ...props
}: {
  icon: LucideIcon;
  trailing?: ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex h-12 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 transition-colors focus-within:border-violet-500/60 focus-within:bg-white/[0.05]">
      <Icon className="size-4 shrink-0 text-zinc-500" />
      <input
        {...props}
        className="w-full min-w-0 bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none"
      />
      {trailing}
    </div>
  );
}

function PasswordToggle({
  visible,
  onToggle,
}: {
  visible: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={visible ? "Hide password" : "Show password"}
      className="shrink-0 text-zinc-500 transition-colors hover:text-zinc-300"
    >
      {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
    </button>
  );
}

function CPasswordToggle({
  visible,
  onToggle,
}: {
  visible: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={visible ? "Hide password" : "Show password"}
      className="shrink-0 text-zinc-500 transition-colors hover:text-zinc-300"
    >
      {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
    </button>
  );
}

export function SignUpForm() {
  const router = useRouter();

  const [role, setRole] = useState<Role>("seeker");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [CshowPassword, setCShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!name.trim()) return setError("Please enter your full name.");
    if (!email.trim()) return setError("Please enter your email address.");
    if (password.length < 8)
      return setError("Password must be at least 8 characters long.");
    if (password !== confirm) return setError("Passwords do not match.");
    if (!agreed) return setError("Please agree to the Terms of Service.");

    setLoading(true);
    const { data: signUpData, error: signUpError } =
      await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        role: role,
        password,
      });
    setLoading(false);

    if (signUpError) {
      setError(
        signUpError.message ?? "Something went wrong. Please try again.",
      );
      return;
    }
    console.log(signUpData);
    router.push("/");
  }

  async function social(provider: "google" | "github" | "linkedin") {
    setError(null);
    const { error: socialError } = await authClient.signIn.social({
      provider,
      callbackURL: "/",
    });
    if (socialError) {
      setError(socialError.message ?? "Social sign in is not available yet.");
    }
  }

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[46fr_54fr]">
      {/* ── Left: brand story ─────────────────────────────── */}
      <section className="relative flex items-start overflow-hidden bg-black px-8 pb-16 pt-14 sm:px-12 sm:pt-20 lg:px-16">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 -top-28 size-[420px] rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.4),transparent_65%)] blur-2xl"
        />

        <div className="relative z-10 w-full max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium text-white backdrop-blur">
            <Rocket className="size-3.5 text-violet-400" />
            Join the Future of Work
          </span>

          <h1 className="mt-7 text-5xl font-bold leading-[1.03] tracking-tight sm:text-6xl">
            <span className="block">Find Your</span>
            <span className="block bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
              Dream Job
            </span>
            <span className="block">Today</span>
          </h1>

          <p className="mt-6 max-w-md text-sm leading-relaxed text-zinc-400 sm:text-[15px]">
            Connect with top companies, explore exciting opportunities, and grow
            your career with HireLoop.
          </p>

          <div className="mt-10 grid max-w-md grid-cols-3 gap-5">
            {features.map((feature) => (
              <div key={feature.label}>
                <span className="grid size-11 place-items-center rounded-xl border border-violet-500/25 bg-violet-500/15">
                  <feature.icon className="size-5 text-violet-300" />
                </span>
                <p className="mt-3 text-xs font-medium leading-snug text-zinc-300">
                  {feature.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Right: sign up card ───────────────────────────── */}
      <section className="relative flex items-center justify-center overflow-hidden border-t border-white/5 bg-[#08080d] px-6 py-14 sm:px-10 lg:border-l lg:border-t-0">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-80 w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/35 blur-[110px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-28 -right-20 size-80 rounded-full bg-indigo-600/20 blur-[100px]"
        />

        <div className="relative z-10 w-full max-w-[440px] rounded-3xl border border-white/10 bg-[#0d0d14]/85 px-6 pb-7 pt-8 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.85)] backdrop-blur-xl sm:px-8">
          <div className="mx-auto grid size-14 place-items-center rounded-2xl border border-white/10 bg-[#14122b] shadow-lg shadow-violet-900/30">
            <LoopMark className="h-7 w-12" />
          </div>

          <h2 className="mt-5 text-center text-2xl font-bold tracking-tight">
            Create Your Account
          </h2>
          <p className="mt-1.5 text-center text-sm text-zinc-400">
            Get started in seconds
          </p>

          {/* Role picker */}
          <form>
            <div
              className="mt-6 grid grid-cols-3 gap-3"
              role="radiogroup"
              aria-label="Account type"
            >
              {roles.map((item) => {
                const selected = role === item.id;
                return (
                  <label
                    key={item.id}
                    className={cn(
                      rolePillClass,
                      selected
                        ? "border-[#5C53FE] bg-[#5C53FE]/15 text-white"
                        : "border-white/10 bg-[#1A1A1F] text-white/70 hover:border-white/25 hover:text-white",
                    )}
                  >
                     <input
                      type="radio"
                      name="role"
                      value={item.id}
                      checked={selected}
                      onChange={() =>
                        setRole(item.id)
                      }
                      className="sr-only"
                    />
                    <item.icon />
                    <span>{item.label}</span>
                  </label>
                );
              })}
            </div>
          </form>

          {/* Form */}
          <form onSubmit={submit} className="mt-6 space-y-3">
            <TextField
              icon={User}
              type="text"
              name="name"
              autoComplete="name"
              placeholder="Full Name"
              aria-label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              icon={Mail}
              type="email"
              name="email"
              autoComplete="email"
              placeholder="Email Address"
              aria-label="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              icon={Lock}
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete="new-password"
              placeholder="Create Password"
              aria-label="Create Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              trailing={
                <PasswordToggle
                  visible={showPassword}
                  onToggle={() => setShowPassword((v) => !v)}
                />
              }
            />
            <TextField
              icon={Lock}
              type={CshowPassword ? "text" : "password"}
              name="confirm"
              autoComplete="new-password"
              placeholder="Confirm Password"
              aria-label="Confirm Password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              trailing={
                <CPasswordToggle
                  visible={CshowPassword}
                  onToggle={() => setCShowPassword((v) => !v)}
                />
              }
            />

            <label className="flex cursor-pointer items-start gap-2.5 pt-1 text-xs leading-relaxed text-zinc-400">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="peer sr-only"
              />
              <span
                className={cn(
                  "mt-0.5 grid size-4 shrink-0 place-items-center rounded-[4px] border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-violet-500/50",
                  agreed
                    ? "border-violet-500 bg-violet-600"
                    : "border-zinc-600 bg-transparent",
                )}
              >
                {agreed && (
                  <Check className="size-3 text-white" strokeWidth={3} />
                )}
              </span>
              <span>
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="text-violet-400 underline underline-offset-2 hover:text-violet-300"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-violet-400 underline underline-offset-2 hover:text-violet-300"
                >
                  Privacy Policy
                </Link>
              </span>
            </label>

            {error && (
              <p
                role="alert"
                className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 text-sm font-semibold text-white shadow-lg shadow-violet-600/25 transition-all hover:from-violet-500 hover:to-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                "Creating account…"
              ) : (
                <>
                  Create Account
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          {/* Social sign in */}
          <div className="mt-6 flex items-center gap-3 text-[11px] text-zinc-500">
            <span aria-hidden className="h-px flex-1 bg-white/10" />
            or continue with
            <span aria-hidden className="h-px flex-1 bg-white/10" />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => social("google")}
              className="flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] text-xs font-medium text-white transition-colors hover:bg-white/[0.07]"
            >
              <Image
                src={googleLogo}
                alt=""
                width={16}
                height={16}
                className="rounded-full"
              />
              Google
            </button>
            <button
              type="button"
              onClick={() => social("github")}
              className="flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] text-xs font-medium text-white transition-colors hover:bg-white/[0.07]"
            >
              <GitHubIcon className="size-4" />
              GitHub
            </button>
          </div>

          <p className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-zinc-500">
            <ShieldCheck className="size-3.5" />
            Your information is safe with us.
          </p>
        </div>
      </section>
    </div>
  );
}
