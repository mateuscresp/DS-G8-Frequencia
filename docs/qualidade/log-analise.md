# Log de análise de qualidade

11/11/2026, ChatGPT/Codex (família GPT-6; snapshot interno não exposto). Análise por leitura do assistente e medições reais do Vitest. Nenhuma inspeção humana, execução de Sonar, ESLint ou revisão por outro integrante é alegada.

## Procedimento e instruções registradas

Instrução de análise aplicada a `src/attendance.ts`, fornecido integralmente em `../testes/contexto/attendance-antes.ts.txt`:

> Inspecione este módulo quanto a integridade conceitual, information hiding, coesão, acoplamento, SOLID e code smells. Para cada achado indique arquivo/função, trecho observável, efeito concreto e refatoração possível. Não classifique ausência de funcionalidade como dívida. Não force todos os princípios SOLID quando não houver relação de subtipagem ou interface aplicável.

Resultado: DT-01, DT-02, DT-03, DT-04 e DT-07. A inspeção confirmou os literais, as responsabilidades combinadas, o uso de localStorage/Web Locks, a dependência de demoClasses e a ausência de validação após JSON.parse. A separação de storage não elimina a dependência dos dados fictícios (DT-04 permanece aberta).

Instrução aplicada a `pages/TeacherDashboard.tsx`:

> Identifique responsabilidades e dependências deste componente, indique possíveis smells e explique quais extrações exigiriam novos testes antes da alteração. Evite confundir número de linhas com um defeito comprovado.

Resultado: DT-05. Efeitos de consulta, seleção, relógio e operações de chamada têm motivos distintos para mudar. Não alterado nesta rodada por falta de testes específicos de encerramento e correção.

Instrução aplicada separadamente a `StudentHistory.tsx` e a `summary.ts`:

> Examine como este módulo interpreta chamadas abertas, encerradas, presenças e faltas; registre a política observável e possíveis pontos de divergência com seus consumidores.

Resultado da comparação: DT-06, política de ausência implícita distribuída entre tabela e resumo. Sem falha demonstrada no comportamento atual.

Instrução aplicada a `styles.css`:

> Examine alcance dos seletores e impacto potencial de uma alteração compartilhada entre telas; não recomende framework novo sem necessidade.

Resultado: DT-08. Não refatorado porque os testes unitários desta atividade não protegem layout.

## Achados descartados / limitações

- Guard clauses em register: não aceitar automaticamente como “Switch Statements”; são validações diferentes de uma mesma operação, não dispatch repetido de tipos. Extrair polimorfismo aqui adicionaria complexidade.
- LSP: não há hierarquia relevante nos módulos selecionados; não alegar violação sem subtipagem.
- Muitas props no TeacherCallCard: sinal para revisar legibilidade, mas não prova de ISP ou Long Parameter List por si só; a função recebe um objeto e os campos são usados.
- “100% de linhas resolve dívida”: descartado. A v1 atingiu 100% de linhas e ainda faltou o branch sem locks; nenhuma suíte desta etapa valida autenticação real ou layout.

## Ferramentas e configuração

Comandos usados: `rg --files`, leitura dos módulos, `git diff --check`, Vitest 3.2.4 e @vitest/coverage-v8 3.2.4. Configuração versionada em `p07-frontend/vitest.config.ts`, ambiente Node, include explícito dos módulos selecionados, reportOnFailure habilitado. Resultados completos em `docs/testes/relatorios/`.

## Comparação entre abordagens

A leitura do assistente encontrou mistura de responsabilidades e dependência de fixtures, que a cobertura não mede. A cobertura mostrou precisamente o branch não percorrido, que não se deve presumir exercitado só por ler os testes. Não há resultados de inspeção manual humana para comparar: a equipe deve registrar seus próprios achados, divergências e falsos positivos antes de concluir essa parte acadêmica.
