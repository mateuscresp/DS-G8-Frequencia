# Utils — utilitários do frontend

Esta pasta tem **funções auxiliares** usadas por mais de uma parte da aplicação: configuração de login e formatação de datas.

---

## Arquivos

| Arquivo | Responsabilidade |
|---|---|
| `auth.ts` | `authProviderProps()`, que monta a configuração do login OIDC. |
| `format.ts` | `dateTime`, formatador de data e hora em `pt-BR`. |

---

## auth.ts

Monta as opções do `AuthProvider`, a partir de `VITE_KEYCLOAK_JSON`:

| Opção | Valor |
|---|---|
| `authority` | `auth-server-url` + `/realms/` + `realm` |
| `client_id` | `resource` |
| `redirect_uri` / `post_logout_redirect_uri` | URL base da aplicação |
| `response_type` | `code` (Authorization Code + PKCE) |
| `scope` | `openid profile email` |
| `automaticSilentRenew` | `true` |
| `accessTokenExpiringNotificationTimeInSeconds` | `30` |

Depois do login, a URL é limpa com `replaceState`.

---

## format.ts

`dateTime` é um `Intl.DateTimeFormat` com formato curto de data e hora, em `pt-BR`, no fuso `America/Recife`.

> O fuso está fixo em `America/Recife`. Se o sistema for usado em outro fuso, esse valor precisa ser revisto.

---

> **Observações**
>
> - `auth.ts` depende de `config/env.ts`, que lê as variáveis.
> - Os valores de configuração não são segredos. O cliente OIDC é público.
