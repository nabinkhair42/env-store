import { Navbar } from '@/components/layouts/navbar';
import { metadata } from '@/lib/sitemap';
import { Providers } from '@/providers/root-provider';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-mono',
});

export { metadata };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`antialiased ${inter.variable} ${jetbrainsMono.variable} font-sans`}
        suppressHydrationWarning
      >
        <Providers>
          <Navbar />
          <div className="page-rails flex flex-col">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
