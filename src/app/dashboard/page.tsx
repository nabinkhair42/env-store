import { auth } from '@/auth';
import { Dashboard } from '@/components/dashboard';
import { UnauthorizedAccess } from '@/components/auth/unauthorized-access';

export default async function Home() {
  const session = await auth();

  if (!session) {
    return <UnauthorizedAccess />;
  }

  return <Dashboard />;
}
