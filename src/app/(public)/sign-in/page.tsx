import type { Metadata } from "next";
import { SignInForm } from "@/components/auth/sign-in-form";

export const metadata: Metadata = {
  title: "Sign in | hireloop",
  description:
    "Sign in to hireloop — pick up where you left off and land your next role faster.",
};

export default function SignInPage() {
  return <SignInForm />;
}
