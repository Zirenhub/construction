import BottomNav from "@/components/BottomNav";
import Sidebar from "@/components/Sidebar";
import { ThemeProvider } from "@/components/ThemeProvider";
import type { Metadata } from "next";
import "./globals.css";
import { Tasks } from "@/components/Tasks";

export const metadata: Metadata = { title: "Строеж Pro" };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bg" suppressHydrationWarning>
      <body className="flex flex-col h-screen bg-canvas text-ink md:flex-row">
        <ThemeProvider>
          <Sidebar />
          <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
            {children}
          </main>
          <Tasks />
          <BottomNav />
        </ThemeProvider>
      </body>
    </html>
  );
}
