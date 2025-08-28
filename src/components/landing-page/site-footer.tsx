import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer className="border-t border-dashed">
      <div className="flex items-center gap-4 justify-center mx-auto max-w-7xl border-dashed border-l border-r py-6 px-4">
        <p className="text-sm text-muted-foreground">
          Developed by{' '}
          <Link
            href="https://nabinkhair.com.np"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:text-primary hover:underline transition-colors"
          >
            Nabin Khair
          </Link>
        </p>
        <div className="w-px h-4 bg-border" />

        <div className="flex gap-6">
          <Link
            href="https://github.com/nabinkhair42/env-store"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground hover:underline transition-colors"
          >
            GitHub
          </Link>
        </div>
      </div>
    </footer>
  );
}
