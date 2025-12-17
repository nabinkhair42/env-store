import { Workflow, RotateCw } from 'lucide-react';
import { FaGithub } from 'react-icons/fa6';

interface HowItWorksProps {
  steps?: {
    title: string;
    body: string;
    icon?: React.ReactNode;
  }[];
}

export default function HowItWorks({
  steps = [
    {
      title: 'Sign in',
      body: 'Use your GitHub account to access the app.',
      icon: <FaGithub className="h-6 w-6" />,
    },
    {
      title: 'Create a project',
      body: 'Add variables as KEY=VALUE, grouped by project.',
      icon: <Workflow className="h-6 w-6" />,
    },
    {
      title: 'Recover anytime',
      body: 'Copy single values or export a full .env when needed.',
      icon: <RotateCw className="h-6 w-6" />,
    },
  ],
}: HowItWorksProps) {
  return (
    <section className="px-6 py-24 border-t border-dashed">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-medium text-foreground mb-4">
          How it works
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Get started in minutes with our simple three-step process
        </p>
      </div>

      <div className="grid gap-12 sm:grid-cols-3 max-w-5xl mx-auto">
        {steps.map((step, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-start">
              <div className="p-1 rounded bg-muted text-foreground">
                {step.icon}
              </div>
            </div>
            <h3 className="text-xl font-medium text-foreground">
              {step.title}
            </h3>
            <p className="text-muted-foreground leading-relaxed">{step.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
