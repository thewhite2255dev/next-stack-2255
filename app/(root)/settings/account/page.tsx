import AccountForm from "@/components/settings/account-form";
import DeleteAccountButton from "@/components/settings/delete-account-button";
import Header from "@/components/settings/header";
import { Button } from "@/components/ui/button";
import { currentUser } from "@/lib/auth";
import { SiteConfig } from "@/lib/site-config";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Account settings - ${SiteConfig.title}`,
};

export default async function SettingsAccountPage() {
  const user = await currentUser();
  return (
    <div className="space-y-6">
      <Header title="Account" label="Update your account settings." />
      <AccountForm user={user} />
      <div className="space-y-8">
        <Header
          title="Delete account"
          label="Permanently remove your Account and all of its contents from this
          platform. This action is not reversible, so please continue with
          caution."
        />
        <DeleteAccountButton>
          <Button type="button" variant="destructive">
            Delete account
          </Button>
        </DeleteAccountButton>
      </div>
    </div>
  );
}
