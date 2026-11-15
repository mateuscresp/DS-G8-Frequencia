import 'reflect-metadata';
import type { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { describe, expect, it, vi } from 'vitest';
import { AccessRole } from '../../src/common/auth/access-role.enum';
import { AuthGuard } from '../../src/common/auth/guards/auth.guard';
import { RolesGuard } from '../../src/common/auth/guards/roles.guard';
import { validateEnv } from '../../src/config/env.validation';

const context = (request: object) =>
  ({
    getHandler: () => null,
    getClass: () => null,
    switchToHttp: () => ({ getRequest: () => request }),
  }) as unknown as ExecutionContext;
const reflector = (value: unknown) => ({ getAllAndOverride: () => value }) as unknown as Reflector;
describe('Guards existentes: caracterização antes de alterações', () => {
  it('permite rota pública sem consultar identidade', async () => {
    const extract = vi.fn();
    const guard = new AuthGuard(reflector(true), { extract });
    expect(await guard.canActivate(context({}))).toBe(true);
    expect(extract).not.toHaveBeenCalled();
  });
  it('nega rota protegida sem identidade', async () => {
    const guard = new AuthGuard(reflector(false), { extract: async () => null });
    await expect(guard.canActivate(context({}))).rejects.toThrow('Identidade');
  });
  it('anexa identidade validada ao request', async () => {
    const user = { userId: 'aluno', role: AccessRole.STUDENT };
    const request: { user?: unknown } = {};
    const guard = new AuthGuard(reflector(false), { extract: async () => user });
    expect(await guard.canActivate(context(request))).toBe(true);
    expect(request.user).toEqual(user);
  });
  it('permite papel exigido', () => {
    expect(
      new RolesGuard(reflector([AccessRole.PROFESSOR])).canActivate(
        context({ user: { role: AccessRole.PROFESSOR } }),
      ),
    ).toBe(true);
  });
  it('nega outro papel', () => {
    expect(() =>
      new RolesGuard(reflector([AccessRole.PROFESSOR])).canActivate(
        context({ user: { role: AccessRole.STUDENT } }),
      ),
    ).toThrow('permissão');
  });
  it('nega papel exigido quando não há usuário', () => {
    expect(() => new RolesGuard(reflector([AccessRole.ADMIN])).canActivate(context({}))).toThrow(
      'permissão',
    );
  });
  it('permite ausência de regra de papel', () => {
    expect(new RolesGuard(reflector(undefined)).canActivate(context({}))).toBe(true);
  });
  it('aceita ambiente sem configuração parcial de Keycloak', () => {
    expect(validateEnv({})).toEqual({});
  });
  it('recusa realm ausente em configuração parcial', () => {
    expect(() => validateEnv({ KEYCLOAK_AUTH_SERVER_URL: 'http://localhost' })).toThrow(
      'KEYCLOAK_REALM',
    );
  });
  it('recusa timeout não numérico', () => {
    expect(() => validateEnv({ KEYCLOAK_JWKS_TIMEOUT: 'abc' })).toThrow('inteiro');
  });
});
