import { auth, signIn } from '@/auth';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Logo } from '@/components/ui/Logo';
import { FaGithub } from 'react-icons/fa';

export default async function LoginPage() {
  const session = await auth();

  if (session) {
    redirect('/');
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
      <Card className="w-full max-w-md border-none shadow-none">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <Logo size="lg" />
          </div>
          <CardTitle className="text-2xl font-bold">ENV Store</CardTitle>
          <CardDescription>
            Sync your environment variables across devices securely
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action={async () => {
              'use server';
              await signIn('github', { redirectTo: '/dashboard' });
            }}
          >
            <Button
              type="submit"
              className="w-full flex items-center justify-center gap-2"
              size="lg"
            >
              <FaGithub className="h-5 w-5" />
              Continue with GitHub
            </Button>
          </form>
          <p className="mt-4 text-xs text-center text-muted-foregrounds">
            By signing in, you agree to sync your environment variables
            securely.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
