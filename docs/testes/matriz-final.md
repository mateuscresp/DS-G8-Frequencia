# Matriz final de rastreabilidade

A origem assistida e os limites metodológicos permanecem descritos em `matriz-inicial.md`. A matriz inicial é imutável. Cada CT é identificado no nome e comentário dos testes. V2 incorpora os 44 casos da v1 e os seis de `gaps.test.ts`.

| CT | Critério | Partição / entrada | Limites | v1 | v2 | Melhoria |
|---|---|---|---|---|---|---|
| CT01 | US01-CA1 | duracao-inteira-valida; 1, 2, 5, 119, 120 minutos | 1, 2, 119, 120 | Sim | Sim | Preservado da v1 |
| CT02 | US01-CA1 | duracao-fora-faixa; 0, -1, 121 | 0, 121 | Sim | Sim | Preservado da v1 |
| CT03 | US01-CA1 | duracao-nao-inteira; 1.5, NaN, Infinity | — | Sim | Sim | Preservado da v1 |
| CT04 | US01-CA2 | mesma-turma-aberta; Chamada aberta da mesma turma, inclusive expirada | — | Sim | Sim | Preservado da v1 |
| CT05 | US01-CA2 | turma-sem-chamada-aberta; Chamada encerrada na mesma turma; aberta em outra | — | Sim | Sim | Preservado da v1 |
| CT06 | US01-CA3 | codigo-novo; Abrir chamada | — | Sim | Sim | Preservado da v1 |
| CT07 | US01-CA3 | colisao-de-codigo; Gerador retorna um código já usado e depois outro | — | Não | Sim | Caso adicional em gaps.test.ts |
| CT08 | US02-CA1 | codigo-inexistente; ZZZZZZ | — | Sim | Sim | Preservado da v1 |
| CT09 | US02-CA1 | chamada-encerrada; Código de chamada fechada | — | Sim | Sim | Preservado da v1 |
| CT10 | US02-CA1 | codigo-ainda-valido; Aluno matriculado, 1 ms antes da expiração | expiresAt - 1 ms | Sim | Sim | Preservado da v1 |
| CT11 | US02-CA1 | codigo-expirado; No instante e depois da expiração | expiresAt, expiresAt + 1 ms | Sim | Sim | Preservado da v1 |
| CT12 | US02-CA2 | aluno-nao-matriculado; Aluno estranho à turma ds | — | Sim | Sim | Preservado da v1 |
| CT13 | US02-CA2 | aluno-matriculado; Kauan na turma ds | — | Sim | Sim | Preservado da v1 |
| CT14 | US02-CA3 | presenca-ja-registrada; Registro prévio presente | — | Sim | Sim | Preservado da v1 |
| CT15 | US02-CA3 | ausencia-manual; Registro prévio ausente | — | Sim | Sim | Preservado da v1 |
| CT16 | US02-CA4 | alteracao-isolada; Duas chamadas e outros alunos presentes | — | Sim | Sim | Preservado da v1 |
| CT17 | US03-CA1 | chamadas-abertas; Somente chamadas abertas, mesmo com presença | — | Sim | Sim | Preservado da v1 |
| CT18 | US03-CA1 | chamadas-encerradas; Mistura abertas e encerradas | — | Sim | Sim | Preservado da v1 |
| CT19 | US03-CA2 | presente; Presente em todas as encerradas | — | Sim | Sim | Preservado da v1 |
| CT20 | US03-CA2 | ausente-explicito; Ausente em chamada encerrada | — | Sim | Sim | Preservado da v1 |
| CT21 | US03-CA2 | sem-registro-encerrada; Nenhum registro na chamada encerrada | — | Sim | Sim | Preservado da v1 |
| CT22 | US03-CA2 | fracao-arredondada; Uma presença em três encerradas | — | Sim | Sim | Preservado da v1 |
| CT23 | US03-CA3 | nenhuma-aula; Lista vazia | — | Sim | Sim | Preservado da v1 |
| CT24 | US04-CA1 | tempo-positivo; Tempo restante em torno de um segundo e um minuto | 1 ms, 999 ms, 1000 ms, 1001 ms, 59999 ms, 60000 ms, 60001 ms | Sim | Sim | Preservado da v1 |
| CT25 | US04-CA1 | tempo-esgotado; Expiração igual ou anterior a agora | -1 ms, 0 ms | Sim | Sim | Preservado da v1 |
| CT26 | US05-CA1 | armazenamento-vazio; Chave inexistente | — | Sim | Sim | Preservado da v1 |
| CT27 | US05-CA1 | armazenamento-valido; JSON com chamadas | — | Sim | Sim | Preservado da v1 |
| CT28 | US05-CA2 | com-web-locks; navigator.locks disponível | — | Sim | Sim | Preservado da v1 |
| CT29 | US05-CA2 | sem-web-locks; navigator.locks ausente | — | Não | Sim | Caso adicional em gaps.test.ts |
| CT30 | US05-CA3 | armazenamento-corrompido; JSON inválido | — | Não | Sim | Caso adicional em gaps.test.ts |
| CT31 | US05-CA3 | falha-na-transformacao; Callback lança erro | — | Não | Sim | Caso adicional em gaps.test.ts |
| CT32 | US05-CA3 | falha-na-gravacao; setItem lança erro de cota | — | Não | Sim | Caso adicional em gaps.test.ts |

Contagens: v1 13/14 critérios, 27/32 partições e 18/18 limites; v2 14/14, 32/32 e 18/18. Cobertura de critério significa ao menos um teste relacionado, não todas as combinações possíveis.
