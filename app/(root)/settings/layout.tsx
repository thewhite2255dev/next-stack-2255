"use client";

import SettingsSidebar from "@/components/settings/settings-sidebar";
import { Separator } from "@/components/ui/separator";
import { ToastProvider } from "@/components/ui/toast";
import { Settings, Lock, Paintbrush, User2 } from "lucide-react";

const settingsSidebarItems = [
  {
    label: "Profile",
    href: "/settings",
    Icon: User2,
  },
  {
    label: "Account",
    href: "/settings/account",
    Icon: Settings,
  },
  {
    label: "Password and authentication",
    href: "/settings/security",
    Icon: Lock,
  },
  {
    label: "Appearance",
    href: "/settings/appearance",
    Icon: Paintbrush,
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <ToastProvider>
      <div className="">
        <div className="space-y-3">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
            <p className="text-muted-foreground">
              Manage your account settings and keep your account up to date.
            </p>
          </div>
          <Separator />
        </div>
        <div className="flex flex-col gap-4 py-4 md:flex-row">
          <SettingsSidebar items={settingsSidebarItems} />
          <main className="max-w-screen-xl flex-1 pl-4">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}
