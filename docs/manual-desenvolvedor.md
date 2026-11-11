# Manual do desenvolvedor — Frequência UFPE

## Escopo e execução

Frontend React 18 + TypeScript + Vite 7, React Router, Lucide, Poppins e Roboto locais. Use Node.js 22.12+ e npm. Em `p07-frontend`, execute `npm ci`, `npm run dev`; para produção, `npm run build`. O modo padrão é demonstração, com dados fictícios. Rotas: `/aluno`, `/professor`, `/admin`. O seletor de perfis só existe na demonstração. Nenhum teste desta entrega depende de banco ou Keycloak.

A integração real está preparada parcialmente em `integration.ts`, `services/api.ts` e `app/provider.tsx`, mas o fluxo de presença da API não foi validado. Consulte `p07-frontend/README.md` para configuração. Não confunda uma demonstração funcionando com autenticação/autorização real prontas.

## Arquitetura

1. `main.tsx` monta `App`, que fornece sessão e rotas. `routes.tsx` seleciona a tela de acordo com o perfil.
2. `pages/Dashboard.tsx` compõe `AppShell`, saudação e `StudentDashboard`/`TeacherDashboard`. A administração reaproveita a gestão de chamadas e `AdminOverview`.
3. `components/layout` fornece navegação, busca e atalhos; `components/ui` concentra componentes visuais pequenos. `styles.css` contém os tokens do Figma e regras responsivas; SVGs ficam em `assets/figma`.
4. `modules/attendance/components` apresenta a chamada, formulário de presença, lista, indicadores e projeção. `modules/classes/components` apresenta turmas e próximas aulas.
5. `hooks/useAttendance.ts` mantém estado React, feedback de sucesso/erro, persistência e sincronização entre abas.
6. `modules/attendance/domain/rules.ts` implementa abertura, registro e tempo restante. `types.ts` define os contratos; `constants.ts` dá nomes aos limites/conversões. `demoData.ts` contém as fixtures.
7. `modules/attendance/storage.ts` encapsula localStorage/Web Locks. `summary.ts` calcula frequência. `attendance.ts` é uma fachada de compatibilidade: exporta a mesma API usada pelas telas e testes anteriores.

Dependências relevantes: telas → hook/fachada → regras ou armazenamento. As regras ainda consultam `demoClasses` diretamente; DT-04 registra essa limitação. A separação não afirma que o domínio ficou completamente independente de infraestrutura ou fixtures.

## Contratos e funções principais

| Função | Entradas / saída | Contrato |
|---|---|---|
| `openCall(calls, classId, minutes)` | Lista, turma, duração → nova lista | Inteiro 1–120; impede outra chamada aberta da mesma turma, mesmo expirada; código de 6 dígitos hexadecimais, único no histórico; datas em milissegundos |
| `register(calls, code, studentId)` | Lista, código, aluno → nova lista | Exige chamada conhecida, aberta, não expirada e matrícula; bloqueia duplicata e ausência manual; preserva demais alunos/chamadas |
| `timeLeft(expiresAt, now)` | Instantes em ms → string | Arredonda segundos para cima, limita em zero e formata mm:ss |
| `readCalls()` | Sem entrada → lista salva | Chave `frequencia-ufpe:demo:v1`; lista vazia sem valor; erros de JSON propagam |
| `updateCalls(change)` | Callback → Promise da lista persistida | Lê e escreve dentro de Web Lock quando disponível; fallback via Promise; falhas propagam |
| `attendanceSummary(calls, studentId)` | Chamadas já filtradas por turmas do aluno | Considera só encerradas; presente explícito conta presença, resto falta; arredonda percentual; null sem aulas |
| `useAttendance()` | Hook React | Expõe calls, busy, notice e changeCalls; escuta eventos storage de outras abas |

`Call.records` relaciona ID de aluno a `presente`/`ausente`. Registro ausente em chamada aberta significa pendente; após encerramento conta falta. Os instantes são epoch em ms, formatados para `America/Recife` nas telas. Um código expirar não encerra automaticamente a chamada: o professor ainda encerra e corrige registros.

O formulário do aluno normaliza caracteres e bloqueia colar/arrastar. Essa restrição de interface não impede fraude por si só. Encerramento e correção permanecem nos callbacks do professor; não foram extraídos nem abrangidos por testes unitários específicos nesta atividade (DT-05).

## Testes e cobertura

- `npm test` / `npm run test:v2`: suíte final, 50 casos.
- `npm run test:v1`: suíte inicial preservada, 44 casos.
- `npm run test:coverage:v1` e `npm run test:coverage:v2`: novas medições no código atual, salvas em `p07-frontend/coverage/v1` e `coverage/v2`.
- `npm run check`: verifica tipos do app e dos testes.
- `npm run build`: verifica tipos do app e produz `dist/`.

As medições históricas em `docs/testes/relatorios/v1` e `v2` foram obtidas ANTES de DT-01/02/03, no mesmo código. Não sobrescreva essas evidências ao medir o código reorganizado. Para reproduzir exatamente a comparação histórica, use o commit `test: amplia suite v2 e registra diagnostico inicial de divida` em uma cópia separada e os scripts existentes naquele commit. Os hashes de commits podem mudar após `git am`, mas os assuntos e a ordem são preservados.

Vitest usa ambiente Node. Relógio e APIs do navegador são substituídos nos testes; não há chamada real à API. `coverage.include` restringe a medição ao domínio de presença, persistência e resumo; tipos e fixtures separados são excluídos. Os testes foram desenhados contra a fachada pública para continuar válidos após mover arquivos. Não mudar testes da v1 para acomodar alterações futuras; novos cenários vão para a v2 ou uma suíte posterior.

100% dos módulos selecionados não significa 100% da aplicação: componentes React, autenticação, backend, rede, concorrência real entre processos, ações de encerramento/correção da UI e segurança ficam fora dessa medição. A v1 atingiu 100% de linhas sem testar o fallback de locks; a matriz revela outras lacunas que o percentual estrutural não mostra.

## Manutenção e entrega

Para nova regra: formalizar critério, escrever teste, executar a suíte antes, alterar em passos pequenos, executar depois, atualizar dívida/documentação. Refatorações não devem mudar mensagens, dados persistidos nem comportamento. Mantenha IDs DT nos commits.

Documentos: `docs/testes` contém matriz, log, respostas integrais, indicadores e análise crítica; `docs/qualidade` contém dívida, log, evidências e relatório de refatoração. `docs/SPRINT3-CHECKLIST.md` separa o que foi implementado do que ainda depende da revisão humana.
