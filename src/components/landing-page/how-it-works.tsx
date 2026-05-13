import Image from 'next/image';

const steps = [
  {
    number: '01',
    title: 'Sign in with GitHub',
    description:
      'One-click OAuth. No passwords. No email verification. No setup screens.',
    image: {
      dark: '/demos/signin-dark.png',
      light: '/demos/signin-light.png',
      alt: 'Sign in page with Continue with GitHub button',
    },
  },
  {
    number: '02',
    title: 'Create a project',
    description:
      'Dev, staging, and production out of the box. Add custom environments anytime.',
    image: {
      dark: '/demos/add-project-dark.png',
      light: '/demos/add-project-light.png',
      alt: 'Create new project dialog',
    },
  },
  {
    number: '03',
    title: 'Paste your .env',
    description:
      'Drop in a whole file. Each value is encrypted before it touches the database.',
    image: {
      dark: '/demos/multiple-environment-dark.png',
      light: '/demos/multiple-environment-light.png',
      alt: 'Variables editor with environment tabs',
    },
  },
  {
    number: '04',
    title: 'Share with your team',
    description:
      'Invite teammates by GitHub handle. Editor or viewer roles per project.',
    image: {
      dark: '/demos/team-member-dark.png',
      light: '/demos/team-member-light.png',
      alt: 'Team invite dialog',
    },
  },
];

export default function HowItWorks() {
  return (
    <section className="relative border-t border-border/60 bg-[linear-gradient(to_bottom,oklch(0.488_0.243_264.376_/_0.04),transparent_30%)]">
      <div className="mx-auto w-full max-w-[1024px] px-6 py-24 sm:py-32">
        <div className="grid gap-8 sm:grid-cols-12">
          <div className="sm:col-span-7">
            <p className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
              How it works
            </p>
            <h2 className="mt-3 text-2xl font-medium tracking-[-0.015em] text-balance sm:text-[32px] sm:leading-[1.15]">
              Four steps from sign-in to a shared&nbsp;
              <span className="font-mono">.env</span>.
            </h2>
          </div>
          <p className="text-base text-muted-foreground sm:col-span-5 sm:self-end sm:text-[15px] sm:leading-[1.6]">
            A workflow that fits how you already ship. No CLI required.
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2">
          {steps.map((step) => (
            <div
              key={step.number}
              className="group relative flex flex-col overflow-hidden rounded-xl border border-border/60 bg-muted/20 transition-colors hover:border-border"
            >
              <div className="flex items-start justify-between p-5 pb-4">
                <div className="pr-6">
                  <span className="font-mono text-xs text-muted-foreground/60">
                    {step.number}
                  </span>
                  <h3 className="mt-3 text-[15px] font-medium tracking-tight">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>

              <div className="mt-auto px-3 pb-0">
                <div className="overflow-hidden rounded-t-md border border-b-0 border-border/60">
                  <Image
                    src={step.image.dark}
                    alt={step.image.alt}
                    width={960}
                    height={640}
                    className="hidden h-auto w-full dark:block"
                  />
                  <Image
                    src={step.image.light}
                    alt={step.image.alt}
                    width={960}
                    height={640}
                    className="block h-auto w-full dark:hidden"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
