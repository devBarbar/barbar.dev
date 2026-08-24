import { NextRequest, NextResponse } from "next/server";

const supportedLocales = ["en", "de"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const lowercasePathname = pathname.toLowerCase();

  if (pathname !== lowercasePathname) {
    request.nextUrl.pathname = lowercasePathname;
    return NextResponse.redirect(request.nextUrl, 308);
  }

  const firstSegment = pathname.split("/")[1];

  if (supportedLocales.includes(firstSegment)) {
    return NextResponse.next();
  }

  request.nextUrl.pathname = `/en${pathname}`;
  return NextResponse.redirect(request.nextUrl, 308);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|icon|apple-icon|.*\\..*).*)"],
};
