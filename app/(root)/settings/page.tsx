import Header from "@/components/settings/header";
import ProfileForm from "@/components/settings/profile-form";
import { currentUser } from "@/lib/auth";
import { SiteConfig } from "@/lib/site-config";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Profile settings - ${SiteConfig.title}`,
};

export default async function SettingsProfilePage() {
  const user = await currentUser();

  return (
    <div className="space-y-6">
      <Header title="Profile" label="Update your account settings." />
      <ProfileForm user={user} />
    </div>
  );
}
