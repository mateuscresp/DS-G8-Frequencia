# Integration tests — cliente da API

Esta pasta testa o **contrato entre o frontend e a API**: os endpoints chamados, o corpo enviado e a forma como os erros chegam à tela. A rede é simulada, então os testes não precisam do backend rodando.

---

## Arquivo

| Arquivo | Conteúdo |
|---|---|
| `api.test.ts` | 8 testes sobre `integration.ts`, com `fetchApi` simulado. |

---

## O que é verificado

| Teste | Garante |
|---|---|
| Lista de turmas | O DTO de turmas é devolvido sem depender de `teacher.user`. |
| Lista de alunos | O id do aluno vem do `keycloakId`, normalizado. |
| Chamadas | Consulta `/calls`, sem filtro extra no frontend. |
| Abrir chamada | Envia `{ minutes }` e codifica o id no caminho (`a/b` vira `a%2Fb`). |
| Registro de presença | Envia só o `code`, sem `studentId` no corpo. |
| Encerrar e corrigir | Chama `/close` e `PATCH /attendance/:studentId`, com o id codificado. |
| Erro da API | A mensagem `detail` chega ao usuário. |
| Envelope inesperado | Resposta sem `success` ou `data` gera "A API retornou uma resposta inesperada". |

---

> **Observações**
>
> - O teste de registro reforça a regra do backend: a identidade do aluno vem do token, não do corpo da requisição.
> - Como `fetchApi` é simulado, estes testes não cobrem renovação de token. Essa parte está em `services/api.ts`.
