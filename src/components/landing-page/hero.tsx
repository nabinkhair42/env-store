import { CTAButtons } from '@/components/landing-page/cta-buttons';

export default async function Hero() {
  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col items-center px-6 pb-0 pt-20 text-center sm:pt-28">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
        Your <span className="text-muted-foreground">.env</span> files,
        <br className="hidden sm:block" />
        always recoverable
      </h1>

      <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
        Stop losing environment variables. Back up, organize, and recover your
        configs instantly.
      </p>

      <div className="mt-8">
        <CTAButtons />
      </div>

      {/* Dashboard mockup */}
      <div className="mt-16 w-full max-w-3xl">
        <div className="overflow-hidden rounded-lg border border-border bg-card">
          {/* Browser bar */}
          <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
            <span className="text-xs text-muted-foreground font-mono">
              localhost:3000/dashboard
            </span>
          </div>

          {/* Dashboard content */}
          <div className="p-5 sm:p-6">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <h3 className="text-sm font-semibold">Production API</h3>
                <p className="text-xs text-muted-foreground font-mono mt-0.5">
                  12 variables
                </p>
              </div>
              <div className="flex gap-2">
                <span className="px-2.5 py-1 text-xs font-mono border border-border rounded-md text-muted-foreground">
                  COPY
                </span>
                <span className="px-2.5 py-1 text-xs font-mono border border-border rounded-md text-muted-foreground">
                  EXPORT
                </span>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {[
                { key: 'DATABASE_URL', value: 'postgresql://prod.db...' },
                { key: 'API_KEY', value: 'sk_live_51...' },
                { key: 'JWT_SECRET', value: 'eyJhbGciOiJ...' },
                { key: 'SMTP_HOST', value: 'smtp.gmail.com' },
              ].map((env, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 rounded-md border border-border bg-muted/30 p-3 font-mono text-xs"
                >
                  <span className="text-foreground shrink-0">{env.key}</span>
                  <span className="text-muted-foreground/50">=</span>
                  <span className="text-muted-foreground truncate min-w-0">
                    {env.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground">
              <span>Last updated: 2 hours ago</span>
              <span>All synced</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
