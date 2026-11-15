# Módulo classes (frontend) — turmas e agenda

Este módulo mostra as **turmas** do usuário, a **frequência por turma** do aluno e a **agenda das próximas aulas**.

---

## Estrutura

| Arquivo | Responsabilidade |
|---|---|
| `components/ClassList.tsx` | Lista de turmas com busca. O professor seleciona a turma; o aluno vê a frequência de cada uma e abre o histórico. |
| `components/NextClasses.tsx` | Cards com dia, horário e sala das próximas aulas. |

---

## Comportamento

- A busca ignora acentos e maiúsculas e procura em nome, código, professor e semestre.
- Para o aluno, cada turma mostra o percentual calculado por `attendanceSummary`. Sem chamadas encerradas, aparece `—`.
- `NextClasses` exibe apenas turmas com o campo `next` preenchido.
- `ClassList` trata carregamento, erro (com botão para tentar de novo) e lista vazia.

---

## Relação com o restante do frontend

- Usa tipos e cálculos de `attendance/summary.ts`.
- `StudentDashboard.tsx` e `TeacherDashboard.tsx` montam estes componentes.
- Os dados vêm da API (`services/api.ts`) ou dos dados de demonstração, conforme o modo do app.
