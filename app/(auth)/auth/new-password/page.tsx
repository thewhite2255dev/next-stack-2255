import NewPasswordForm from "@/components/auth/new-password-form";

import { SiteConfig } from "@/lib/site-config";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `New password - ${SiteConfig.title}`,
};

export default function NewPasswordPage() {
  return <NewPasswordForm />;
}
