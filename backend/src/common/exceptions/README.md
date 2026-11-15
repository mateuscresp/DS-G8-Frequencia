# Exceptions — erros da aplicação

Esta pasta define as **exceções de negócio** da API. Cada uma carrega um código interno, uma mensagem e o status HTTP correspondente.

---

## Estrutura

| Arquivo | Responsabilidade |
|---|---|
| `error-code.enum.ts` | Códigos internos de erro. |
| `app.exception.ts` | Classe base `AppException`, que estende `HttpException`. |
| `access-denied.exception.ts` | Acesso negado. Status `403`. |
| `resource-not-found.exception.ts` | Recurso inexistente. Status `404`. |

---

## Códigos internos (`ErrorCode`)

| Código | Uso |
|---|---|
| `NOT_FOUND` | Recurso não encontrado. |
| `VALIDATION_FAILED` | Dados de entrada inválidos. |
| `ACCESS_DENIED` | Usuário sem permissão. |
| `CONFLICT` | Conflito com o estado atual, por exemplo chamada já aberta. |
| `EXTERNAL_SERVICE_UNAVAILABLE` | Serviço externo indisponível. |
| `INTERNAL_ERROR` | Erro inesperado. |

---

## Classes

| Classe | Construtor | Mensagem padrão | Status |
|---|---|---|---|
| `AppException` | `(code, message, status = 500)` | Definida na chamada | Definido na chamada |
| `AccessDeniedException` | `(message?)` | "Acesso negado." | `403` |
| `ResourceNotFoundException` | `(resource, id?)` | "<recurso> com id "<id>" não encontrado(a)." | `404` |

`AppException` sobrescreve `getResponse()` para devolver `{ code, message }`. O `HttpExceptionFilter` usa esse formato para montar a resposta de erro.

---

## Como usar

```ts
throw new ResourceNotFoundException('Turma', classId);
throw new AccessDeniedException('Você não tem permissão para acessar este recurso.');
```

Para um erro de negócio novo, crie uma subclasse de `AppException` com o código e o status certos, em vez de lançar `HttpException` direto. Assim o código aparece na resposta padronizada.

---

> Observações
>
> - `AccessDeniedException` é lançado também pelo `RolesGuard` e pelo `KeycloakIdentitySource`.
> - O código `CONFLICT` é usado nas regras de chamada, como a tentativa de abrir uma segunda chamada na mesma turma.
