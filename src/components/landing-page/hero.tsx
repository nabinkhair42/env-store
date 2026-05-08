import { CTAButtons } from '@/components/landing-page/cta-buttons';
import Image from 'next/image';

export default function Hero() {
  return (
    <section>
      <div className="mx-auto flex w-full max-w-4xl flex-col px-6 pt-24 pb-12 sm:pt-32">
        <p className="font-medium text-muted-foreground">
          [01] Environment variables, managed
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Your{' '}
          <span className="rounded-2xl border-b px-2 text-muted-foreground">
            .env
          </span>{' '}
          files,
          <br className="hidden sm:block" />
          always recoverable.
        </h1>
        <p className="mt-5 max-w-2xl text-muted-foreground sm:text-lg">
          Stop losing environment variables when you wipe a machine or onboard a
          teammate. Back up, encrypt, and share configs across dev, staging, and
          production. No CLI required.
        </p>
        <div className="mt-8">
          <CTAButtons />
        </div>
      </div>

      <div className="mx-auto w-full max-w-5xl px-6">
        <div className="overflow-hidden rounded-xl border bg-muted p-1.5 shadow-2xl shadow-black/10">
          <div className="overflow-hidden rounded-lg border">
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
