import { StructuredData } from '@/components/seo/structured-data';
import { ReactNode } from 'react';

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <StructuredData />
      {children}
    </>
  );
}
