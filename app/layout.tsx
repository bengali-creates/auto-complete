import type { Metadata } from 'next';
import { JetBrains_Mono, Syne } from 'next/font/google';
import './globals.css';
import { cn } from "@/lib/utils";

/** Syne — geometric, distinctive display font for the dark UI */
const syne = Syne({ subsets: ['latin'], variable: '--font-sans' });

/** JetBrains Mono — crisp monospace for code blocks */
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'AnySolver — AI Assignment Helper',
  description: 'Solve programming assignments with AI. Get print-ready solutions with proper formatting.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn(syne.variable, jetbrainsMono.variable)} suppressHydrationWarning>
      <body className="font-sans antialiased bg-[#080808] text-white selection:bg-violet-500/30 selection:text-violet-200">
        {children}
      </body>
    </html>
  );
}