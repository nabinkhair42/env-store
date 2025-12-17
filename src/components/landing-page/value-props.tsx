import { Copy, Database, Globe } from 'lucide-react';
import { FaGithub } from 'react-icons/fa6';

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
      icon: <Globe className="h-6 w-6" />,
    },
  ],
}: ValuePropsProps) {
  return (
    <section className="px-6 py-24 border-t border-dashed">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-medium text-foreground mb-4">
          Why ENV Store?
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Built for developers who need reliable, secure access to their
          environment variables
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="p-1 rounded bg-muted text-foreground w-fit">
              {item.icon}
            </div>
            <h3 className="text-lg font-semibold text-foreground">
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
