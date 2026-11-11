# Dívida técnica inicial e plano de pagamento

Escopo: frontend em modo demonstração, leitura do código em 11/11/2026. Achados confirmados por inspeção do assistente; **confirmação por membro da equipe pendente**, conforme o roteiro. Estimativas são propostas em horas de trabalho, não tempo já gasto. A equipe deve atribuir responsáveis reais e validar prioridades. Não foram atribuídas pessoas sem informação.

| ID | Local | Problema e categoria | Consequência concreta | Evidência / descoberta | Prioridade, plano e estimativa | Status |
|---|---|---|---|---|---|---|
| DT-01 | `src/attendance.ts`, `openCall` e `timeLeft` | Literais 1, 120, 3, 60000, 1000 e 60: Magic Numbers, integridade conceitual | Duração, tamanho do código e conversões não têm nomes que expliquem o contrato; manutenção pode divergir | Leitura do assistente; limites exercitados em CT01–03 e CT24–25 | Alta; Replace Magic Literal por constantes nomeadas, preservar mensagens e valores; 0,5 h | Refatorado |
| DT-02 | `src/attendance.ts`, tipos e `demoClasses` | Tipos, fixtures e regras no mesmo módulo: baixa coesão, SRP | Alterar nomes/matrículas de demonstração mexe no arquivo das regras; dificulta localizar responsabilidades | Leitura do assistente; arquivo mistura catálogo de alunos e abertura/registro de presença | Alta; Extract Module para tipos, dados de demonstração e regras, manter fachada pública; 1 h | Aberto |
| DT-03 | `src/attendance.ts`, `readCalls` / `updateCalls` | Persistência de navegador junto das regras: baixa coesão, SRP, acoplamento | Detalhes de Web Locks/localStorage ficam misturados com validação de presença e confundem substituição da persistência | Leitura do assistente; CT26–32 caracterizam contrato da persistência | Alta; Move Function / Extract Module para storage com mesma chave e contrato; 0,5 h | Aberto |
| DT-04 | `register`, catálogo `demoClasses` | Dependência direta de dados concretos: DIP, acoplamento | O registro só valida matrícula contra fixtures; integrar dados da API exigirá trocar dependência da regra | Leitura do assistente; busca direta em demoClasses | Alta após contrato da API; injetar consulta de matrícula ou lista autorizada, com testes de turma inexistente/sem alunos; 2 h | Aberto |
| DT-05 | `pages/TeacherDashboard.tsx` | Orquestra carregamento remoto, seleção, relógio, abertura, encerramento e correção: SRP / baixa coesão | Mudança de API compete com manutenção da chamada; testar isoladamente exige muitos estados | Leitura do assistente; efeitos de classes/roster e callbacks de domínio no componente | Média; extrair hooks de consulta e operações de encerramento/correção; antes, testes dessas operações; 3 h | Aberto |
| DT-06 | `StudentHistory.tsx` e `summary.ts` | Conhecimento duplicado do estado encerrado/ausência implícita: Duplicated Code conceitual | Alterar a política de faltas pode fazer tabela e indicador discordarem | Leitura do assistente: histórico usa `closedAt ? 'ausente' : 'pendente'`; resumo usa total menos presentes | Média; extrair política compartilhada de status com testes aberto/fechado e todos os registros; 1 h | Aberto |
| DT-07 | `readCalls` | Desserialização sem validar formato/versionar dados: fronteira de dados frágil | JSON sintaticamente válido mas com formato errado pode derrubar consumidores; dado corrompido interrompe a tela | Inspeção: `JSON.parse(stored)` sem esquema; CT30 só cobre sintaxe inválida, não validação de estrutura | Alta antes de uso real; validar esquema, prever migração e recuperação explícita sem apagar dados silenciosamente; 2 h | Aberto |
| DT-08 | `src/styles.css` | Estilos globais de tabela, botão e cartão em arquivo único: acoplamento da interface | Ajuste visual em um seletor amplo pode afetar várias telas; domínio não protege esse comportamento | Leitura do assistente; seletores globais e breakpoints compartilhados | Baixa; organizar por tokens/layout/módulos ou CSS Modules, com regressão visual antes; 2 h | Aberto |

## Escolha dos três primeiros pagamentos

DT-01 torna contratos explícitos e possui testes de fronteira. DT-02 separa responsabilidades sem trocar o contrato público. DT-03 isola a persistência, cujos caminhos de sucesso e falha foram cobertos na v2. A v2 deve passar antes de cada alteração e novamente depois; cada item recebe um commit próprio.

## Backlog e coordenação propostos

1. Matriz e critérios: revisão conjunta da equipe, 1 h; confirmar histórias da Sprint 2 e a adequação da execução assistida à atividade.
2. Suítes e métricas: pessoa a definir, 1 h para leitura e reprodução local; precede novos pagamentos de dívida.
3. DT-01/02/03: implementação assistida nesta entrega; revisão humana a definir.
4. DT-04/07: próxima integração, responsáveis frontend/backend a definir; dependem do contrato e da política de recuperação.
5. DT-05/06: próxima manutenção das regras, pessoa a definir; dependem de testes adicionais.
6. DT-08: manutenção visual posterior, pessoa a definir; depende de regressão de UI.

As estimativas não substituem a distribuição real no backlog Scrum. Cadastro, alertas de falta, relatórios e integração real permanecem funcionalidades pendentes do produto, não são falsamente classificados como dívidas já pagas.
