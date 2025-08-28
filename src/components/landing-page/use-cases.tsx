import { Laptop, Users, AlertTriangle, FolderOpen } from 'lucide-react';

interface UseCasesProps {
  items?: {
    title: string;
    body: string;
    icon?: React.ReactNode;
  }[];
}

export default function UseCases({
  items = [
    {
      title: 'New laptop / clean install',
      body: 'Rebuild your dev setup fast. Paste variables and continue working.',
      icon: <Laptop className="h-6 w-6" />,
    },
    {
      title: 'Team onboarding',
      body: 'Share exactly the keys teammates need without passing raw files around.',
      icon: <Users className="h-6 w-6" />,
    },
    {
      title: 'Incident recovery',
      body: 'Restore configuration during outages.',
      icon: <AlertTriangle className="h-6 w-6" />,
    },
    {
      title: 'Side projects',
      body: "Keep hobby project keys in one place so they don't get lost.",
      icon: <FolderOpen className="h-6 w-6" />,
    },
  ],
}: UseCasesProps) {
  return (
    <section className="px-6 py-20 border-t border-dashed">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-foreground mb-4">Use cases</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Perfect for any scenario where you need reliable access to environment
          variables
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        {items.map((item, index) => (
          <div
            key={index}
            className="group border bg-background p-6 border-dashed"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10 cursor-pointer text-primary flex-shrink-0">
                {item.icon}
              </div>
              <div className="flex-1">
                <h3 className="mb-3 text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.body}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
