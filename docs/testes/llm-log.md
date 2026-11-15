# Log de uso da LLM

Data: 11/11/2026. Ferramenta: ChatGPT/Codex, família GPT-6 conforme identificação do ambiente. Snapshot exato/versão interna não expostos; não foram inventados. Autor dos testes: assistente. Revisão humana da equipe: pendente.

## Pedido real do usuário

> Verifique se já fizemos tudo isso. Se não fizemos vamos fazer rapidinho.

Contexto: os dois PDFs da Sprint 3 e o código do frontend já refatorado visualmente. A refatoração visual ocorreu antes desta suíte e NÃO é apresentada como refatoração protegida pela v2.

## Rodada v1 — instrução de execução registrada pelo assistente

Texto completo da instrução usada para estruturar a geração, não uma mensagem adicional enviada por um aluno:

> Gere uma suíte unitária em TypeScript/Vitest 3.2.4 para as regras já implementadas de abertura de chamada, registro por código, cálculo de frequência, tempo restante e persistência local. Aplique partições de equivalência, análise de valores-limite e cobertura dos critérios de aceitação. Identifique em comentários a técnica e o requisito de cada teste. Fixe o relógio e isole APIs do navegador quando necessário. Verifique resultados observáveis e não apenas execução. Considere duração inteira de 1 a 120 minutos, uma chamada aberta por turma, código com seis caracteres único no histórico, validade estrita antes de expiresAt, matrícula obrigatória, bloqueio de duplicata e ausência ajustada, atualização isolada, percentual de chamadas encerradas com arredondamento e percentual nulo se não houver aulas, arredondamento do tempo para cima e persistência com Web Locks/fallback. Use as APIs públicas dos dois módulos fornecidos. Entregue o arquivo de testes completo.

Código de contexto integral: `contexto/attendance-antes.ts.txt` e `contexto/summary-antes.ts.txt`. Resposta integral preservada: `respostas/v1-resposta-integral.ts.txt`, idêntica a `p07-frontend/tests/v1-llm/attendance.test.ts`. O arquivo de testes não será alterado depois da primeira execução; eventuais falhas serão registradas.

**Desvio metodológico:** a matriz foi redigida pela própria IA antes desta geração e permanece no mesmo contexto. Não houve geração cega nem preparação manual independente. Os rótulos CT foram mantidos para rastreabilidade. Este material não comprova o cumprimento dessa parte do protocolo e precisa ser revisado pela equipe/docente.

Resultado da v1: 44 testes gerados, 44 passaram, 0 falharam, 0 erros de compilação/carregamento. Uma rodada, nenhuma correção para executar. Linhas: 100%; branches: 97,67%. Fonte: `relatorios/v1-execucao.txt` e `relatorios/v1/coverage-summary.json`. Nenhum defeito real demonstrado por teste falhando. Lacunas identificadas por inspeção: colisão controlada, fallback sem locks, JSON inválido, falha no callback e falha de gravação. Não foram introduzidas falhas artificiais na v1.

## Rodada v2 — instrução completa de melhoria

> A v1 passou 44 testes com 100% das linhas e 97,67% dos branches. Falta o caminho sem navigator.locks na linha 47 de attendance.ts. Também faltam cenários controlados de colisão, JSON inválido, callback que lança erro e falha em setItem. Gere testes específicos para essas lacunas, preserve a v1 e mantenha a mesma configuração de cobertura. Não altere as regras do produto para fazer testes passarem. Use resultados observáveis e comentários de rastreabilidade. Para erro de transformação, exercite tanto o caminho com lock quanto o fallback.

Resposta integral adicional: `respostas/v2-resposta-integral.ts.txt`. A v2 também contém uma cópia exata dos testes da v1; os seis testes novos estão em `tests/v2/gaps.test.ts` (um parametrizado em dois casos). Revisão feita pelo assistente contra os critérios documentados; revisão humana ainda pendente.

Resultado da v2 antes das refatorações: 50 testes passaram, 0 falharam, 0 erros de compilação/carregamento; linhas 100%, branches 100%. Os 6 casos adicionados cobrem 5 partições ausentes na v1 (CT31 executa duas variantes). Relatórios v1/v2 foram produzidos no mesmo código de produção, com a mesma ferramenta e escopo.

## Verificação adicional de tipos

Após as três refatorações foi acrescentado `npm run check`, cobrindo app, testes e configuração. A primeira tentativa falhou porque a dependência de tipos Node não estava declarada (`TS2688`), não por um teste que deixou de carregar no Vitest. A saída foi preservada em `relatorios/typecheck-tentativa-1.txt`. Adicionou-se `@types/node` como dependência de desenvolvimento; a segunda execução passou (`typecheck-final.txt`). Não houve edição da v1 nem alteração dos seus oráculos. O build também passou; cobertura final pós-refatoração está em `docs/qualidade/evidencias/`.
