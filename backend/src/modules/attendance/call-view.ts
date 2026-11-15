import type { Prisma } from '@prisma/client';
import { AccessRole } from '../../common/auth/access-role.enum';
import type { CurrentUser } from '../../common/auth/current-user.interface';
export const callInclude = {
  tokens: { orderBy: { createdAt: 'desc' as const }, take: 1 },
  attendances: { include: { status: true } },
} satisfies Prisma.CallInclude;
export type StoredCall = Prisma.CallGetPayload<{ include: typeof callInclude }>;
export function callView(call: StoredCall, user: CurrentUser) {
  const token = call.tokens[0];
  const student = user.role === AccessRole.STUDENT;
  const records: Record<string, 'presente' | 'ausente'> = {};
  for (const row of call.attendances) {
    if (!student || row.studentId === user.userId)
      records[row.studentId] = row.status.code === 'PRESENT' ? 'presente' : 'ausente';
  }
  return {
    id: call.id,
    classId: call.classId,
    code: student ? '' : (token?.token ?? ''),
    openedAt: call.openedAt.getTime(),
    expiresAt: (token?.expiresAt ?? call.openedAt).getTime(),
    closedAt: call.closedAt?.getTime(),
    records,
  };
}
