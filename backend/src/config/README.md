# Config — configuração do backend

Esta pasta carrega e valida as **variáveis de ambiente** usadas pela aplicação. Cada arquivo agrupa as configurações de uma parte do sistema.

---

## Arquivos

| Arquivo | Namespace | O que configura |
|---|---|---|
| `database.config.ts` | `database` | Monta a `DATABASE_URL`. Sem ela, usa `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD` e `DB_DATABASE` (padrões: `localhost`, `5432`, `postgres`, `frequencia_database`). |
| `keycloak.config.ts` | `keycloak` | URL do servidor, realm, cliente, cache e timeout do JWKS. |
| `swagger.config.ts` | `swagger` | Título, descrição, versão e caminho da documentação (padrão `api/docs`). |
| `env.validation.ts` | — | Validação executada no boot. |

---

## Validação no boot

A função `validateEnv` roda na inicialização:

- Se `KEYCLOAK_AUTH_SERVER_URL` ou `KEYCLOAK_REALM` estiver definido, os dois passam a ser obrigatórios.
- `KEYCLOAK_JWKS_CACHE_MAX_AGE` e `KEYCLOAK_JWKS_TIMEOUT` precisam ser números inteiros.

<details>
<summary><b> Valores padrão do Keycloak e do Swagger</b></summary>

<br>

| Variável | Padrão |
|---|---|
| `KEYCLOAK_JWKS_CACHE_MAX_AGE` | `600000` ms |
| `KEYCLOAK_JWKS_TIMEOUT` | `5000` ms |
| `SWAGGER_PATH` | `api/docs` |

</details>

---

> **Observações**
>
> - O Prisma lê `DATABASE_URL` diretamente de `process.env`, por isso o `database.config.ts` preenche essa variável quando ela ainda não existe.
> - As variáveis completas estão em `backend/.env.example` e na tabela de variáveis do README principal.
> - Nunca coloque segredos de cliente em variáveis `VITE_*`, porque elas vão para o navegador.
