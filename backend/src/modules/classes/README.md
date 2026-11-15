# Módulo classes — turmas e acesso por vínculo

Este módulo lista as **turmas** e os **alunos matriculados**, respeitando o vínculo de cada usuário com a turma. Também concentra a regra de acesso que o módulo `attendance` reutiliza.

---

## Arquivos

| Arquivo | Responsabilidade |
|---|---|
| `classes.controller.ts` | Rotas HTTP de turmas. |
| `classes.service.ts` | Consultas: lista de turmas, detalhe e alunos da turma. |
| `class-access.ts` | Regras de acesso reutilizadas: `actorId`, `classScope` e `assertClassAccess`. |
| `classes.module.ts` | Registra o controller e o service. |

---

## Rotas

| Método | Caminho | Quem pode | Retorna |
|---|---|---|---|
| `GET` | `/classes` | Turmas vinculadas; admin vê todas | Lista com `id`, `name`, `code` e `semester`. |
| `GET` | `/classes/:id` | Membro da turma ou admin | Detalhe da turma. |
| `GET` | `/classes/:id/students` | Professor vinculado ou admin | Alunos matriculados. |

---

## Regras de acesso

| Perfil | Turmas visíveis | Gestão |
|---|---|---|
| `ADMIN` | Todas | Sim |
| `PROFESSOR` | Turmas em `ClassTeacher` | Só nas próprias turmas |
| `STUDENT` | Turmas em `Enrollment` | Não |

> `assertClassAccess` responde `404` se a turma não existe e `403` se o usuário não tem acesso. Com `manage = true`, aluno nunca passa.

---

## Lista de alunos

> Os nomes completos ainda não existem no schema. Por isso o nome exibido é `Aluno <matrícula>` ou, na falta dela, o identificador do aluno. A lista não expõe perfis fora da turma.

---

## Dependências

- O módulo `attendance` importa `class-access.ts` para validar o acesso às chamadas.
- `database/prisma.service.ts`: consultas.
- `common/auth/`: usuário atual e perfis.
