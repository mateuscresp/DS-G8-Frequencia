# Tests — testes do backend

Esta pasta reúne os **testes automatizados** da API: unitários, com o Vitest, e de integração HTTP.

---

## Estrutura

| Arquivo / pasta | Tipo | Conteúdo |
|---|---|---|
| `unit/` | Unitário | Testes de guards, validações e regras de acesso, sem banco nem rede. |
| `http.test.cjs` | Integração HTTP | Testes de ponta a ponta contra a API, com PostgreSQL temporário. |

---

## Comandos

| Comando | O que roda |
|---|---|
| `npm test` | Testes unitários. |
| `npm run test:e2e` | Testes de integração HTTP. |
| `npm run lint:ci` | Verificação de estilo e lint. |
| `npm run build` | Compilação do projeto. |

---

## Integração HTTP

Os testes de integração exigem um PostgreSQL descartável, cujo nome contenha `_test`. Antes de rodar:

1. Crie o banco de teste.
2. Aponte `DATABASE_URL` para ele.
3. Aplique as migrations.
4. Rode `npm run test:e2e`.

Os testes criam as próprias fixtures e as removem no final. Nunca use um banco compartilhado.

---

> Observações
>
> - Os testes HTTP verificam o comportamento real da API, incluindo autenticação com JWT assinado por chave local. O README principal descreve os cenários cobertos.
> - Os testes unitários são a referência para as regras de acesso e de validação. Eles não substituem a homologação do Keycloak, do CORS e do PostgreSQL.
