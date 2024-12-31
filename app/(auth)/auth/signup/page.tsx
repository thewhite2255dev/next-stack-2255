import SignupForm from "@/components/auth/signup-form";

import { SiteConfig } from "@/lib/site-config";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Signup - ${SiteConfig.title}`,
};

export default function SignupPage() {
  return <SignupForm />;
}
