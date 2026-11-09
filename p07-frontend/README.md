# Frequência UFPE

Interface em React, TypeScript e Vite para o projeto P07 de controle de frequência.

## Executar

Use Node.js 24 LTS. A configuração do Vite e o formato de ambiente seguem o StarterKit ReactJS do CInCoders, com as telas e o adaptador de autenticação próprios do P07.

```sh
npm ci
npm run dev
```

No modo padrão de demonstração, abra a URL do Vite. Escolha Professor, selecione uma turma e gere um código com a validade desejada. Use **Projetar** para mostrar o código em tela cheia. Em outra aba da mesma origem, abra `?perfil=aluno`, digite o código e volte à aba do professor para conferir o registro. A lista permite selecionar uma chamada anterior e corrigir presença ou falta após o encerramento.

A demonstração usa dados fictícios e sincroniza pelo armazenamento local. Dispositivos e perfis de navegador diferentes usam dados separados. A aula mostrada no painel do aluno é ilustrativa.

```sh
npm run build
```

## Integração atual

Copie `.env.example` para `.env.local` e configure `VITE_APP_MODE=keycloak` e `VITE_KEYCLOAK_JSON`. Use apenas a configuração pública do cliente. Use o cliente público do frontend no realm do projeto, com fluxo padrão, PKCE S256 e origens e URLs de redirecionamento correspondentes à URL do Vite ou do deploy. O perfil é derivado dos papéis `PROFESSOR` e `STUDENT` no realm ou no cliente configurado. O token fica em memória.

A tela docente consulta `GET /classes` e `GET /classes/:id/students` usando o envelope `{ success, data }`. A filtragem docente na interface usa o `sub` do Keycloak e o `keycloakId` dos vínculos. As rotas atuais são públicas no NestJS. Para dados reais, a API precisa autenticar e autorizar o acesso por turma.

Chamadas reais, validação de presença, matrículas do aluno e próxima aula dependem das rotas do backend. O fluxo de demonstração não é habilitado no modo Keycloak. A API deverá validar a expiração, a matrícula, a autorização do professor e a unicidade da presença por chamada. Relatórios e alertas ficaram fora desta entrega.

## Docker

```sh
docker build -t frequencia-front .
docker run --rm -p 8081:80 frequencia-front
```

Essa imagem serve a demonstração em `http://localhost:8081`. Para o modo integrado, informe os valores públicos de `VITE_APP_MODE`, `VITE_API_URL` e `VITE_KEYCLOAK_JSON` como argumentos de build. A orquestração conjunta depende da configuração final do backend e do Keycloak.
