import { Copy, Database } from 'lucide-react';
import { FaGithub, FaGlobe } from 'react-icons/fa';

interface ValuePropsProps {
  items?: {
    title: string;
    desc: string;
    icon?: React.ReactNode;
  }[];
}

export default function ValueProps({
  items = [
    {
      title: 'Project-scoped storage',
      desc: 'Keep keys grouped by project and environment (local, staging, prod).',
      icon: <Database className="h-6 w-6" />,
    },
    {
      title: 'Fast copy & export',
      desc: 'Copy single values or export a full .env when setting up a new machine.',
      icon: <Copy className="h-6 w-6" />,
    },
    {
      title: 'GitHub sign-in',
      desc: 'Quick access from any browser.',
      icon: <FaGithub className="h-6 w-6" />,
    },
    {
      title: 'No CLI required',
      desc: 'Just open the web app and paste.',
      icon: <FaGlobe className="h-6 w-6" />,
    },
  ],
}: ValuePropsProps) {
  return (
    <section className="px-6 py-20 border-t border-dashed">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-foreground mb-4">
          Why ENV Store?
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Built for developers who need reliable, secure access to their
          environment variables
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="border bg-background p-6 text-center border-dashed"
          >
            <div className="mb-4 flex justify-center">
              <div className="p-3 rounded-xl bg-primary/10 text-primary cursor-pointer">
                {item.icon}
              </div>
            </div>
            <h3 className="mb-3 text-lg font-semibold text-foreground">
              {item.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
