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
