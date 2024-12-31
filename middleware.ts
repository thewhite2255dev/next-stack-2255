import { NextResponse } from "next/server";
import authConfig from "./auth.config";
import NextAuth from "next-auth";
import {
  apiAuthPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  DEFAULT_START_REDIRECT,
  protectedRoutesPrefix,
} from "./routes";
import { currentUser } from "./lib/auth";

const { auth } = NextAuth(authConfig);

export default auth(async function middleware(req) {
  const { nextUrl } = req;
  const user = await currentUser();
  const isLoggedIn = !!user;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isProtectedRoute = protectedRoutesPrefix.some((prefix) =>
    nextUrl.pathname.startsWith(prefix),
  );

  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return NextResponse.next();
  }

  if (isLoggedIn) {
    if (
      user &&
      user?.isOAuth &&
      !user?.password &&
      nextUrl.pathname !== DEFAULT_START_REDIRECT
    ) {
      return NextResponse.redirect(new URL(DEFAULT_START_REDIRECT, nextUrl));
    }
  }

  if (!isLoggedIn && isProtectedRoute) {
    let callbackUrl = nextUrl.pathname;

    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    const isExternalUrl = callbackUrl.startsWith("http");
    const validCallbackUrl = isExternalUrl ? "/" : callbackUrl;
    const encodedCallbackUrl = encodeURIComponent(validCallbackUrl);

    return NextResponse.redirect(
      new URL(`/auth/login?callback_url=${encodedCallbackUrl}`, nextUrl),
    );
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
