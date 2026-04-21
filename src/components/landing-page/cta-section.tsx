import { CTAButtons } from './cta-buttons';

export default function CTASection() {
  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col items-center px-6 py-24 text-center sm:py-32">
      <p className="text-xs font-medium text-muted-foreground mb-4">
        Get started
      </p>
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Stop losing your environment variables
      </h2>
      <p className="mt-4 max-w-lg text-muted-foreground">
        Set up in under a minute. Free forever, open source, no credit card.
      </p>
      <div className="mt-8">
        <CTAButtons primaryLabel="Get Started Free" secondaryLabel="View on GitHub" />
      </div>
      <div className="mt-10 flex gap-8 text-xs text-muted-foreground">
        <span>Free forever</span>
        <span className="text-muted-foreground/30">·</span>
        <span>Open source</span>
        <span className="text-muted-foreground/30">·</span>
        <span>No credit card</span>
      </div>
    </section>
  );
}
