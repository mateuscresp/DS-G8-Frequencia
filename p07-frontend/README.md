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

Copie `.env.example` para `.env.local` e configure `VITE_APP_MODE=keycloak` e `VITE_KEYCLOAK_JSON`. Use apenas a configuração pública do cliente. Use o cliente público do frontend no realm do projeto, com fluxo padrão, PKCE S256 e origens e URLs de redirecionamento correspondentes à URL do Vite ou do deploy. O perfil é derivado dos papéis ADMIN, PROFESSOR e STUDENT no realm ou no cliente configurado. Os nomes podem ser ajustados por VITE_ROLE_ADMIN, VITE_ROLE_PROFESSOR e VITE_ROLE_ALUNO. A sessão OIDC usa o armazenamento de sessão padrão do oidc-client-ts. A alternância manual entre perfis existe somente na demonstração.

A tela docente consulta `GET /classes` e `GET /classes/:id/students` usando o envelope `{ success, data }`. A filtragem docente na interface usa o `sub` do Keycloak e o `keycloakId` dos vínculos. As rotas atuais são públicas no NestJS. Para dados reais, a API precisa autenticar e autorizar o acesso por turma.

Chamadas reais, validação de presença, matrículas do aluno e próxima aula dependem das rotas do backend. O fluxo de demonstração não é habilitado no modo Keycloak. A API deverá validar a expiração, a matrícula, a autorização do professor e a unicidade da presença por chamada. O contrato real das rotas, os papéis e o login institucional ainda precisam ser validados com o backend da equipe. A tela de frequência disponível nesta entrega funciona no modo de demonstração.

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
