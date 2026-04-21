import { Navbar } from '@/components/layouts/navbar';
import { StructuredData } from '@/components/structured-data';
import { metadata } from '@/lib/sitemap';
import { Providers } from '@/providers/root-provider';
import { Geist, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-mono',
  display: 'swap',
});

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
        className={cn('antialiased font-sans', geist.variable, jetbrainsMono.variable)}
        suppressHydrationWarning
      >
        <StructuredData />
        <Providers>
          <Navbar />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
