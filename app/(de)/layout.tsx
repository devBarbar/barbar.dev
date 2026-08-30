import type { Metadata } from "next";

import LocaleRootLayout from "@/app/_localized/LocaleRootLayout";
import { getSiteMetadata } from "@/app/_localized/metadata";
import "../globals.css";

export const metadata: Metadata = getSiteMetadata("de");

export default function GermanRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <LocaleRootLayout locale="de">{children}</LocaleRootLayout>;
}
