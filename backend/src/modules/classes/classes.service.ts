import { Injectable } from '@nestjs/common';
import type { CurrentUser } from '../../common/auth/current-user.interface';
import { PrismaService } from '../../database/prisma.service';
import { assertClassAccess, classScope } from './class-access';

@Injectable()
export class ClassesService {
  constructor(private readonly prisma: PrismaService) {}
  async findAll(user: CurrentUser) {
    const groups = await this.prisma.class.findMany({
      where: classScope(user),
      orderBy: { name: 'asc' },
    });
    return groups.map(({ id, name, code, semester }) => ({
      id,
      name,
      code,
      semester: semester ?? undefined,
    }));
  }
  async findById(id: string, user: CurrentUser) {
    const group = await this.prisma.class.findUnique({
      where: { id },
      include: { teachers: true, enrollments: true },
    });
    assertClassAccess(group, user);
    return {
      id: group.id,
      name: group.name,
      code: group.code,
      semester: group.semester ?? undefined,
    };
  }
  async findStudentsInClass(classId: string, user: CurrentUser) {
    const group = await this.prisma.class.findUnique({
      where: { id: classId },
      include: { teachers: true, enrollments: true },
    });
    assertClassAccess(group, user, true);
    const rows = await this.prisma.enrollment.findMany({
      where: { classId },
      include: { student: true },
      orderBy: { createdAt: 'asc' },
    });
    // Nomes não constam no schema atual; não inventar perfis nem expor outro catálogo.
    return rows.map(({ student }) => ({
      id: student.keycloakId,
      name: `Aluno ${student.studentNumber ?? student.keycloakId}`,
      number: student.studentNumber ?? undefined,
    }));
  }
}
