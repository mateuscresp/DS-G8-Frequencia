# Interceptors — envelope das respostas

Esta pasta contém o interceptor que **padroniza as respostas de sucesso** da API.

---

## Estrutura

| Arquivo | Responsabilidade |
|---|---|
| `transform.interceptor.ts` | `TransformInterceptor`, que envolve o retorno de cada handler. |

---

## Formato de sucesso

Toda resposta de sucesso vem neste formato:

```json
{
  "success": true,
  "data": { "...": "conteúdo retornado pelo handler" },
  "timestamp": "2026-11-13T12:00:00.000Z"
}
```

- Se o handler retornar um valor falso (como `0`, `""`, `false` ou `null`), o campo `data` vira `null`.
- Erros não passam por este interceptor. Eles são tratados pelo `HttpExceptionFilter`.

---

## Consequências para o frontend

O cliente em `p07-frontend/src/integration.ts` espera exatamente este envelope. Se `success` não for `true` ou se `data` for `null`, o cliente lança o erro "A API retornou uma resposta inesperada.".

---

> Observações
>
> - O interceptor é registrado globalmente em `main.ts`.
> - Mudar este formato quebra todos os clientes da API, inclusive os testes de integração do frontend.
