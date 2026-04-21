import { Spinner } from '@/components/ui/spinner';

export default function LoaderScreen() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <Spinner className="size-6" />
    </div>
  );
}
