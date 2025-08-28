import { CTAButtons } from '@/components/landing-page/cta-buttons';
import Logo from '@/components/ui/Logo';

interface HeroProps {
  title?: string;
  subtitle?: string;
}

export default function Hero({
  title = 'Never lose your .env again',
  subtitle = 'ENV Store keeps your project environment variables safe, organized, and recoverable—so you can bring any project back in minutes.',
}: HeroProps) {
  return (
    <section className="px-6 py-24 text-center h-[calc(100svh-100px)] flex flex-col justify-center">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="flex flex-col items-center gap-6">
        <Logo size="lg" />

        <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl max-w-4xl">
          {title}
        </h1>

        <p className="mx-auto mb-12 max-w-3xl text-muted-foreground leading-relaxed">
          {subtitle}
        </p>

        <CTAButtons />

        {/* Trust indicators */}
        <div className="mt-16 flex items-center gap-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span>Free to use</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-500" />
            <span>GitHub OAuth</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-purple-500" />
            <span>Open source</span>
          </div>
        </div>
      </div>
    </section>
  );
}
