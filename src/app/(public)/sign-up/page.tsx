import type { Metadata } from "next";
import { SignUpForm } from "@/components/auth/sign-up-form";

export const metadata: Metadata = {
  title: "Create an account | hireloop",
  description:
    "Join hireloop — create your account and land your next role faster.",
};

export default function SignUpPage() {
  return <SignUpForm />;
}
