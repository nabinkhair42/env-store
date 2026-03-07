import { auth } from '@/auth';
import { UnauthorizedAccess } from '@/components/auth/unauthorized-access';
import { Dashboard } from '@/components/dashboard/dashboard';

export default async function Home() {
  const session = await auth();

  if (!session) {
    return <UnauthorizedAccess />;
  }

  return <Dashboard />;
}
