import type { Metadata } from "next";
import Script from "next/script";

import LocaleRootLayout from "@/app/_localized/LocaleRootLayout";
import { getSiteMetadata } from "@/app/_localized/metadata";
import "../globals.css";

export const metadata: Metadata = getSiteMetadata("en");

const removeLegacyEnglishPrefix = String.raw`
  (() => {
    const pathname = window.location.pathname.toLowerCase();
    const normalizedPathname = pathname.replace(/\/+$/, "") || "/";

    if (
      normalizedPathname !== "/en" &&
      !normalizedPathname.startsWith("/en/")
    ) {
      return;
    }

    const canonicalPath = normalizedPathname.slice(3) || "/";
    window.history.replaceState(
      window.history.state,
      "",
      canonicalPath + window.location.search + window.location.hash,
    );
  })();
`;

export default function EnglishRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LocaleRootLayout locale="en">
      <Script id="remove-legacy-english-prefix" strategy="beforeInteractive">
        {removeLegacyEnglishPrefix}
      </Script>
      {children}
    </LocaleRootLayout>
  );
}
