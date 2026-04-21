import { ErrorBoundary } from '@/components/error-boundary';
import { Navbar } from '@/components/layouts/navbar';
import { metadata } from '@/lib/sitemap';
import { cn } from '@/lib/utils';
import { Providers } from '@/providers/root-provider';
import { Geist } from 'next/font/google';
import './globals.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

export { metadata };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn('font-sans', geist.variable)}
    >
      <body
        className={cn('antialiased font-sans', geist.variable)}
        suppressHydrationWarning
      >
        <Providers>
          <Navbar />
          <main>
            <ErrorBoundary>{children}</ErrorBoundary>
          </main>
        </Providers>
      </body>
    </html>
  );
}
