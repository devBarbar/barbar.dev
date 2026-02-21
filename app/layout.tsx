import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Barbar Ahmad | Software Engineer",
    description: "Portfolio of Barbar Ahmad, Lead Software Engineer",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased selection:bg-primary/30`}>
                {/* Abstract Background Gradient Graphic */}
                <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-background to-background"></div>
                {children}
            </body>
        </html>
    );
}
