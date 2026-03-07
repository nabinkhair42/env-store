import Hero from './hero';
import HowItWorks from './how-it-works';
import ValueProps from './value-props';
import FAQ from './faq';
import CTASection from './cta-section';
import SiteFooter from '../layouts/site-footer';

export default function LandingShell() {
  return (
    <>
      <div className="page-rails flex flex-col">
        <Hero />
        <div className="section-divider" aria-hidden="true" />
        <HowItWorks />
        <div className="section-divider" aria-hidden="true" />
        <ValueProps />
        <div className="section-divider" aria-hidden="true" />
        <FAQ />
        <div className="section-divider" aria-hidden="true" />
        <CTASection />
      </div>
      <SiteFooter />
    </>
  );
}
