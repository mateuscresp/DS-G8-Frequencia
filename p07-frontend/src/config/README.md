# Config — variáveis de ambiente do frontend

Esta pasta lê as **variáveis `VITE_*`** e expõe os valores para o resto da aplicação. Nada aqui é segredo: tudo vai para o navegador.

---

## Arquivo

| Arquivo | Função |
|---|---|
| `env.ts` | Define `demo`, `env` (URL da API e base) e `keycloakConfig()`. |

---

## Variáveis

| Variável | Padrão | Uso |
|---|---|---|
| `VITE_APP_MODE` | `demo` | `demo` ou `keycloak`. Qualquer outro valor é tratado como `demo`. |
| `VITE_API_URL` | `http://localhost:3000/frequencia/api` | Base da API. A barra final é removida. |
| `VITE_KEYCLOAK_JSON` | — | JSON com `auth-server-url`, `realm` e `resource`. Obrigatório no modo `keycloak`. |
| `BASE_URL` | definido pelo Vite | Base das rotas e do redirecionamento. |

---

## Validação

- `keycloakConfig()` lança erro se `VITE_APP_MODE` não for `keycloak`.
- Também lança erro se `VITE_KEYCLOAK_JSON` não tiver `auth-server-url`, `realm` e `resource`. A mensagem pede para configurar essas chaves.

---

>  **Atenção**
>
> - Nunca coloque segredo de cliente em variáveis `VITE_*`. Elas viram texto público no código do navegador.
> - O `.env.example` e o `.env.local` são as referências para configurar o ambiente.
