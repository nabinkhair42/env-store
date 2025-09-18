import Hero from './hero';
import ValueProps from './value-props';
import HowItWorks from './how-it-works';
import UseCases from './use-cases';
import SecurityNotes from './security-notes';
import FAQ from './faq';
import SiteFooter from './site-footer';

export default function LandingShell() {
  return (
    <div className="min-h-[100svh] ">
      <main className="border border-dashed border-t-0 border-b-0 max-w-5xl mx-auto">
        <Hero />
        <ValueProps />
        <HowItWorks />
        <UseCases />
        <SecurityNotes />
        <FAQ />
      </main>
      <SiteFooter />
    </div>
  );
}
