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
    <section className="px-6 py-20 border-t border-dashed">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-foreground mb-4">
          How it works
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Get started in minutes with our simple three-step process
        </p>
      </div>

      <div className="relative">
        <div className="grid gap-12 sm:grid-cols-3">
          {steps.map((step, index) => (
            <div key={index} className="group">
              <div className=" bg-background p-8 text-center ">
                <div className="mb-6 flex justify-center">
                  <div className="p-4 rounded-xl bg-primary/10 text-primary cursor-pointer">
                    {step.icon}
                  </div>
                </div>

                <h3 className="mb-4 text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
