# Unit tests — testes unitários do backend

Esta pasta contém os **testes unitários** da API. Eles verificam as regras de autorização e os contratos de entrada, sem banco e sem rede.

---

## Arquivos

| Arquivo | Testes | O que verifica |
|---|---|---|
| `auth.test.ts` | 10 | Guards de autenticação e papel, e validação de configuração do ambiente. |
| `contracts.test.ts` | 12 | Schemas de entrada e regras de acesso às turmas. |

---

## auth.test.ts

- Rota pública não consulta a identidade.
- Rota protegida sem identidade é negada com "Identidade".
- Identidade válida é anexada ao `request`.
- Papel exigido é permitido. Outro papel é negado.
- Usuário ausente com papel exigido é negado.
- Rota sem regra de papel fica liberada.
- Ambiente sem configuração do Keycloak é aceito, e configuração parcial é recusada.

---

## contracts.test.ts

| Área | Verificação |
|---|---|
| Abrir chamada | Aceita durações de 1 a 120 minutos. Recusa 0, 121, números não inteiros, texto e nulo. |
| Registro | Recusa `studentId` no corpo. Normaliza o código digitado. Recusa códigos com tamanho errado ou caracteres inválidos. |
| Correção | Aceita `presente` e `ausente`. Recusa outros valores. |
| Acesso à turma | Professor vinculado pode gerenciar. Professor de outra turma é negado. Aluno matriculado consulta, mas não gerencia. Aluno não matriculado é negado. Admin pode gerenciar. Turma inexistente gera erro. |

---

> Observações
>
> - Os nomes dos casos de teste estão em português. Eles descrevem a regra que está sendo verificada.
> - Se um schema ou regra de acesso mudar, estes testes devem ser atualizados junto.
