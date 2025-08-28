import { auth } from '@/auth';
import { Dashboard } from '@/components/dashboard';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return <Dashboard />;
}
