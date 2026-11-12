import { randomBytes } from 'node:crypto';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AccessRole } from '../../common/auth/access-role.enum';
import type { CurrentUser } from '../../common/auth/current-user.interface';
import { PrismaService } from '../../database/prisma.service';
import { actorId, assertClassAccess, classScope } from '../classes/class-access';
import { OpenCallSchema } from './attendance.dto';
import { callInclude, callView } from './call-view';

@Injectable()
export class AttendanceService {
  constructor(private readonly prisma: PrismaService) {}

  private async access(
    tx: Prisma.TransactionClient,
    classId: string,
    user: CurrentUser,
    manage = false,
  ) {
    const group = await tx.class.findUnique({
      where: { id: classId },
      include: { teachers: true, enrollments: true },
    });
    assertClassAccess(group, user, manage);
    return group;
  }
  private async lock(tx: Prisma.TransactionClient, classId: string) {
    // Serializa abertura, registro, correção e encerramento da mesma turma.
    await tx.$queryRaw`SELECT id FROM classes WHERE id = ${classId}::uuid FOR UPDATE`;
  }
  async list(user: CurrentUser, classId?: string) {
    if (classId) await this.access(this.prisma, classId, user);
    const calls = await this.prisma.call.findMany({
      where: { class: classScope(user), ...(classId ? { classId } : {}) },
      include: callInclude,
      orderBy: { openedAt: 'desc' },
    });
    return calls.map((call) => callView(call, user));
  }
  async open(classId: string, minutes: number, user: CurrentUser) {
    OpenCallSchema.parse({ minutes });
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        return await this.prisma.$transaction(async (tx) => {
          await this.access(tx, classId, user, true);
          await this.lock(tx, classId);
          if (await tx.call.findFirst({ where: { classId, closedAt: null } }))
            throw new ConflictException(
              'Encerre a chamada anterior antes de abrir outra para esta turma.',
            );
          const now = new Date();
          const status = await tx.callStatus.upsert({
            where: { code: 'OPEN' },
            create: { code: 'OPEN', label: 'Aberta' },
            update: {},
          });
          const created = await tx.call.create({
            data: {
              classId,
              statusId: status.id,
              openedAt: now,
              tokens: {
                create: {
                  token: randomBytes(3).toString('hex').toUpperCase(),
                  expiresAt: new Date(now.getTime() + minutes * 60000),
                },
              },
            },
            include: callInclude,
          });
          await tx.auditLog.create({
            data: {
              action: 'CALL_OPENED',
              entity: 'Call',
              entityId: created.id,
              userId: actorId(user),
            },
          });
          return callView(created, user);
        });
      } catch (error) {
        if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== 'P2002')
          throw error;
        // Conflito único (inclusive colisão rara do token): transação inteira é refeita.
        if (attempt === 2)
          throw new ConflictException('Não foi possível abrir a chamada. Tente novamente.');
      }
    }
    throw new ConflictException('Não foi possível gerar o código.');
  }
  async close(id: string, user: CurrentUser) {
    return this.prisma.$transaction(async (tx) => {
      const initial = await tx.call.findUnique({ where: { id } });
      if (!initial) throw new NotFoundException('Chamada não encontrada.');
      await this.access(tx, initial.classId, user, true);
      await this.lock(tx, initial.classId);
      const current = await tx.call.findUniqueOrThrow({ where: { id }, include: callInclude });
      if (current.closedAt) return callView(current, user);
      const status = await tx.callStatus.upsert({
        where: { code: 'CLOSED' },
        create: { code: 'CLOSED', label: 'Encerrada' },
        update: {},
      });
      const closed = await tx.call.update({
        where: { id },
        data: { closedAt: new Date(), statusId: status.id },
        include: callInclude,
      });
      await tx.auditLog.create({
        data: { action: 'CALL_CLOSED', entity: 'Call', entityId: id, userId: actorId(user) },
      });
      return callView(closed, user);
    });
  }
  async register(code: string, user: CurrentUser) {
    const studentId = actorId(user);
    if (user.role !== AccessRole.STUDENT)
      throw new ForbiddenException('Somente alunos registram presença por código.');
    return this.prisma.$transaction(async (tx) => {
      const token = await tx.attendanceToken.findUnique({
        where: { token: code },
        include: { call: true },
      });
      if (!token)
        throw new NotFoundException('Código inválido. Confira o código exibido pelo professor.');
      await this.access(tx, token.call.classId, user);
      await this.lock(tx, token.call.classId);
      const current = await tx.call.findUniqueOrThrow({ where: { id: token.callId } });
      if (current.closedAt) throw new ConflictException('Esta chamada já foi encerrada.');
      if (token.expiresAt.getTime() <= Date.now())
        throw new ConflictException('O código expirou. Solicite um novo código ao professor.');
      const previous = await tx.attendance.findUnique({
        where: { callId_studentId: { callId: token.callId, studentId } },
        include: { status: true },
      });
      if (previous)
        throw new ConflictException(
          previous.status.code === 'PRESENT'
            ? 'Sua presença já foi registrada nesta chamada.'
            : 'Sua situação foi ajustada pelo professor. Fale com ele para corrigir o registro.',
        );
      const status = await tx.attendanceStatus.upsert({
        where: { code: 'PRESENT' },
        create: { code: 'PRESENT', label: 'Presente' },
        update: {},
      });
      await tx.attendance.create({
        data: { callId: token.callId, studentId, statusId: status.id },
      });
      await tx.auditLog.create({
        data: {
          action: 'ATTENDANCE_REGISTERED',
          entity: 'Call',
          entityId: token.callId,
          userId: studentId,
        },
      });
      // Código é compartilhado pela turma: não usar usedAt como consumo global.
      return callView(
        await tx.call.findUniqueOrThrow({ where: { id: token.callId }, include: callInclude }),
        user,
      );
    });
  }
  async correct(id: string, studentId: string, value: 'presente' | 'ausente', user: CurrentUser) {
    return this.prisma.$transaction(async (tx) => {
      const current = await tx.call.findUnique({ where: { id } });
      if (!current) throw new NotFoundException('Chamada não encontrada.');
      const group = await this.access(tx, current.classId, user, true);
      if (!group.enrollments.some((link) => link.studentId === studentId))
        throw new NotFoundException('Aluno não matriculado nesta turma.');
      await this.lock(tx, current.classId);
      const code = value === 'presente' ? 'PRESENT' : 'ABSENT';
      const status = await tx.attendanceStatus.upsert({
        where: { code },
        create: { code, label: value },
        update: {},
      });
      const where = { callId_studentId: { callId: id, studentId } };
      const before = await tx.attendance.findUnique({ where, include: { status: true } });
      const data = { statusId: status.id, markedBy: actorId(user), markedAt: new Date() };
      await tx.attendance.upsert({
        where,
        create: { callId: id, studentId, ...data },
        update: data,
      });
      await tx.auditLog.create({
        data: {
          action: 'ATTENDANCE_MARKED_MANUAL',
          entity: 'Call',
          entityId: id,
          userId: actorId(user),
          oldValues: { studentId, status: before?.status.code ?? null },
          newValues: { studentId, status: code },
        },
      });
      return callView(
        await tx.call.findUniqueOrThrow({ where: { id }, include: callInclude }),
        user,
      );
    });
  }
}
