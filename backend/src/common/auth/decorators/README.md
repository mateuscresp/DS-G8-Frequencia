# Decorators — marcação de rotas públicas

Esta pasta contém o decorador que **dispensa a autenticação** de uma rota ou controller.

---

## Estrutura

| Arquivo | Responsabilidade |
|---|---|
| `public.decorator.ts` | Define `Public()` e a chave `PUBLIC_KEY`. |

---

## Como funciona

- `@Public()` grava a metadado `isPublic = true` na rota ou no controller.
- O `AuthGuard` lê esse metadado com `Reflector.getAllAndOverride`, procurando primeiro no handler e depois na classe. Quando é público, o guard libera a requisição sem consultar a identidade.
- Em `health.controller.ts`, o endpoint de saúde usa `@Public()`.

```ts
@Public()
@Get('health')
check() { ... }
```

---

> Observações
>
> - `@Public()` só dispensa a autenticação. Ele não desliga o `RolesGuard`. Como uma rota pública não tem usuário, ela não deve usar `@Roles(...)`.
> - Para permitir acesso a uma rota sem token, use sempre `@Public()`. Não remova o `AuthGuard` do módulo.
