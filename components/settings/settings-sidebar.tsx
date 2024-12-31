/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";

interface SettingsSidebarProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    label: string;
    Icon?: any;
  }[];
}

export default function SettingsSidebar({
  className,
  items,
  ...props
}: SettingsSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-1/5">
      <nav className={cn("flex flex-col space-y-1", className)} {...props}>
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              pathname === item.href ? "bg-muted" : "text-muted-foreground",
              "justify-start pl-0",
            )}
          >
            <span
              className={cn(
                "h-full w-1 rounded-full",
                pathname === item.href ? "bg-info" : "bg-transparent",
              )}
            ></span>
            <item.Icon />
            <div className="grid">
              <span className="truncate text-sm">{item.label}</span>
            </div>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
