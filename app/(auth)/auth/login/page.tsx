import LoginForm from "@/components/auth/login-form";

import { SiteConfig } from "@/lib/site-config";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Login - ${SiteConfig.title}`,
};

export default function LoginPage() {
  return <LoginForm />;
}
