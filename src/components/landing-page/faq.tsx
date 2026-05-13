import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    q: 'How is my data protected?',
    a: 'Every value is encrypted at rest with AES-256-GCM and PBKDF2 key derivation (100,000 iterations, unique salt per value). Authentication runs through GitHub OAuth, and all traffic uses HTTPS.',
  },
  {
    q: 'Can I import an existing .env file?',
    a: 'Yes. Paste the contents into the editor and it parses each KEY=VALUE pair automatically. Comments and blank lines are handled correctly.',
  },
  {
    q: 'How do I export my variables?',
    a: 'Open a project and click Export. You get a standard .env file per environment. You can also copy individual values or the full file to your clipboard.',
  },
  {
    q: 'Is ENV Store free?',
    a: 'Yes — fully free, fully open source. No paid plans, no paywalls, no premium tiers.',
  },
  {
    q: 'Can I share variables with my team?',
    a: 'Yes. Invite teammates by GitHub username and assign them as editors (full access) or viewers (read only). They get in-app and email notifications.',
  },
  {
    q: 'How do environments work?',
    a: 'Every project ships with development, staging, and production environments. Switch between them via tabs, or add custom environments like qa or preview. Each environment keeps its own set of variables.',
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="relative border-t border-border/60">
      <div className="mx-auto w-full max-w-[1024px] px-6 py-24 sm:py-32">
        <div className="grid gap-8 sm:grid-cols-12">
          <div className="sm:col-span-5">
            <p className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
              FAQ
            </p>
            <h2 className="mt-3 text-2xl font-medium tracking-[-0.015em] text-balance sm:text-[32px] sm:leading-[1.15]">
              Frequently asked questions.
            </h2>
            <p className="mt-4 max-w-[320px] text-sm leading-relaxed text-muted-foreground">
              Can&apos;t find what you&apos;re looking for? Open an issue on GitHub.
            </p>
          </div>

          <div className="sm:col-span-7">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((item, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="border-border/60"
                >
                  <AccordionTrigger className="text-left text-[15px] font-medium tracking-tight">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {item.a}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
