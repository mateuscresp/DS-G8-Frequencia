# Database — acesso ao banco

Esta pasta conecta a aplicação ao PostgreSQL pelo **Prisma**. Não tem regras de negócio: apenas fornece o cliente para os módulos.

---

## Arquivos

| Arquivo | Função |
|---|---|
| `prisma.service.ts` | `PrismaService`, que estende o `PrismaClient`. Conecta ao iniciar (`onModuleInit`) e desconecta ao encerrar (`onModuleDestroy`). |
| `prisma.module.ts` | `PrismaModule`, que disponibiliza o `PrismaService` por injeção de dependência. |

---

## Como é usado

Os serviços recebem o `PrismaService` no construtor:

```ts
constructor(private readonly prisma: PrismaService) {}
```

Operações que precisam de atomicidade usam `$transaction`, como em `attendance.service.ts`.

---

> **Observações**
>
> - A URL de conexão vem de `DATABASE_URL`, configurada em `src/config/database.config.ts`.
> - O schema e as migrations ficam em `backend/prisma/`.
> - O `HealthModule` usa este mesmo serviço para verificar se o banco responde.
