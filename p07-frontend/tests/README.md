# Tests — testes do frontend

Esta pasta reúne os **testes automatizados** do frontend, organizados em três suítes. Eles rodam com o Vitest.

---

## Estrutura

| Pasta | Conteúdo | Foco |
|---|---|---|
| `v1-llm/` | `attendance.test.ts` | Primeira suíte, com casos de uso (US) e critérios de teste (CT). |
| `v2/` | `attendance.test.ts` e `gaps.test.ts` | Suíte revisada. Inclui casos que faltavam na v1. |
| `integration/` | `api.test.ts` | Cliente HTTP da API, com `fetchApi` simulado. |

---

## Comandos

| Comando | O que roda |
|---|---|
| `npm test` | Suíte v2 e a de integração. |
| `npm run test:v1` | Suíte v1. |
| `npm run test:v2` | Suíte v2. |
| `npm run test:coverage:v1` | Suíte v1 com cobertura em `coverage/v1`. |
| `npm run test:coverage:v2` | Suíte v2 com cobertura em `coverage/v2`. |
| `npm run check` | Verificação de tipos dos testes, sem rodar. |

---

## Mapeamento dos casos

| Grupo | Casos | Tema |
|---|---|---|
| US01 — abrir chamada | CT05, CT06 (v1 e v2), CT07 (v2) | Reabrir, código único e colisão de código. |
| US02 — registrar presença | CT08 a CT16, exceto CT11 | Código inválido, encerrada, expirada, matrícula e duplicidade. |
| US03 — frequência | CT17 a CT23 | Cálculo com chamadas encerradas e percentuais. |
| US04 — tempo restante | `timeLeft` | Formato do cronômetro. |
| US05 — persistência | CT26 a CT28 (v1 e v2), CT29, CT32 (v2) | Leitura e gravação no navegador. |
| Erros | CT30 (v2) | Erro de JSON inválido. |

---

## Integração

`integration/api.test.ts` verifica:

- Turmas e alunos são lidos pelos endpoints certos.
- O id do aluno vem normalizado do `keycloakId`.
- Chamadas, abertura, registro, encerramento e correção usam os caminhos e o corpo esperados.
- Erros da API viram mensagem para a tela.
- Resposta sem o envelope `success`/`data` gera erro.

---

>  **Atenção**
>
> - A cobertura configurada no Vitest vale só para o domínio de presença. Não reflete o frontend inteiro.
> - As suítes v1 e v2 testam as mesmas funções. A v2 é a referência atual.
