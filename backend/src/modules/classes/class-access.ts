import { ForbiddenException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { AccessRole } from '../../common/auth/access-role.enum';
import type { CurrentUser } from '../../common/auth/current-user.interface';

export function actorId(user: CurrentUser): string {
  if (!user?.userId) throw new UnauthorizedException('Identidade sem identificador.');
  return user.userId;
}
export function classScope(user: CurrentUser): Prisma.ClassWhereInput {
  const id = actorId(user);
  if (user.role === AccessRole.ADMIN) return {};
  if (user.role === AccessRole.PROFESSOR) return { teachers: { some: { teacherId: id } } };
  if (user.role === AccessRole.STUDENT) return { enrollments: { some: { studentId: id } } };
  throw new ForbiddenException('Perfil não autorizado.');
}
export type AccessClass = {
  teachers: { teacherId: string }[];
  enrollments: { studentId: string }[];
};
export function assertClassAccess(
  group: AccessClass | null,
  user: CurrentUser,
  manage = false,
): asserts group is AccessClass {
  const id = actorId(user);
  if (!group) throw new NotFoundException('Turma não encontrada.');
  if (user.role === AccessRole.ADMIN) return;
  if (user.role === AccessRole.PROFESSOR && group.teachers.some((link) => link.teacherId === id))
    return;
  if (
    !manage &&
    user.role === AccessRole.STUDENT &&
    group.enrollments.some((link) => link.studentId === id)
  )
    return;
  throw new ForbiddenException('Você não tem acesso a esta turma.');
}
