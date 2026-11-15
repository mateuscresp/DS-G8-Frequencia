# Prisma — modelo de dados e migrations

Esta pasta define o **schema do PostgreSQL** usado pelo backend, as **migrations** que o criam e um **seed** com os status de referência.

---

## Conteúdo

| Arquivo / pasta | Função |
|---|---|
| `schema.prisma` | Modelos, relações, índices e nomes de tabela (`@@map`). |
| `migrations/` | Histórico de alterações do banco, aplicado em ordem. |
| `migrations/migration_lock.toml` | Trava o provedor (`postgresql`) usado pelo Prisma Migrate. |
| `seed.mjs` | Cria apenas os status de referência (`OPEN`, `CLOSED`, `PRESENT`, `ABSENT`). Não cria usuários nem turmas. |

---

## Entidades

| Grupo | Modelos | Observação |
|---|---|---|
| Referência | `CallStatus`, `AttendanceStatus` | Tabelas de lookup identificadas por `code` único. |
| Pessoas | `Teacher`, `Student` | Chave primária é o `keycloakId` (o `sub` do Keycloak). `Student` tem `studentNumber` único e opcional. |
| Estrutura acadêmica | `Class`, `ClassTeacher`, `Enrollment` | Turma com `code` único; vínculos professor×turma e aluno×turma com unicidade por par. |
| Chamadas | `Call`, `AttendanceToken`, `Attendance` | Chamada da turma, código com validade e presença única por `(callId, studentId)`. |
| Auditoria | `AuditLog` | Ações com `action`, `entity`, `entityId`, `userId` e valores antes/depois. |

---

## Migrations

| Pasta | O que faz |
|---|---|
| `20261029010610_init` | Primeira criação das tabelas, incluindo `users` e `user_roles`. |
| `202611120001_initial` | Esquema inicial sem `users` e `user_roles`, com `audit_logs`. |
| `202611120002_one_open_call` | Índice único parcial `calls_one_open_per_class`: no máximo uma chamada aberta (sem `closedAt`) por turma. |
| `20261112010509_init_v2` | Remove `users`, `user_roles` e colunas antigas (`students.id`, `students.userId`, `teachers.id`, `teachers.userId`, `attendances.registeredAt`). |

>  **Atenção:** a migration `init_v2` apaga dados dessas tabelas e colunas. Leia `backend/MIGRATION-NOTES.md` antes de aplicá-la em um banco que já tenha dados.

---

## Comandos

```bash
npm run prisma:generate   # gera o cliente Prisma
npm run migration:run     # aplica as migrations
npm run db:seed           # cria os status de referência
```

---

## Relação com o restante do backend

- O `PrismaService` (em `src/database/`) expõe o cliente gerado aos módulos.
- As regras que dependem destes modelos estão em `src/modules/attendance/` e `src/modules/classes/`.
