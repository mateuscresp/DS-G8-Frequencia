# Pagination — paginação das listagens

Esta pasta contém os **DTOs de paginação**: a validação dos parâmetros da URL e o formato da resposta paginada.

---

## Estrutura

| Arquivo | Responsabilidade |
|---|---|
| `pagination-query.dto.ts` | Valida `page` e `limit` com Zod e calcula `skip` e `take`. |
| `paginated-response.dto.ts` | Monta a resposta com `items` e `meta`. |

---

## Parâmetros de consulta

| Parâmetro | Tipo | Padrão | Regra |
|---|---|---|---|
| `page` | inteiro | `1` | Mínimo `1`. |
| `limit` | inteiro | `20` | Entre `1` e `100`. |

Os valores chegam como texto na URL e são convertidos para número. Valores fora da regra geram erro `422`.

---

## Cálculos

| Valor | Fórmula |
|---|---|
| `skip` | `(page - 1) * limit` |
| `take` | `limit` |
| `totalPages` | `ceil(total / limit)` |

---

## Formato da resposta

```json
{
  "items": [ "..." ],
  "meta": { "page": 1, "limit": 20, "total": 150, "totalPages": 8 }
}
```

`PaginatedResponseDto.of(items, total, query)` monta esse formato a partir da consulta.

---

> Observações
>
> - As listagens das turmas e das chamadas ainda não usam paginação. O README principal lista isso como limitação conhecida.
> - Se uma listagem passar a usar paginação, o frontend também precisará enviar `page` e `limit`. Hoje ele não envia esses parâmetros.
