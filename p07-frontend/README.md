# Frequência UFPE

Interface em React, TypeScript e Vite para o projeto P07 de controle de frequência.

## Executar

Use Node.js 24 LTS. A base foi adaptada do StarterKit ReactJS do CInCoders. Ela usa o provider react-oidc-context, React Router, cliente HTTP centralizado e ErrorBoundary do modelo, com a interface do Frequência UFPE.

```sh
npm ci
npm run dev
```

No modo padrão de demonstração, abra a URL do Vite. Escolha Professor, selecione uma turma e gere um código com a validade desejada. Use **Projetar** para mostrar o código em tela cheia. Em outra aba da mesma origem, abra `/aluno`, digite o código e volte à aba do professor para conferir o registro. A lista permite selecionar uma chamada anterior e corrigir presença ou falta após o encerramento.

O perfil Administrador reúne a visão geral das turmas, professores, alunos e chamadas, permitindo gerenciar as chamadas. O aluno vê seu histórico e a frequência calculada sobre chamadas encerradas. Uma chamada encerrada sem registro de presença conta como falta. Chamadas abertas aparecem como pendentes e não entram no percentual. Essas regras serão alinhadas ao contrato final do backend.

A demonstração usa dados fictícios e sincroniza pelo armazenamento local. Dispositivos e perfis de navegador diferentes usam dados separados. A aula mostrada no painel do aluno é ilustrativa.

```sh
npm run build
```

## Integração atual

Copie `.env.example` para `.env.local`, altere `VITE_APP_MODE=keycloak` e revise `VITE_API_URL` e `VITE_KEYCLOAK_JSON` (os valores padrão do `.env.example` já apontam para `http://localhost:3000/frequencia/api` e o realm `p07-frequencia`). Use apenas a configuração pública do cliente OIDC (`p07-front`, fluxo Authorization Code + PKCE S256).

O perfil é derivado dos papéis mapeados em `VITE_ROLE_ADMIN` (`p07-admin`), `VITE_ROLE_PROFESSOR` (`p07-professor`) e `VITE_ROLE_ALUNO` (`p07-student`). A sessão OIDC utiliza o armazenamento de sessão padrão do `oidc-client-ts`, e a alternância manual entre perfis fica disponível somente no modo `demo`.

No modo `keycloak`, o frontend consome a API NestJS (`integration.ts`, `useClasses.ts` e `useAttendance.ts`) com autenticação via Bearer JWT, isolamento por vínculo com a turma e atualização periódica a cada 5 segundos. Para subir o backend, o PostgreSQL e o Keycloak, siga o passo a passo na raiz em [`../README.md`](../README.md#inicio-rapido).
## Docker

```sh
docker build -t frequencia-front .
docker run --rm -p 8081:80 frequencia-front
```

Essa imagem serve a demonstração em `http://localhost:8081`. Para o modo integrado, informe os valores públicos de `VITE_APP_MODE`, `VITE_API_URL` e `VITE_KEYCLOAK_JSON` como argumentos de build. A orquestração conjunta depende da configuração final do backend e do Keycloak.

## Base e adaptação

Referência do frontend em https://gitlab.cin.ufpe.br/cincoders/platform/cincoders-reactjs-boilerplate.

A organização segue App → AppProvider → RouteMap, com páginas em src/pages, funções de domínio em src/attendance.ts e integração HTTP em src/services/api.ts. O provider, as rotas e o ErrorBoundary foram adaptados para preservar a identidade visual do projeto e executar a demonstração sem Keycloak. Os módulos de exemplo de tarefas e equipe do starter foram substituídos pelas telas acadêmicas.

O código de presença é compartilhado pela turma até expirar e cada aluno pode registrar uma presença por chamada. Ele é diferente do token de autenticação do Keycloak.
