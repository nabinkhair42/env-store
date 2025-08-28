interface FAQProps {
  items?: {
    q: string;
    a: string;
  }[];
}

export default function FAQ({
  items = [
    {
      q: 'Do you support bulk import?',
      a: 'Export is available now; .env import is on the roadmap.',
    },
    {
      q: 'Is there a CLI?',
      a: 'Not required—the web app handles add, copy, and export.',
    },
    {
      q: 'Can I self-host?',
      a: 'Yes—see the repository for setup details.',
    },
    {
      q: 'Is it free?',
      a: 'The hosted app is free to use.',
    },
  ],
}: FAQProps) {
  return (
    <section className="px-6 py-16 border-t border-dashed">
      <h2 className="mb-12 text-center text-3xl font-bold text-foreground">
        Frequently asked questions
      </h2>

      <div className="mx-auto max-w-3xl space-y-6">
        {items.map((item, index) => (
          <div
            key={index}
            className="border bg-background p-5 border-dashed rounded-none"
          >
            <h3 className="mb-3 text-lg font-semibold text-foreground">
              {item.q}
            </h3>
            <p className="text-sm text-muted-foreground">{item.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
