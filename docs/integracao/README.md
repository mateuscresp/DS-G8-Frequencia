# Integração complementar — Sprint 3

Data: 12/11/2026. Base frontend: `8c897865f0ce4b98e1aa278dfa4eafdb47cd71bd` (`sprint3/qualidade-20261111-205301`). Base backend: `6185ee857f4c71801c9d7c4f163d9a840b541cc3` (`eugenio-branch`). As bases foram reunidas em uma branch local, preservando seus históricos. Nenhuma publicação remota foi feita nesta etapa.

## O que mudou

- Backend em `backend/`, conforme a mudança feita na branch do backend. Imports relativos corrigem execução de `node dist/main` sem depender do alias TypeScript em runtime.
- Suíte unitária adicionada antes da implementação, com testes de caracterização da autenticação e contratos novos. O primeiro registro de contratos contém falhas esperadas por módulos ainda inexistentes. A formatação posterior dos testes não muda seus casos.
- ClassesModule passa a integrar AppModule. Turmas e alunos exigem autenticação e vínculo, com acesso administrativo explícito.
- AttendanceModule separa validação de entrada, regras de acesso, transações e projeção dos dados. O aluno vê somente seus registros e não recebe o código secreto pela listagem.
- Abertura, registro, correção e encerramento usam transação e bloqueio da turma. Um índice parcial impede duas chamadas abertas para a mesma turma. A presença é única por aluno/chamada. O código é compartilhado por toda a turma, e não consumido globalmente pelo primeiro aluno.
- Frontend usa `integration.ts` como cliente HTTP, `useClasses` para consultas e `useAttendance` para operações e atualização periódica. Dados de demonstração continuam locais e padrão; API é selecionada por configuração explícita.
- Não foi criado cadastro/senha/login próprio. O fluxo OIDC existente redireciona ao Keycloak.

## Arquitetura e principais funções

| Camada | Arquivo / função | Responsabilidade |
|---|---|---|
| Interface | `p07-frontend/src/pages` e `modules/*/components` | Compor telas e apresentar estados |
| Orquestração | `hooks/useAttendance.ts` | Executar ações, impedir duplo envio e descartar consultas antigas |
| Consulta | `hooks/useClasses.ts` | Carregar turmas e tratar cancelamento/erro |
| Transporte | `integration.ts` | Endpoints e envelope da API |
| Identidade | `backend/src/common/auth/identity/keycloak.identity-source.ts` | Assinatura JWT/JWKS, issuer, audience/azp, subject e papel |
| Autorização | `modules/classes/class-access.ts` | Restringir leitura e gestão por vínculo/papel |
| Aplicação | `modules/attendance/attendance.service.ts` | `list`, `open`, `register`, `close`, `correct` |
| Apresentação de dados | `modules/attendance/call-view.ts` | Normalizar datas e ocultar código/registros de terceiros |
| Persistência | Prisma + migrations | Integridade, transações e auditoria |

## Executar a demonstração

Requer Node 22.12+ ou 24 LTS (validação realizada em Node 24.22.1).

```powershell
Set-Location p07-frontend
npm ci
npm run check
npm test
npm run build
npm run dev
```

Sem `.env`, o modo padrão é demo. Se houver configuração anterior de API, ajuste `VITE_APP_MODE=demo` no `.env` do frontend e reinicie o Vite. O instalador não substitui `.env` existentes.

## Ativar API futuramente

1. Configure PostgreSQL e Keycloak conforme `backend/.env.example` e o compose existente. O compose não importa realm nem cria vínculos acadêmicos automaticamente.
2. Crie o realm `p07-frequencia`, os papéis `p07-admin`, `p07-professor`, `p07-student` e um cliente público OIDC `p07-front` com Authorization Code + PKCE, redirect URI e web origin do frontend. Configure o token para incluir `p07-back` em `aud`; esse é o cliente esperado pelo backend. Não coloque segredo de cliente em variáveis VITE.
3. Em banco **novo**, execute `npm ci`, `npm run prisma:generate`, `npm run migration:run` e `npm run db:seed` dentro de `backend`. Para banco existente, leia `backend/MIGRATION-NOTES.md` antes de aplicar qualquer migration.
4. Cadastre os identificadores `sub` do Keycloak em Teacher/Student e os vínculos ClassTeacher/Enrollment. O seed cria status, não usuários ou turmas da equipe.
5. Execute `npm run dev` no backend. Configure `VITE_APP_MODE=keycloak` e as demais variáveis de `p07-frontend/.env.example`; reinicie o frontend.

O schema do colega não possui nomes de alunos. A lista usa matrícula ou identificador quando necessário; a integração com diretório para nomes completos permanece dívida técnica. Não há tela de administração de usuários/matrículas nesta entrega.

## Contrato HTTP

Prefixo padrão `/frequencia/api`. Respostas de sucesso: `{ success: true, data, timestamp }`. Erros usam Problem Details e o frontend mostra `detail`. Corpos inválidos retornam 422; identidade ausente/inválida 401; acesso negado 403; inexistente 404; conflito 409.

| Método e caminho | Acesso | Corpo |
|---|---|---|
| GET `/classes` | Turmas vinculadas; admin vê todas | — |
| GET `/classes/:id` | Membro da turma ou admin | — |
| GET `/classes/:id/students` | Professor vinculado ou admin | — |
| GET `/calls?classId=UUID` | Mesma restrição de turmas; filtro opcional | — |
| POST `/classes/:id/calls` | Professor vinculado ou admin | `{ "minutes": 5 }` (inteiro 1–120) |
| POST `/attendance` | Aluno matriculado | `{ "code": "ABC123" }` |
| POST `/calls/:id/close` | Professor vinculado ou admin | — |
| PATCH `/calls/:id/attendance/:studentId` | Professor vinculado ou admin | `{ "status": "presente" }` ou `ausente` |

A identidade vem do token, nunca de `studentId` no corpo de registro. Expirar o código não encerra automaticamente a chamada: o professor pode encerrá-la e abrir outra. Correções continuam disponíveis após o encerramento.

## Validação e limites

- Frontend: 58 testes (50 da suíte v2 preservada + 8 do cliente HTTP), tipagem e build aprovados.
- Backend: 39 testes unitários; build aprovado. Lint conserva dois avisos `any` preexistentes no interceptor.
- Integração: 5 cenários HTTP agrupados em um teste principal (Node reporta 6 testes), com PostgreSQL 18.6 temporário e JWT RS256 verificado via servidor JWKS local. Cobrem autenticação, isolamento, concorrência, duplicidade, correção, auditoria e expiração. As duas migrations foram aplicadas em banco vazio.
- O teste não substitui homologação do realm Keycloak da equipe, da configuração CORS, nem do PostgreSQL 16 do compose. Não houve nova validação visual em navegador nesta etapa.
- Coberturas históricas de 100% documentadas anteriormente se referem somente ao domínio frontend escolhido, não ao projeto completo.

Para repetir a integração, crie um banco PostgreSQL descartável cujo nome contenha `_test`, aponte `DATABASE_URL` para ele, aplique migrations e rode `npm run test:e2e` no backend. A suíte cria fixtures próprias e as remove no final. Nunca use banco compartilhado. Ela gera chaves somente para o teste; não existe bypass de autenticação na aplicação.

## Conformidade com a Sprint 3

| Entrega | Situação atual |
|---|---|
| Código modular e testes unitários | Frontend e backend contemplados; evidências complementares nesta pasta |
| Manual do desenvolvedor | Manual anterior + este complemento de integração |
| Tabela de dívida e plano de pagamento | Oito itens históricos preservados; novos itens abaixo |
| Histórico das três refatorações | Preservado nos commits e relatórios anteriores |
| Revisão humana/metodologia acadêmica | Continua pendente conforme checklist anterior; não declarar entrega integral sem a equipe validar |

## Dívida complementar e plano

| ID | Achado | Impacto | Plano de pagamento | Prioridade / situação |
|---|---|---|---|---|
| INT-01 | Backend sem suíte automatizada | Regressões de acesso e presença | Caracterização, contratos e integração HTTP | Alta / implementado |
| INT-02 | Turmas públicas e sem módulo carregado | Exposição e endpoints indisponíveis | Importar módulo e restringir por JWT/vínculo | Alta / implementado |
| INT-03 | Falta de endpoints de chamada e presença | Fluxo real incompleto | Serviço transacional e contrato frontend | Alta / implementado |
| INT-04 | Lock e migrations ausentes do Git | Instalação e schema não reproduzíveis | Versionar lock, schema inicial e índice parcial | Alta / implementado para banco novo |
| INT-05 | Realm, audiência e vínculos não provisionados | API não pode ser homologada pela equipe | Responsável backend configura ambiente; equipe testa aluno/professor/admin antes de ativar API | Alta / aberto |
| INT-06 | Nome dos alunos ausente do schema | Lista pouco legível | Definir fonte de nomes com backend; não duplicar credenciais | Média / aberto |
| INT-07 | Listagens sem paginação e polling de 5 s | Custo crescente com muitas turmas | Medir volume e paginar consultas; revisar polling | Média / aberto |
| INT-08 | Interceptor usa any e normaliza valores falsy como null | Contrato genérico frágil | Adicionar casos para false/0 e tipar envelope antes de refatorar | Baixa / aberto |
| INT-09 | Audience opcional na validação de ambiente | Configuração incompleta enfraquece isolamento entre clientes | Tornar client obrigatório em produção e exigir audience específica após alinhar mapper do realm | Alta / aberto |
| INT-10 | Cobertura unitária backend parcial e falta de teste de interface ao vivo | Regressões de orquestração podem escapar | Expandir casos de falha/transação; automatizar UI com Keycloak de homologação | Média / aberto |

Os responsáveis nominais e o aceite precisam ser definidos pela equipe. Análise e implementação receberam apoio de IA; resultados automatizados são evidência técnica, não substituem a revisão humana exigida na disciplina. As limitações metodológicas históricas permanecem explícitas nos registros originais.
