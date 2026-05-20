'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { useRespondToInvite } from '@/hooks/use-members';
import { useRouter } from 'next/navigation';

interface InviteAcceptCardProps {
  memberId: string;
  projectId: string;
  projectName: string;
  inviterName: string;
  inviterImage: string | null;
  role: 'editor' | 'viewer';
}

export function InviteAcceptCard({
  memberId,
  projectId,
  projectName,
  inviterName,
  inviterImage,
  role,
}: InviteAcceptCardProps) {
  const router = useRouter();
  const { mutate: respond, isPending, variables } = useRespondToInvite();
  const pendingAction = isPending ? variables?.data.action : undefined;

  const handle = (action: 'accept' | 'decline') => {
    respond(
      { memberId, data: { action } },
      {
        onSuccess: () => {
          if (action === 'accept') {
            router.push(`/dashboard/${projectId}`);
          } else {
            router.push('/dashboard');
          }
        },
      },
    );
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-md items-center px-6 pt-24 pb-12">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl">Project invitation</CardTitle>
          <CardDescription>
            <strong>{inviterName}</strong> invited you to collaborate on{' '}
            <strong>{projectName}</strong>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 rounded-lg border p-3">
            <Avatar className="size-10">
              <AvatarImage src={inviterImage ?? ''} />
              <AvatarFallback>
                {inviterName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{projectName}</p>
              <p className="text-xs text-muted-foreground">
                Invited by {inviterName}
              </p>
            </div>
            <Badge variant="outline" className="capitalize">
              {role}
            </Badge>
          </div>
        </CardContent>
        <CardFooter className="gap-2">
          <Button
            variant="outline"
            className="flex-1"
            disabled={isPending}
            onClick={() => handle('decline')}
          >
            {pendingAction === 'decline' ? <Spinner /> : null}
            Decline
          </Button>
          <Button
            className="flex-1"
            disabled={isPending}
            onClick={() => handle('accept')}
          >
            {pendingAction === 'accept' ? <Spinner /> : null}
            Accept
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
