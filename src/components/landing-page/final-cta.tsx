import { CTAButtons } from '@/components/landing-page/cta-buttons';
import { OssBadge } from '@/components/landing-page/oss-badge';

export default function FinalCTA() {
  return (
    <section className="relative overflow-hidden border-t border-border/60">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[400px] bg-[radial-gradient(ellipse_50%_60%_at_50%_100%,oklch(0.488_0.243_264.376_/_0.18),transparent_70%)]"
      />
      <div className="relative mx-auto flex w-full max-w-[1024px] flex-col items-start px-6 py-24 sm:py-32">
        <OssBadge />
        <h2 className="mt-6 text-3xl font-medium tracking-[-0.022em] text-balance sm:text-[48px] sm:leading-[1.05]">
          Stop losing keys.
        </h2>
        <p className="mt-4 max-w-[480px] text-base text-muted-foreground sm:text-[17px] sm:leading-[1.55]">
          Sign in with GitHub. Paste your <span className="font-mono">.env</span>.
          Your team has it in under a minute.
        </p>
        <div className="mt-8">
          <CTAButtons primaryLabel="Get started — it's free" secondaryLabel="Star on GitHub" />
        </div>
      </div>
    </section>
  );
}
