import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "./ui/toaster";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";

interface ProvidersProps {
  children: React.ReactNode;
}

export default async function Providers({ children }: ProvidersProps) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem>
        <NuqsAdapter>{children}</NuqsAdapter>
        <Toaster />
      </NextThemesProvider>
    </SessionProvider>
  );
}
