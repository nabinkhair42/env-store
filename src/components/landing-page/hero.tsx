import { CTAButtons } from '@/components/landing-page/cta-buttons';
import { OssBadge } from '@/components/landing-page/oss-badge';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[640px] bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,oklch(0.488_0.243_264.376_/_0.18),transparent_70%)]"
      />

      <div className="relative mx-auto flex w-full max-w-[1024px] flex-col items-start px-6 pt-24 pb-12 sm:pt-32">
        <OssBadge />

        <h1 className="mt-6 text-4xl font-medium tracking-[-0.022em] text-balance sm:text-[56px] sm:leading-[1.05]">
          Your <span className="font-mono text-muted-foreground">.env</span>{' '}
          files,
          <br className="hidden sm:block" />
          always recoverable.
        </h1>

        <p className="mt-5 max-w-[560px] text-base text-muted-foreground sm:text-[17px] sm:leading-[1.55]">
          Back up, encrypt, and share environment variables across dev, staging,
          and production. Sign in with GitHub — no CLI, no config, no paid tier.
        </p>

        <div className="mt-8">
          <CTAButtons primaryLabel="Get started — it's free" secondaryLabel="Star on GitHub" />
        </div>

        <p className="mt-4 font-mono text-xs text-muted-foreground/70">
          AES-256-GCM at rest · GitHub OAuth · MIT licensed
        </p>
      </div>

      <div className="relative mx-auto w-full max-w-[1280px] px-6 pb-8">
        <div className="relative overflow-hidden rounded-xl border border-border/80 bg-muted/40 p-1 shadow-2xl shadow-black/30">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-foreground/30 to-transparent"
          />
          <div className="overflow-hidden rounded-lg border border-border/60">
            <Image
              src="/demos/dashboard-dark.png"
              alt="ENV Store dashboard showing projects with team members"
              width={1920}
              height={1080}
              className="hidden h-auto w-full dark:block"
              priority
            />
            <Image
              src="/demos/dashboard-light.png"
              alt="ENV Store dashboard showing projects with team members"
              width={1920}
              height={1080}
              className="block h-auto w-full dark:hidden"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
