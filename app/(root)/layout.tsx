"use client";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className={"flex h-screen overflow-hidden"}>
      <div className="flex flex-1 flex-col">
        <main className="overflow-auto px-4 py-2 max-sm:py-6"> {children}</main>
      </div>
    </div>
  );
}
