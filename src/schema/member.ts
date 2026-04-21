import { z } from 'zod';

export const InviteMemberSchema = z.object({
  identifier: z.string().min(1, 'GitHub username or email is required'),
  role: z.enum(['editor', 'viewer']),
});

export const UpdateMemberRoleSchema = z.object({
  role: z.enum(['editor', 'viewer']),
});

export const RespondToInviteSchema = z.object({
  action: z.enum(['accept', 'decline']),
});

export type InviteMemberInput = z.infer<typeof InviteMemberSchema>;
export type UpdateMemberRoleInput = z.infer<typeof UpdateMemberRoleSchema>;
export type RespondToInviteInput = z.infer<typeof RespondToInviteSchema>;
