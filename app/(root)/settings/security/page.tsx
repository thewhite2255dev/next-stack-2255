import AuthenticationForm from "@/components/settings/authentication-form";
import Header from "@/components/settings/header";
import PasswordForm from "@/components/settings/password-form";
import { currentUser } from "@/lib/auth";
import { SiteConfig } from "@/lib/site-config";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Security settings - ${SiteConfig.title}`,
};

export default async function SettingsSecurityPage() {
  const user = await currentUser();

  return (
    <div className="space-y-6">
      <Header
        title="Password and authentication"
        label=" Update your password and authentication settings."
      />
      <PasswordForm />
      <AuthenticationForm user={user} />
    </div>
  );
}
