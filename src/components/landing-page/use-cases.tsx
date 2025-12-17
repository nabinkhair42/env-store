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
    <section className="px-6 py-24 border-t border-dashed">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-medium text-foreground mb-4">Use cases</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Perfect for any scenario where you need reliable access to environment
          variables
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 max-w-4xl mx-auto">
        {items.map((item, index) => (
          <div key={index}>
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-muted text-foreground shrink-0">
                {item.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-foreground">
                  {item.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
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
