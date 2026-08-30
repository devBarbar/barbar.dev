import type { Metadata } from "next";

import LocaleRootLayout from "@/app/_localized/LocaleRootLayout";
import { getSiteMetadata } from "@/app/_localized/metadata";
import "../globals.css";

export const metadata: Metadata = getSiteMetadata("en");

export default function EnglishRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <LocaleRootLayout locale="en">{children}</LocaleRootLayout>;
}
