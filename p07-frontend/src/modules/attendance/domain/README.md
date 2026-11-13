# Attendance domain — regras de presença

Esta pasta tem as **regras de negócio da presença** no frontend: tipos, limites e funções puras. Não há acesso ao navegador nem à rede aqui, então as regras podem ser testadas isoladamente.

---

## Arquivos

| Arquivo | Conteúdo |
|---|---|
| `constants.ts` | Limites e constantes de tempo. |
| `types.ts` | Tipos `Status`, `Student`, `Class` e `Call`. |
| `rules.ts` | Funções `openCall`, `register` e `timeLeft`. |

---

## Constantes

| Constante | Valor | Uso |
|---|---|---|
| `MIN_CALL_MINUTES` | `1` | Duração mínima da chamada. |
| `MAX_CALL_MINUTES` | `120` | Duração máxima da chamada. |
| `CODE_BYTE_LENGTH` | `3` | Três bytes viram seis caracteres hexadecimais. |
| `MILLISECONDS_PER_SECOND`, `SECONDS_PER_MINUTE`, `MILLISECONDS_PER_MINUTE` | — | Conversões de tempo. |

> O comentário do arquivo diz que mudar essas constantes exige revisar os critérios de aceitação.

---

## Funções

### `openCall(calls, classId, minutes)`

- Rejeita duração fora do intervalo de 1 a 120, ou não inteira.
- Rejeita nova chamada se já existir uma aberta para a mesma turma.
- Gera um código hexadecimal de seis caracteres e sorteia outro se o código já existir na lista.
- Devolve a nova lista, com a chamada nova no início.

### `register(calls, code, studentId)`

Valida, nesta ordem:

| Verificação | Mensagem |
|---|---|
| Código existe | "Código inválido..." |
| Chamada não está encerrada | "Esta chamada já foi encerrada." |
| Código não expirou | "O código expirou..." |
| Aluno matriculado na turma | "Você não está matriculado..." |
| Presença ainda não registrada | "Sua presença já foi registrada..." |
| Não foi marcado como ausente pelo professor | "Sua situação foi ajustada pelo professor..." |

Se tudo estiver certo, devolve a lista com `presente` para o aluno.

### `timeLeft(expiresAt, now)`

Devolve o tempo restante no formato `MM:SS`, sem valores negativos.

---

>  **Observações**
>
> - As funções não mudam o objeto original. Devolvem uma lista nova.
> - A verificação de matrícula usa os dados de demonstração (`demoClasses`). Em modo Keycloak, a API é quem decide.
