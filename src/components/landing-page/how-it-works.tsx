import Image from 'next/image';

const steps = [
  {
    number: 1,
    title: 'Sign in with GitHub',
    description:
      'One-click authentication with your GitHub account. No passwords, no setup.',
    image: {
      dark: '/demos/signin-dark.png',
      light: '/demos/signin-light.png',
      alt: 'Sign in page with Continue with GitHub button',
    },
  },
  {
    number: 2,
    title: 'Create a project',
    description:
      'Each project gets development, staging, and production environments automatically.',
    image: {
      dark: '/demos/add-project-dark.png',
      light: '/demos/add-project-light.png',
      alt: 'Create new project dialog with name and description fields',
    },
  },
  {
    number: 3,
    title: 'Add your variables',
    description:
      'Paste .env content or add variables one by one. Everything is encrypted instantly.',
    image: {
      dark: '/demos/multiple-environment-dark.png',
      light: '/demos/multiple-environment-light.png',
      alt: 'Project view with environment tabs and key-value variable editor',
    },
  },
  {
    number: 4,
    title: 'Share & export',
    description:
      'Invite your team, assign roles, and export .env files per environment anytime.',
    image: {
      dark: '/demos/team-member-dark.png',
      light: '/demos/team-member-light.png',
      alt: 'Team members dialog showing invites with viewer and editor roles',
    },
  },
];

export default function HowItWorks() {
  return (
    <section className="mx-auto w-full max-w-4xl px-6 py-24">
      <p className="text-xs font-medium text-muted-foreground">How it works</p>
      <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
        From setup to collaboration in four steps
      </h2>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        A simple workflow for teams that need reliable access to their configs.
      </p>

      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {steps.map((step) => (
          <div
            key={step.number}
            className="relative flex flex-col overflow-hidden rounded-xl border bg-muted"
          >
            <div className="flex items-start justify-between p-5 pb-0 sm:p-6 sm:pb-0">
              <div className="pr-8">
                <h3 className="text-sm font-semibold sm:text-base">{step.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
              <span className="shrink-0 text-sm font-medium text-muted-foreground/30 tabular-nums">
                [{step.number}]
              </span>
            </div>

            {step.image ? (
              <div className="mt-5 px-5 pb-0 sm:mt-6 sm:px-6">
                <div className="overflow-hidden rounded-t-lg border border-x border-t border-b-0">
                  <Image
                    src={step.image.dark}
                    alt={step.image.alt}
                    width={960}
                    height={640}
                    className="hidden dark:block w-full h-auto"
                  />
                  <Image
                    src={step.image.light}
                    alt={step.image.alt}
                    width={960}
                    height={640}
                    className="block dark:hidden w-full h-auto"
                  />
                </div>
              </div>
            ) : (
              <div className="flex-1 min-h-16" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
