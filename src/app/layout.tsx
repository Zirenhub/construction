import BottomNav from '@/components/BottomNav';
import Sidebar from '@/components/Sidebar';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = { title: 'Строеж Pro' };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bg">
      <body className="flex flex-col h-screen bg-zinc-950 text-zinc-100 md:flex-row">
        <Sidebar />
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
