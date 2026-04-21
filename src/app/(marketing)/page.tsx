import CTASection from '@/components/landing-page/cta-section';
import FAQ from '@/components/landing-page/faq';
import Hero from '@/components/landing-page/hero';
import HowItWorks from '@/components/landing-page/how-it-works';
import SecurityNotes from '@/components/landing-page/security-notes';
import ValueProps from '@/components/landing-page/value-props';
import SiteFooter from '@/components/layouts/site-footer';

const page = () => {
  return (
    <>
      <Hero />
      <HowItWorks />
      <ValueProps />
      <SecurityNotes />
      <FAQ />
      <CTASection />
      <SiteFooter />
    </>
  )
};

export default page;
