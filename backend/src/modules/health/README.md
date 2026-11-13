# Módulo health — verificação de saúde

Este módulo expõe um endpoint para checar se a aplicação e o **banco de dados** estão respondendo. Serve para monitoramento e para o Docker.

---

## Arquivos

| Arquivo | Responsabilidade |
|---|---|
| `health.controller.ts` | Define `GET /health` e a verificação do banco. |
| `health.module.ts` | Importa o `TerminusModule` e registra o controller. |

---

## Rota

| Método | Caminho | Acesso |
|---|---|---|
| `GET` | `/health` | Público (`@Public()`), sem token |

---

## O que é verificado

- Um `ping` no banco de dados, feito pelo `PrismaHealthIndicator` com o `PrismaService`.
- Banco respondendo: sucesso. Banco sem resposta: falha.

---

>  **Observações**
>
> - Este endpoint verifica apenas o banco. Não há checagem do Keycloak.
> - Como a rota é pública, não expõe dados de usuários.
