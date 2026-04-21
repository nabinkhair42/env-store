import Hero from './hero';
import HowItWorks from './how-it-works';
import ValueProps from './value-props';
import SecurityNotes from './security-notes';
import FAQ from './faq';
import CTASection from './cta-section';
import SiteFooter from '../layouts/site-footer';

export default function LandingShell() {
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
  );
}
