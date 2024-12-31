import NewVerificationForm from "@/components/auth/new-verification-form";
import { SiteConfig } from "@/lib/site-config";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Email verification - ${SiteConfig.title}`,
};

export default function NewVerificationPage() {
  return <NewVerificationForm />;
}
