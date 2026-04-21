import { CTAButtons } from './cta-buttons';

export default function CTASection() {
  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col items-center px-6 py-20 text-center sm:py-28">
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Ready to secure your environment variables?
      </h2>
      <p className="mt-4 max-w-lg text-muted-foreground">
        Join developers who trust ENV Store for reliable config management.
      </p>
      <div className="mt-8">
        <CTAButtons primaryLabel="Get Started Free" secondaryLabel="View on GitHub" />
      </div>
      <div className="mt-10 flex gap-6 text-xs text-muted-foreground">
        <span>Free forever</span>
        <span>Open source</span>
      </div>
    </section>
  );
}
