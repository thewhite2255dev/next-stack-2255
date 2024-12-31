"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Header from "@/components/auth/header";
import BackButton from "@/components/auth/back-button";
import Social from "@/components/auth/social";
import { cn } from "@/lib/utils";

interface CardWrapperProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  headerLabel?: string;
  headerTitle: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
}

export default function CardWrapper({
  children,
  headerLabel,
  headerTitle,
  backButtonLabel,
  backButtonHref,
  showSocial,
  className,
}: CardWrapperProps) {
  return (
    <Card className={cn("w-[425px] shadow-md", className)}>
      <CardHeader>
        <Header title={headerTitle} label={headerLabel} />
      </CardHeader>
      <CardContent>{children}</CardContent>
      {showSocial && (
        <CardFooter className="flex flex-col items-start space-y-6">
          <div className="flex w-full items-center">
            <div className="flex-grow border-t text-muted"></div>
            <span className="mx-4 text-sm text-muted-foreground">OR</span>
            <div className="flex-grow border-t text-muted"></div>
          </div>
          <Social />
        </CardFooter>
      )}
      <CardFooter className="flex items-center justify-center">
        <BackButton label={backButtonLabel} href={backButtonHref} />
      </CardFooter>
    </Card>
  );
}
