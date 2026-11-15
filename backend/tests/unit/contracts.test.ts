import { describe, expect, it } from 'vitest';
import { AccessRole } from '../../src/common/auth/access-role.enum';
import {
  CorrectionSchema,
  OpenCallSchema,
  RegisterSchema,
} from '../../src/modules/attendance/attendance.dto';
import { assertClassAccess, classScope } from '../../src/modules/classes/class-access';
const group = { teachers: [{ teacherId: 'teacher' }], enrollments: [{ studentId: 'student' }] };
const teacher = { userId: 'teacher', role: AccessRole.PROFESSOR };
describe('Contrato de autorização e entrada (antes da implementação)', () => {
  it.each([1, 2, 119, 120])('aceita %i minutos', (minutes) => {
    expect(OpenCallSchema.parse({ minutes })).toEqual({ minutes });
  });
  it.each([0, 121, 1.5, Number.NaN, Number.POSITIVE_INFINITY, '5', null])(
    'recusa duração inválida %s',
    (minutes) => {
      expect(OpenCallSchema.safeParse({ minutes }).success).toBe(false);
    },
  );
  it('recusa identidade forjada no corpo de presença', () => {
    expect(RegisterSchema.safeParse({ code: 'ABC123', studentId: 'other' }).success).toBe(false);
  });
  it('normaliza código digitado', () => {
    expect(RegisterSchema.parse({ code: ' abc123 ' }).code).toBe('ABC123');
  });
  it.each(['', 'ABCDE', 'ABCDEFG', 'AB#123'])('recusa código %s', (code) => {
    expect(RegisterSchema.safeParse({ code }).success).toBe(false);
  });
  it.each(['presente', 'ausente'])('aceita correção %s', (status) => {
    expect(CorrectionSchema.parse({ status }).status).toBe(status);
  });
  it('recusa status manual ambíguo', () => {
    expect(CorrectionSchema.safeParse({ status: 'MANUAL' }).success).toBe(false);
  });
  it('permite docente vinculado', () => {
    expect(() => assertClassAccess(group, teacher, true)).not.toThrow();
  });
  it('nega docente de outra turma', () => {
    expect(() => assertClassAccess(group, { ...teacher, userId: 'other' }, true)).toThrow();
  });
  it('aluno matriculado consulta mas não gerencia', () => {
    const student = { userId: 'student', role: AccessRole.STUDENT };
    expect(() => assertClassAccess(group, student)).not.toThrow();
    expect(() => assertClassAccess(group, student, true)).toThrow();
  });
  it('nega aluno não matriculado', () => {
    expect(() =>
      assertClassAccess(group, { userId: 'outsider', role: AccessRole.STUDENT }),
    ).toThrow();
  });
  it('admin pode gerenciar turma existente', () => {
    expect(() =>
      assertClassAccess(group, { userId: 'admin', role: AccessRole.ADMIN }, true),
    ).not.toThrow();
  });
  it('turma inexistente retorna erro', () => {
    expect(() => assertClassAccess(null, teacher, true)).toThrow('Turma');
  });
  it('identidade sem sujeito é rejeitada', () => {
    expect(() => classScope({ role: AccessRole.ADMIN })).toThrow();
  });
  it('filtra turmas por docente no servidor', () => {
    expect(classScope(teacher)).toEqual({ teachers: { some: { teacherId: 'teacher' } } });
  });
  it('filtra matrícula para aluno', () => {
    expect(classScope({ userId: 'student', role: AccessRole.STUDENT })).toEqual({
      enrollments: { some: { studentId: 'student' } },
    });
  });
});
