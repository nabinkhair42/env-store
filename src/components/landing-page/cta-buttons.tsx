import { Button } from '@/components/ui/button';
import {
  Glimpse,
  GlimpseContent,
  GlimpseDescription,
  GlimpseImage,
  GlimpseTitle,
  GlimpseTrigger,
} from '@/components/ui/kibo-ui/glimpse';
import { glimpse } from '@/components/ui/kibo-ui/glimpse/server';
import { ChevronRight, Github } from 'lucide-react';
import Link from 'next/link';
interface CTAButtonsProps {
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}

export async function CTAButtons({
  primaryHref = '/dashboard',
  primaryLabel = 'Get Started',
  secondaryHref = 'https://github.com/nabinkhair42/env-store',
  secondaryLabel = 'View Source',
}: CTAButtonsProps) {
  const data = await glimpse(secondaryHref);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
      <Button asChild size="lg" className="px-8">
        <Link href={primaryHref}>
          {primaryLabel} <ChevronRight className="w-4 h-4" />
        </Link>
      </Button>

      <Glimpse closeDelay={0} openDelay={0}>
        <GlimpseTrigger asChild>
          <Button asChild variant="default" size="lg" className="px-8">
            <Link href={secondaryHref}>
              <Github className="w-4 h-4" /> {secondaryLabel}
            </Link>
          </Button>
        </GlimpseTrigger>
        <GlimpseContent className="w-80">
          <GlimpseImage src={data.image ?? ''} />
          <GlimpseTitle>{data.title}</GlimpseTitle>
          <GlimpseDescription>{data.description}</GlimpseDescription>
        </GlimpseContent>
      </Glimpse>
    </div>
  );
}
