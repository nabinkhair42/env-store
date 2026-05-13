import FAQ from '@/components/landing-page/faq';
import FinalCTA from '@/components/landing-page/final-cta';
import Hero from '@/components/landing-page/hero';
import HowItWorks from '@/components/landing-page/how-it-works';
import PainPoints from '@/components/landing-page/pain-points';
import ValueProps from '@/components/landing-page/value-props';
import SiteFooter from '@/components/layouts/site-footer';

const page = () => {
  return (
    <>
      <Hero />
      <PainPoints />
      <HowItWorks />
      <ValueProps />
      <FAQ />
      <FinalCTA />
      <SiteFooter />
    </>
  );
};

export default page;
