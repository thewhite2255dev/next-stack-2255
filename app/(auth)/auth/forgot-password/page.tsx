import ForgotPasswordForm from "@/components/auth/forgot-password-form";

import { SiteConfig } from "@/lib/site-config";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Forgot password - ${SiteConfig.title}`,
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
