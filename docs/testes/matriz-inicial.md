# Matriz inicial (rascunho assistido por IA)

**Origem e limite do protocolo:** criada pelo assistente em 11/11/2026, antes dos testes desta etapa. NÃO é uma matriz manual independente da equipe. A geração posterior usa o mesmo contexto do assistente; NÃO constitui experimento cego. A equipe deve revisar os critérios e consultar a docente sobre a aceitação desta execução assistida. Não reescrever o histórico para simular etapas humanas.

Escopo: frontend em modo demonstração; `src/attendance.ts` e `src/modules/attendance/summary.ts`. Cinco histórias identificadas nesta atividade, não IDs comprovados do backlog da Sprint 2. Critérios reconstruídos do escopo acordado e do comportamento público já implementado: abrir chamada, registrar presença, consultar frequência, exibir validade e preservar registros no navegador. US05 é suporte técnico à persistência, não história de negócio confirmada pela equipe. Valores 1–120 min, seis caracteres, arredondamento e propagação de erro devem ser ratificados pela equipe.

| ID | Critério | Partição | Valores-limite | Entrada | Resultado esperado |
|---|---|---|---|---|---|
| CT01 | US01-CA1 | duracao-inteira-valida | 1, 2, 119, 120 | 1, 2, 5, 119, 120 minutos | Aceitar; expiresAt = agora + minutos × 60000 |
| CT02 | US01-CA1 | duracao-fora-faixa | 0, 121 | 0, -1, 121 | Rejeitar duração |
| CT03 | US01-CA1 | duracao-nao-inteira | — | 1.5, NaN, Infinity | Rejeitar duração |
| CT04 | US01-CA2 | mesma-turma-aberta | — | Chamada aberta da mesma turma, inclusive expirada | Rejeitar segunda abertura |
| CT05 | US01-CA2 | turma-sem-chamada-aberta | — | Chamada encerrada na mesma turma; aberta em outra | Abrir sem alterar chamadas anteriores |
| CT06 | US01-CA3 | codigo-novo | — | Abrir chamada | Código com seis caracteres hexadecimais maiúsculos; ID e datas válidos |
| CT07 | US01-CA3 | colisao-de-codigo | — | Gerador retorna um código já usado e depois outro | Repetir sorteio e preservar chamada existente |
| CT08 | US02-CA1 | codigo-inexistente | — | ZZZZZZ | Erro de código inválido |
| CT09 | US02-CA1 | chamada-encerrada | — | Código de chamada fechada | Rejeitar registro |
| CT10 | US02-CA1 | codigo-ainda-valido | expiresAt - 1 ms | Aluno matriculado, 1 ms antes da expiração | Registrar presença |
| CT11 | US02-CA1 | codigo-expirado | expiresAt, expiresAt + 1 ms | No instante e depois da expiração | Rejeitar registro |
| CT12 | US02-CA2 | aluno-nao-matriculado | — | Aluno estranho à turma ds | Rejeitar registro |
| CT13 | US02-CA2 | aluno-matriculado | — | Kauan na turma ds | Registrar presente |
| CT14 | US02-CA3 | presenca-ja-registrada | — | Registro prévio presente | Rejeitar duplicação |
| CT15 | US02-CA3 | ausencia-manual | — | Registro prévio ausente | Orientar correção pelo professor; não sobrescrever |
| CT16 | US02-CA4 | alteracao-isolada | — | Duas chamadas e outros alunos presentes | Atualizar só o aluno/chamada; entrada original intacta |
| CT17 | US03-CA1 | chamadas-abertas | — | Somente chamadas abertas, mesmo com presença | Ignorar no total e no percentual |
| CT18 | US03-CA1 | chamadas-encerradas | — | Mistura abertas e encerradas | Contar somente encerradas |
| CT19 | US03-CA2 | presente | — | Presente em todas as encerradas | 100% e zero faltas |
| CT20 | US03-CA2 | ausente-explicito | — | Ausente em chamada encerrada | 0% e uma falta |
| CT21 | US03-CA2 | sem-registro-encerrada | — | Nenhum registro na chamada encerrada | Contar falta |
| CT22 | US03-CA2 | fracao-arredondada | — | Uma presença em três encerradas | 33%; duas faltas |
| CT23 | US03-CA3 | nenhuma-aula | — | Lista vazia | total=0, present=0, absent=0, percentage=null |
| CT24 | US04-CA1 | tempo-positivo | 1 ms, 999 ms, 1000 ms, 1001 ms, 59999 ms, 60000 ms, 60001 ms | Tempo restante em torno de um segundo e um minuto | Arredondar para cima; formato mm:ss |
| CT25 | US04-CA1 | tempo-esgotado | -1 ms, 0 ms | Expiração igual ou anterior a agora | 00:00; nunca negativo |
| CT26 | US05-CA1 | armazenamento-vazio | — | Chave inexistente | Lista vazia |
| CT27 | US05-CA1 | armazenamento-valido | — | JSON com chamadas | Restaurar os registros |
| CT28 | US05-CA2 | com-web-locks | — | navigator.locks disponível | Ler e gravar dentro do lock; devolver lista persistida |
| CT29 | US05-CA2 | sem-web-locks | — | navigator.locks ausente | Ler, transformar e salvar pelo fallback |
| CT30 | US05-CA3 | armazenamento-corrompido | — | JSON inválido | Propagar erro; não sobrescrever silenciosamente |
| CT31 | US05-CA3 | falha-na-transformacao | — | Callback lança erro | Rejeitar Promise e preservar valor salvo |
| CT32 | US05-CA3 | falha-na-gravacao | — | setItem lança erro de cota | Propagar falha de gravação |

Contagem: 14 critérios, 32 partições (uma por linha), 18 pontos-limite únicos dentro de suas variáveis. CT01–03 compartilham o critério de duração; CT24–25 detalham a apresentação do tempo. A cobertura final será preenchida após executar os testes.
