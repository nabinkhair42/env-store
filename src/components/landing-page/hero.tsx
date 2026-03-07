import { CTAButtons } from '@/components/landing-page/cta-buttons';

export default async function Hero() {
  return (
    <section className="relative flex flex-col items-center px-4 pb-0 pt-20 text-center sm:pt-28">
      {/* Vertical dashed guide lines */}
      <div
        className="pointer-events-none absolute inset-0 z-0 mx-auto hidden w-full max-w-5xl px-4 sm:block"
        aria-hidden="true"
      >
        <div className="absolute left-4 top-0 bottom-0 w-px border-l border-dashed border-border" />
        <div className="absolute right-4 top-0 bottom-0 w-px border-r border-dashed border-border" />
      </div>

      {/* Subtle glow */}
      <div className="hero-glow" aria-hidden="true" />

      {/* Main headline */}
      <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
        Your <span className="text-muted-foreground">.env</span> files,
        <br className="hidden sm:block" />
        always recoverable
      </h1>

      {/* Subtitle */}
      <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
        Stop losing environment variables. Back up, organize, and recover your
        configs instantly.
      </p>

      {/* CTA Buttons */}
      <div className="mt-7">
        <CTAButtons />
      </div>

      {/* Horizontal dashed line at mockup top */}
      <div
        className="relative hidden w-full self-stretch sm:block mt-14"
        aria-hidden="true"
      >
        <div
          className="absolute left-0 right-0 border-t border-dashed border-border"
          style={{
            marginLeft: 'calc(var(--rail-offset) - 1rem)',
            marginRight: 'calc(var(--rail-offset) - 1rem)',
          }}
        />
      </div>

      {/* Code mockup */}
      <div className="mt-14 w-full max-w-5xl px-4">
        <div className="overflow-hidden rounded-t-lg border border-border bg-muted/50 shadow-2xl">
          {/* Browser chrome */}
          <div className="flex items-center gap-2 border-b border-border bg-muted px-4 py-3">
            <div className="flex gap-1.5">
              <div className="size-3 rounded-full bg-red-500" />
              <div className="size-3 rounded-full bg-yellow-500" />
              <div className="size-3 rounded-full bg-green-500" />
            </div>
            <div className="ml-3 flex-1 rounded bg-muted/50 px-3 py-1 text-left">
              <span className="text-xs text-muted-foreground font-mono">
                localhost:3000/dashboard
              </span>
            </div>
          </div>

          {/* Dashboard content */}
          <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-dashed border-border">
              <div>
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">
                  Production API
                </h3>
                <p className="text-xs text-muted-foreground font-mono mt-0.5">
                  12 variables
                </p>
              </div>
              <div className="flex gap-2">
                <div className="px-3 py-1 text-xs font-mono bg-muted/50 border border-border text-muted-foreground">
                  COPY
                </div>
                <div className="px-3 py-1 text-xs font-mono bg-muted/50 border border-border text-muted-foreground">
                  EXPORT
                </div>
              </div>
            </div>

            {/* Variable rows */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 p-3 border border-dashed border-border/60 bg-muted/20 font-mono text-xs min-w-0">
                <span className="text-emerald-500 dark:text-emerald-400 flex-shrink-0">
                  DATABASE_URL
                </span>
                <span className="text-muted-foreground/40 flex-shrink-0">
                  =
                </span>
                <span className="text-muted-foreground truncate flex-1 min-w-0">
                  postgresql://prod.db...
                </span>
                <div className="text-muted-foreground/50 flex-shrink-0">
                  ●●●●●
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 border border-dashed border-border/60 bg-muted/20 font-mono text-xs min-w-0">
                <span className="text-blue-500 dark:text-blue-400 flex-shrink-0">
                  API_KEY
                </span>
                <span className="text-muted-foreground/40 flex-shrink-0">
                  =
                </span>
                <span className="text-muted-foreground truncate flex-1 min-w-0">
                  sk_live_51...
                </span>
                <div className="text-muted-foreground/50 flex-shrink-0">
                  ●●●●●
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 border border-dashed border-border/60 bg-muted/20 font-mono text-xs min-w-0">
                <span className="text-purple-500 dark:text-purple-400 flex-shrink-0">
                  JWT_SECRET
                </span>
                <span className="text-muted-foreground/40 flex-shrink-0">
                  =
                </span>
                <span className="text-muted-foreground truncate flex-1 min-w-0">
                  eyJhbGciOiJ...
                </span>
                <div className="text-muted-foreground/50 flex-shrink-0">
                  ●●●●●
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 border border-dashed border-border/60 bg-muted/20 font-mono text-xs opacity-60 min-w-0">
                <span className="text-muted-foreground flex-shrink-0">
                  SMTP_HOST
                </span>
                <span className="text-muted-foreground/40 flex-shrink-0">
                  =
                </span>
                <span className="text-muted-foreground/70 truncate flex-1 min-w-0">
                  smtp.gmail.com
                </span>
                <div className="text-muted-foreground/40 flex-shrink-0">
                  ●●●●●
                </div>
              </div>
            </div>

            {/* Footer stats */}
            <div className="mt-6 flex items-center justify-between text-xs">
              <div className="flex items-center gap-4 text-muted-foreground">
                <span>Last updated: 2 hours ago</span>
              </div>
              <div className="text-emerald-500/80 dark:text-emerald-400/60">
                All synced ✓
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
