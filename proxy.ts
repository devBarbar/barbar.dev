import { NextRequest, NextResponse } from "next/server";

const publicFilePattern = /\.[^/]+$/;

function rewriteLegacyEnglishPath(
  request: NextRequest,
  normalizedPathname: string,
) {
  const destination = normalizedPathname.slice(3) || "/";
  const rewriteUrl = new URL(request.url);
  rewriteUrl.pathname = destination;

  return NextResponse.rewrite(rewriteUrl);
}

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
  const isLowercaseLegacyEnglishPath =
    pathname === pathname.toLowerCase() && hasOldEnglishPrefix;

  if (isLowercaseLegacyEnglishPath) {
    // The previous route contract permanently redirected `/` to `/en/`.
    // A redirect back to `/` can therefore loop in browsers that retained it.
    return rewriteLegacyEnglishPath(request, normalizedPathname);
  }

  if (pathname !== normalizedPathname) {
    if (publicFilePattern.test(pathname) && !hasOldEnglishPrefix) {
      return NextResponse.next();
    }

    const redirectUrl = new URL(request.url);
    redirectUrl.pathname = normalizedPathname;
    return NextResponse.redirect(redirectUrl, 308);
  }

  if (publicFilePattern.test(pathname)) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|icon|apple-icon).*)",
  ],
};
