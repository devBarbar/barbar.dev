import { NextRequest, NextResponse } from "next/server";

const publicFilePattern = /\.[^/]+$/;

function normalizedRoutePath(pathname: string) {
  const lowercasePathname = pathname.toLowerCase();
  return lowercasePathname.length > 1
    ? lowercasePathname.replace(/\/+$/, "")
    : lowercasePathname;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const normalizedPathname = normalizedRoutePath(pathname);
  const hasOldEnglishPrefix =
    normalizedPathname === "/en" || normalizedPathname.startsWith("/en/");

  if (hasOldEnglishPrefix) {
    const destination = normalizedPathname.slice(3) || "/";
    const redirectUrl = new URL(request.url);
    redirectUrl.pathname = destination;
    return NextResponse.redirect(redirectUrl, 308);
  }

  if (publicFilePattern.test(pathname)) {
    return NextResponse.next();
  }

  if (pathname !== normalizedPathname) {
    const redirectUrl = new URL(request.url);
    redirectUrl.pathname = normalizedPathname;
    return NextResponse.redirect(redirectUrl, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|icon|apple-icon).*)",
  ],
};
