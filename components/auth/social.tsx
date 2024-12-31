"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import Image from "next/image";

export const socialButtons = [
  {
    name: "google",
    provider: "google",
    Icon: "/google.svg",
    label: "Continue with Google",
  },
  {
    name: "github",
    provider: "github",
    Icon: "/github.svg",
    label: "Continue with GitHub",
  },
];

export default function Social() {
  const handleClick = (provider: string) => {
    signIn(provider);
  };

  return (
    <div className="flex w-full flex-col space-y-3">
      {socialButtons.map((item) => (
        <Button
          key={item.name}
          size="lg"
          className="w-full space-x-3"
          variant="outline"
          onClick={() => handleClick(item.provider)}
        >
          <Image src={item.Icon} width={20} height={20} alt="social icon" />
          {item.label}
        </Button>
      ))}
    </div>
  );
}
