"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useCurrentUser from "@/hooks/use-current-user";
import { SiteConfig } from "@/lib/site-config";

export default function HomePage()  {
  const user = useCurrentUser();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="text-center">
        {user ? (
          <>
            <h1 className="text-3xl font-bold mb-4">Welcome back, {user.name}!</h1>
            <p className="text-lg mb-6">We&apos;re glad to see you again.</p>
          </>
        ) : (
          <>
            <h1 className="text-4xl font-bold mb-4">Welcome to {SiteConfig.title}!</h1>
            <p className="text-lg mb-6">
              Explore our features, connect with the community, and start your journey.
            </p>
          </>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>About {SiteConfig.title} </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg mb-4">
            This is a starter platform for full stack projects with Next.js. It provides an efficient
            structure for developing web applications using modern technologies. The key technologies powering
            the platform are:
          </p>
          <ul className="list-disc pl-6 text-lg">
            <li><strong>Next.js</strong>: For server-side rendering and seamless full stack development.</li>
            <li><strong>Tailwind CSS</strong>: For efficient, customizable, and responsive styling.</li>
            <li><strong>Prisma</strong>: For database management and ORM support, ensuring smooth data interaction.</li>
            <li><strong>PostgreSQL</strong>: A powerful relational database for secure and scalable data storage.</li>
            <li><strong>ShadCN</strong>: A component library that simplifies building beautiful UIs with consistency.</li>
            <li><strong>Lucide React</strong>: A collection of open-source, customizable icons for React applications.</li>
          </ul>
          <p className="text-lg mt-4">
            Whether you&apos;re building your first app or managing complex projects, this platform gives you
            the tools to get started quickly with minimal setup.
          </p>
        </CardContent>
      </Card>

      <div className="mt-10 text-center">
        <p className="text-sm opacity-80">© 2024 {SiteConfig.title}. All Rights Reserved.</p>
      </div>
    </div>
  );
};