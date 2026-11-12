const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createServer } = require('node:http');
const { randomUUID } = require('node:crypto');
if (!process.env.DATABASE_URL || !new URL(process.env.DATABASE_URL).pathname.includes('_test'))
  throw new Error('Use banco descartável com _test no nome e migrations aplicadas.');
test('HTTP, PostgreSQL e JWT: autorização e fluxo de presença', async (t) => {
  const { generateKeyPair, exportJWK, SignJWT } = require('jose');
  const { publicKey, privateKey } = await generateKeyPair('RS256');
  const jwk = { ...(await exportJWK(publicKey)), kid: 'test', alg: 'RS256', use: 'sig' };
  const server = createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ keys: [jwk] }));
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  process.env.KEYCLOAK_AUTH_SERVER_URL = origin;
  process.env.KEYCLOAK_REALM = 'test';
  process.env.KEYCLOAK_CLIENT_ID = 'p07-back';
  const { NestFactory } = require('@nestjs/core');
  const { AppModule } = require('../dist/app.module');
  const { HttpExceptionFilter } = require('../dist/common/filters/http-exception.filter');
  const { TransformInterceptor } = require('../dist/common/interceptors/transform.interceptor');
  const { PrismaClient } = require('@prisma/client');
  const db = new PrismaClient();
  const teacher = randomUUID();
  const other = randomUUID();
  const student = randomUUID();
  const student2 = randomUUID();
  let app;
  let group;
  let call;
  try {
    app = await NestFactory.create(AppModule, { logger: false });
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new TransformInterceptor());
    await app.listen(0, '127.0.0.1');
    const base = await app.getUrl();
    const token = async (sub, role, aud = 'p07-back') => {
      const jwt = new SignJWT({ realm_access: { roles: [`p07-${role}`] } })
        .setProtectedHeader({ alg: 'RS256', kid: 'test' })
        .setIssuer(`${origin}/realms/test`)
        .setAudience(aud)
        .setIssuedAt()
        .setExpirationTime('5m');
      if (sub) jwt.setSubject(sub);
      return jwt.sign(privateKey);
    };
    const prof = await token(teacher, 'professor');
    const outsider = await token(other, 'professor');
    const aluno = await token(student, 'student');
    const second = await token(student2, 'student');
    const admin = await token(other, 'admin');
    const req = async (path, auth, method = 'GET', body = undefined) => {
      const r = await fetch(base + path, {
        method,
        headers: {
          ...(auth ? { Authorization: `Bearer ${auth}` } : {}),
          'Content-Type': 'application/json',
        },
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      });
      return { status: r.status, body: await r.json() };
    };
    await db.teacher.create({ data: { keycloakId: teacher } });
    await db.student.createMany({ data: [{ keycloakId: student }, { keycloakId: student2 }] });
    group = await db.class.create({
      data: {
        code: randomUUID(),
        name: 'Turma de teste',
        teachers: { create: { teacherId: teacher } },
        enrollments: { create: [{ studentId: student }, { studentId: student2 }] },
      },
    });
    await t.test('autenticação e isolamento de turmas', async () => {
      assert.equal((await req('/classes')).status, 401);
      assert.equal((await req('/classes', 'invalid')).status, 401);
      assert.equal((await req('/classes', await token(student, 'student', 'other'))).status, 403);
      assert.equal((await req('/classes', await token(null, 'student'))).status, 401);
      assert.equal((await req('/classes', aluno)).body.data.length, 1);
      assert.equal((await req('/classes', outsider)).body.data.length, 0);
      assert.equal((await req(`/classes/${group.id}/students`, aluno)).status, 403);
      assert.equal((await req(`/classes/${group.id}/students`, outsider)).status, 403);
      assert.equal((await req(`/classes/${group.id}/students`, prof)).body.data.length, 2);
      assert.equal((await req(`/classes/${group.id}/students`, admin)).status, 200);
    });
    await t.test('abertura concorrente e duração', async () => {
      const path = `/classes/${group.id}/calls`;
      assert.equal((await req(path, aluno, 'POST', { minutes: 5 })).status, 403);
      assert.equal((await req(path, outsider, 'POST', { minutes: 5 })).status, 403);
      assert.equal((await req(path, prof, 'POST', { minutes: 0 })).status, 422);
      const all = await Promise.all([
        req(path, prof, 'POST', { minutes: 5 }),
        req(path, prof, 'POST', { minutes: 5 }),
      ]);
      assert.deepEqual(all.map((r) => r.status).sort(), [201, 409]);
      call = all.find((r) => r.status === 201).body.data;
      assert.match(call.code, /^[A-Z0-9]{6}$/);
    });
    await t.test('registro concorrente, código compartilhado e privacidade', async () => {
      assert.equal(
        (await req('/attendance', aluno, 'POST', { code: call.code, studentId: student2 })).status,
        422,
      );
      const all = await Promise.all([
        req('/attendance', aluno, 'POST', { code: call.code }),
        req('/attendance', aluno, 'POST', { code: call.code }),
      ]);
      assert.deepEqual(all.map((r) => r.status).sort(), [201, 409]);
      assert.equal(
        (await req('/attendance', second, 'POST', { code: call.code.toLowerCase() })).status,
        201,
      );
      const visible = (await req('/calls', aluno)).body.data[0];
      assert.equal(visible.code, '');
      assert.deepEqual(visible.records, { [student]: 'presente' });
      assert.equal(Object.keys((await req('/calls', prof)).body.data[0].records).length, 2);
    });
    await t.test('correção, encerramento idempotente e auditoria', async () => {
      const path = `/calls/${call.id}/attendance/${student}`;
      assert.equal((await req(path, aluno, 'PATCH', { status: 'ausente' })).status, 403);
      assert.equal((await req(path, prof, 'PATCH', { status: 'ausente' })).status, 200);
      assert.equal((await req('/attendance', aluno, 'POST', { code: call.code })).status, 409);
      assert.equal((await req(`/calls/${call.id}/close`, prof, 'POST')).status, 201);
      assert.equal((await req(`/calls/${call.id}/close`, prof, 'POST')).status, 201);
      assert.equal((await req('/attendance', second, 'POST', { code: call.code })).status, 409);
      assert.equal((await req(path, prof, 'PATCH', { status: 'presente' })).status, 200);
      assert.equal(
        await db.auditLog.count({ where: { entityId: call.id, action: 'CALL_CLOSED' } }),
        1,
      );
      assert.equal(
        await db.auditLog.count({
          where: { entityId: call.id, action: 'ATTENDANCE_MARKED_MANUAL' },
        }),
        2,
      );
    });
    await t.test('expiração no servidor', async () => {
      const opened = (await req(`/classes/${group.id}/calls`, prof, 'POST', { minutes: 1 })).body
        .data;
      await db.attendanceToken.updateMany({
        where: { callId: opened.id },
        data: { expiresAt: new Date(Date.now() - 1000) },
      });
      assert.equal((await req('/attendance', aluno, 'POST', { code: opened.code })).status, 409);
    });
  } finally {
    if (group) await db.class.delete({ where: { id: group.id } });
    await db.auditLog.deleteMany({
      where: { userId: { in: [teacher, other, student, student2] } },
    });
    await db.teacher.deleteMany({ where: { keycloakId: teacher } });
    await db.student.deleteMany({ where: { keycloakId: { in: [student, student2] } } });
    await db.$disconnect();
    if (app) await app.close();
    await new Promise((resolve) => server.close(resolve));
  }
});
