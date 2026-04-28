import { CTAButtons } from '@/components/landing-page/cta-buttons';
import { HeroMock } from '@/components/landing-page/hero-mock';

export default function Hero() {
  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col items-center px-6 pt-20 text-center sm:pt-28">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
        Your <span className="text-muted-foreground">.env</span> files,
        <br className="hidden sm:block" />
        always recoverable
      </h1>

      <p className="mt-5 max-w-2xl text-muted-foreground sm:text-lg">
        Stop losing environment variables. Back up, organize, and share your
        configurations across environments and teams — instantly.
      </p>

      <div className="mt-8">
        <CTAButtons />
      </div>

      <div className="mt-16 w-full max-w-3xl">
        <HeroMock />
      </div>
    </section>
  );
}
