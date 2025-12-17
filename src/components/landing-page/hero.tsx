import { CTAButtons } from '@/components/landing-page/cta-buttons';
import { glimpse } from '@/components/ui/glimpse/server';

export default async function Hero() {
  const githubData = await glimpse('https://github.com/nabinkhair42/env-store');
  const glimpseData = {
    title: githubData.title || 'ENV Store',
    description:
      githubData.description ||
      'A tool to manage your environment variables securely.',
    image: githubData.image,
  };

  return (
    <section className="text-center min-h-[calc(100svh-100px)] flex flex-col justify-center">
      <div className="flex flex-col items-center gap-8">
        <h1 className="text-5xl font-medium tracking-tight text-foreground sm:text-6xl lg:text-7xl max-w-4xl">
          Never lose your <span className="border-b-2">.env</span>
          {` `}
          again
        </h1>

        <p className="mx-auto mb-6 max-w-2xl text-lg text-muted-foreground">
          ENV Store keeps your project environment variables safe, organized,
          and recoverable. Access your config from anywhere, anytime.
        </p>

        <CTAButtons glimpseData={glimpseData} />
      </div>
    </section>
  );
}
