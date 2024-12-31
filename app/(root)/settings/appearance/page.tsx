import AppearanceForm from "@/components/settings/appearance-form";
import Header from "@/components/settings/header";
import { SiteConfig } from "@/lib/site-config";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Appearance settings - ${SiteConfig.title}`,
};

export default function SettingsAppearancePage() {
  return (
    <div className="space-y-6">
      <Header title="Appearance" label="Update your appearance settings." />
      <AppearanceForm />
    </div>
  );
}
