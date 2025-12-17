import { auth } from '@/auth';
import SiteFooter from '@/components/landing-page/site-footer';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Logo } from '@/components/ui/Logo';
import { redirect } from 'next/navigation';
import { SignInButton } from '@/app/login/sign-in-button';

export default async function LoginPage() {
  const session = await auth();

  if (session) {
    redirect('/dashboard');
  }

  return (
    <>
      {' '}
      <div className="flex items-center justify-center min-h-[calc(100vh-100px)] max-w-4xl mx-auto border-dashed border-x border-y-0">
        <Card className="w-full max-w-md border-none shadow-none">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <Logo size="lg" />
            </div>
            <CardTitle className="text-2xl font-medium">ENV Store</CardTitle>
            <CardDescription>
              Sync your environment variables across devices securely
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignInButton />
            <p className="mt-4 text-xs text-center text-muted-foregrounds">
              By signing in, you agree to sync your environment variables
              securely.
            </p>
          </CardContent>
        </Card>
      </div>
      <SiteFooter />
    </>
  );
}
