<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&height=200&color=0:042F2E,45:0F766E,100:4C1D95&text=Desenvolvimento%20de%20Software&fontSize=52&fontColor=ffffff&fontAlignY=42&animation=fadeIn&v=99&version=3&cache=1" width="100%" alt="Desenvolvimento de Software" />
</p>

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./Assets/logo-cin-branco.png">
    <source media="(prefers-color-scheme: light)" srcset="./Assets/logo-cin-escuro.png">
    <img src="./Assets/logo-cin-escuro.png" width="220" alt="Centro de Informática - UFPE" />
  </picture>
</p>

<h1 align="center">Controle de Frequência Acadêmica</h1>

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=20&pause=1100&color=2DD4BF&center=true&vCenter=true&width=760&height=40&lines=Chamada+por+c%C3%B3digo+em+tela+cheia;Presen%C3%A7a+registrada+pelo+aluno+no+prazo;React+%C2%B7+NestJS+%C2%B7+PostgreSQL+%C2%B7+Keycloak" alt="Destaques do projeto" />
</p>

<p align="center">
  <strong>Desenvolvimento de Software · Grupo 8 · Projeto P07 · UFPE, 2026.2</strong>
  <!-- [CONFIRMAR] nome/código da disciplina -->
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-22.12%2B-0F766E?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js 22.12+" />
  <img src="https://img.shields.io/badge/Sprint-3-4C1D95?style=flat-square" alt="Sprint 3" />
  <img src="https://img.shields.io/badge/testes-97%20passando-0F766E?style=flat-square" alt="97 testes passando" />
  <img src="https://img.shields.io/badge/auth-Keycloak%20OIDC-4C1D95?style=flat-square&logo=keycloak&logoColor=white" alt="Keycloak OIDC" />
</p>

<p align="center">
  <a href="#sobre">Sobre</a> &nbsp;•&nbsp;
  <a href="#inicio-rapido">Início rápido</a> &nbsp;•&nbsp;
  <a href="#arquitetura">Arquitetura</a> &nbsp;•&nbsp;
  <a href="#api-dados">API e dados</a> &nbsp;•&nbsp;
  <a href="#qualidade">Qualidade</a> &nbsp;•&nbsp;
  <a href="#stack">Stack</a> &nbsp;•&nbsp;
  <a href="#equipe">Equipe</a>
</p>

---

<a id="sobre"></a>
## Sobre

Sistema de **Desenvolvimento de Software** do **Grupo 8** que implementa um **controle de frequência acadêmica** com três perfis de acesso:

| Perfil | O que faz |
|---|---|
| **Professor** | **Abre uma chamada** para uma turma com validade de **1 a 120 minutos**, gerando um **código compartilhado** que pode ser **projetado em tela cheia**. Após o encerramento, pode **corrigir presença ou falta**. |
| **Aluno** | **Registra a presença digitando o código** dentro do prazo. Há **uma presença por aluno em cada chamada**. |
| **Administrador** | Acesso administrativo ao sistema, com visão de todas as turmas. |

A frequência do aluno é calculada **somente sobre chamadas encerradas**: sem registro, a chamada conta como falta; chamadas abertas aparecem como pendentes.

A solução é dividida em um **frontend** em **React + TypeScript + Vite** (`p07-frontend`) e um **backend** em **NestJS + Prisma + PostgreSQL** (`backend`), com **autenticação via Keycloak (OIDC, Authorization Code + PKCE)**. O backend valida o **JWT (assinatura via JWKS, issuer e audience)** e restringe o acesso por **papel e vínculo com a turma**. Abertura, registro, correção e encerramento usam **transação e bloqueio da turma**, e um **índice parcial** garante no máximo uma chamada aberta por turma.

O frontend funciona em **modo demonstração** (dados fictícios, sem banco nem Keycloak) ou em **modo Keycloak** (API real), escolhido por configuração explícita.

>  **Entrega da Sprint 3:** suítes de teste (v1 e v2), matriz de rastreabilidade, **tabela de dívida técnica**, **três refatorações** com testes antes e depois, **manual do desenvolvedor** e a **integração frontend × backend** com evidências.

### Ciclo de uma chamada

```mermaid
stateDiagram-v2
    [*] --> Aberta: professor abre (1 a 120 min)
    Aberta --> Aberta: alunos registram presença com o código
    Aberta --> Encerrada: professor encerra
    Encerrada --> Encerrada: professor corrige presença ou falta
```

### Visão geral

```mermaid
flowchart LR
    P([Professor]) --> FE
    A([Aluno]) --> FE
    ADM([Administrador]) --> FE
    FE["Frontend<br/>React + TypeScript + Vite<br/>p07-frontend"] -->|"login OIDC (PKCE)"| KC["Keycloak"]
    FE -->|"API HTTP"| API["Backend<br/>NestJS + Prisma<br/>backend"]
    API -->|"valida JWT via JWKS"| KC
    API --> DB[("PostgreSQL 16")]
```

---
<a id="inicio-rapido"></a> 
## Início rápido

> **Ambiente de execução:** **Node.js 22.12+** (validado em Node 24 LTS) e **npm**. O backend utiliza PostgreSQL 16 e Keycloak 25 via Docker Compose.

### Pré-requisitos

| Ferramenta | Observação |
|---|---|
| **Node.js 22.12+** | O backend define `22` no `.nvmrc` |
| **Git** | Para clonar o repositório |
| **npm** | Gerenciador de pacotes |
| **Docker** e **Docker Compose** | PostgreSQL e Keycloak (necessário apenas no modo integrado) |

---

### 1. Clonar o repositório

```bash
git clone [https://github.com/mateuscresp/DS-G8-Frequencia.git](https://github.com/mateuscresp/DS-G8-Frequencia.git)
cd DS-G8-Frequencia
```

---

### 2. Modo demonstração (sem Docker, banco ou Keycloak)

Ideal para validar a interface e o fluxo de chamada rapidamente com dados fictícios armazenados no navegador:

```bash
cd p07-frontend
npm ci
npm run dev
```

1. Acesse a URL exibida pelo Vite (padrão: `http://localhost:5173`).
2. Escolha **Professor**, selecione uma turma e abra uma chamada para gerar o código.
3. Clique em **Projetar** para exibir o código em tela cheia.
4. Em outra aba do mesmo navegador, acesse `http://localhost:5173/aluno`, informe o código e volte à aba do professor para conferir a presença registrada.

> 💡 Sem arquivo `.env.local` (ou com `VITE_APP_MODE=demo`), o frontend opera 100% em modo demonstração.

---

### 3. Modo integrado (Frontend + Backend NestJS + PostgreSQL + Keycloak)

<details>
<summary><b>Ver passo a passo completo</b></summary>

<br>

#### 3.1 Subir PostgreSQL e Keycloak

A partir da raiz do repositório (`DS-G8-Frequencia/`):

```bash
cd backend
docker compose up -d
```

Aguarde cerca de 20–30 segundos até o Keycloak finalizar a inicialização (`http://localhost:8080`).
* **PostgreSQL:** `localhost:5433` (usuário `postgres`, senha `postgres`, banco `frequencia`)
* **Keycloak Admin Console:** `http://localhost:8080` (usuário `admin`, senha `admin`)

#### 3.2 Provisionar o Keycloak

> O `docker-compose.yml` não importa o realm automaticamente. Configure uma única vez no console (`http://localhost:8080`):

1. **Criar o Realm:** crie o realm `p07-frequencia` e selecione-o.
2. **Criar os papéis (Realm Roles):** crie exatamente os três papéis:
   * `p07-admin`
   * `p07-professor`
   * `p07-student`
3. **Criar o cliente do frontend:** em **Clients → Create client**:
   * **Client type:** `OpenID Connect`
   * **Client ID:** `p07-front`
   * **Client authentication:** `Off` (cliente público, Authorization Code + PKCE)
   * **Valid redirect URIs:** `http://localhost:5173/*`
   * **Web origins:** `http://localhost:5173`
4. **Configurar a audiência (`aud`) esperada pelo backend (`p07-back`):**
   * Abra o cliente `p07-front` → aba **Client scopes** → clique em `p07-front-dedicated`.
   * Clique em **Add mapper → By configuration → Audience**.
   * Defina um nome (ex.: `p07-back-audience`), preencha **Included Custom Audience** com `p07-back`, ative **Add to access token** (`On`) e salve.
5. **Criar usuários de teste:** em **Users → Add user**, crie um usuário para professor e outro para aluno:
   * Na aba **Credentials**, defina uma senha com **Temporary** desativado (`Off`).
   * Na aba **Role mapping**, atribua `p07-professor` ou `p07-student`.
   * Copie o **ID** (UUID / `sub`) de cada usuário criado — ele será usado no passo 3.4.

> ⚠️ **Nunca coloque segredo de cliente em variáveis `VITE_*` do frontend.**

#### 3.3 Configurar e iniciar o Backend

Ainda dentro de `backend/`:

```bash
# Linux / macOS / Git Bash
cp .env.example .env

# Windows (PowerShell)
# Copy-Item .env.example .env
```

Os valores padrão do `.env.example` já correspondem ao Docker Compose (`porta 5433`, realm `p07-frequencia`, client `p07-back` e CORS `http://localhost:5173`). Em seguida, instale as dependências, aplique as migrations em banco novo e inicie a API:

```bash
npm ci
npm run prisma:generate
npm run migration:run     # veja backend/MIGRATION-NOTES.md se usar banco já existente
npm run db:seed           # popula apenas os status iniciais (CallStatus e AttendanceStatus)
npm run dev
```

A API ficará disponível em `http://localhost:3000/frequencia/api` e a documentação Swagger em `http://localhost:3000/api/docs`.

#### 3.4 Cadastrar turmas e vínculos acadêmicos

Como o `db:seed` cria apenas os status de chamada/presença, cadastre ao menos uma turma e vincule os `sub` (UUIDs) do Keycloak usando o Prisma Studio (em outro terminal, dentro de `backend/`):

```bash
cd backend
npx prisma studio
```

Pela interface web do Prisma Studio (`http://localhost:5555`), preencha nesta ordem:
1. **`Teacher` e `Student`:** cadastre os usuários informando o UUID do Keycloak no campo `keycloakId`.
2. **`Class`:** crie uma turma (ex.: código, nome e semestre).
3. **`ClassTeacher` e `Enrollment`:** vincule o professor e os alunos à turma criada.

#### 3.5 Configurar e iniciar o Frontend

Em um novo terminal, a partir da raiz do repositório (`DS-G8-Frequencia/`):

```bash
cd p07-frontend
npm ci

# Linux / macOS / Git Bash
cp .env.example .env.local

# Windows (PowerShell)
# Copy-Item .env.example .env.local
```

Abra `p07-frontend/.env.local` e altere a primeira variável para ativar a autenticação via Keycloak:

```env
VITE_APP_MODE=keycloak
```

As demais variáveis (`VITE_API_URL`, `VITE_KEYCLOAK_JSON` e `VITE_ROLE_*`) já vêm pré-configuradas no `.env.example` para o ambiente local. Inicie o frontend:

```bash
npm run dev
```

Acesse `http://localhost:5173` e faça login com os usuários criados no Keycloak.

</details>

---

### Variáveis de ambiente principais

| Local | Variável | Valor padrão (local) | Descrição |
|---|---|---|---|
| `backend/.env` | `DATABASE_URL` | `postgresql://postgres:postgres@localhost:5433/frequencia` | Conexão PostgreSQL |
| `backend/.env` | `KEYCLOAK_AUTH_SERVER_URL` | `http://localhost:8080` | URL base do Keycloak |
| `backend/.env` | `KEYCLOAK_REALM` / `KEYCLOAK_CLIENT_ID` | `p07-frequencia` / `p07-back` | Realm e audiência esperada no JWT |
| `backend/.env` | `CORS_ORIGINS` | `http://localhost:5173` | Origens permitidas pelo CORS |
| `backend/.env` | `API_PREFIX` | `frequencia/api` | Prefixo global das rotas HTTP |
| `p07-frontend/.env.local` | `VITE_APP_MODE` | `demo` (alterar para `keycloak`) | Define modo demonstração ou API real |
| `p07-frontend/.env.local` | `VITE_API_URL` | `http://localhost:3000/frequencia/api` | URL base do backend |
| `p07-frontend/.env.local` | `VITE_KEYCLOAK_JSON` | `{"realm":"p07-frequencia",...}` | Configuração pública do cliente OIDC |
| `p07-frontend/.env.local` | `VITE_ROLE_ADMIN` / `PROFESSOR` / `ALUNO` | `p07-admin` / `p07-professor` / `p07-student` | Papéis mapeados do token |

---

### Docker (Frontend)

A partir da raiz do repositório (`DS-G8-Frequencia/`):

```bash
cd p07-frontend
docker build -t frequencia-front .
docker run --rm -p 8081:80 frequencia-front
```

A imagem serve o modo demonstração em `http://localhost:8081`. Para gerar a imagem em modo integrado, passe `--build-arg` com `VITE_APP_MODE=keycloak`, `VITE_API_URL` e `VITE_KEYCLOAK_JSON`.

---

### Validação pós-execução

A partir da raiz do repositório (`DS-G8-Frequencia/`):

```bash
# 1. Validar Frontend (tipagem, testes e build)
cd p07-frontend
npm run check && npm test && npm run build

# 2. Validar Backend (lint, testes unitários e build)
cd ../backend
npm run lint:ci && npm test && npm run build
```

#### Testes HTTP de integração (Backend)

A suíte E2E exige um banco PostgreSQL **exclusivo e descartável** cujo nome contenha `_test`. Dentro de `backend/`, com o container `p07-postgres` em execução:

```bash
# Criar banco descartável de teste
docker exec -it p07-postgres createdb -U postgres frequencia_test

# Linux / macOS / Git Bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/frequencia_test" npm run migration:run
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/frequencia_test" npm run test:e2e

# Windows (PowerShell)
# $env:DATABASE_URL="postgresql://postgres:postgres@localhost:5433/frequencia_test"
# npm run migration:run
# npm run test:e2e
```

> ⚠️ **Nunca aponte `test:e2e` para o banco principal (`frequencia`).** A suíte cria e remove fixtures próprias durante a execução.

<a id="arquitetura"></a>
##  Arquitetura

<details>
<summary><b> Estrutura de pastas</b></summary>

```text
DS-G8-Frequencia/
├── backend/                      # API NestJS
│   ├── prisma/
│   │   ├── migrations/
│   │   ├── schema.prisma
│   │   └── seed.mjs
│   ├── src/
│   │   ├── common/               # auth (Keycloak/JWKS), filtros, exceções, paginação
│   │   ├── config/               # env, database, keycloak, swagger
│   │   ├── database/             # PrismaService
│   │   ├── modules/
│   │   │   ├── attendance/       # chamadas e presenças
│   │   │   ├── classes/          # turmas e acesso por vínculo
│   │   │   └── health/
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── tests/                    # unitários (Vitest) e HTTP (e2e)
│   ├── Dockerfile
│   ├── docker-compose.yml        # PostgreSQL 16 + Keycloak 25
│   ├── MIGRATION-NOTES.md
│   └── .env.example
├── p07-frontend/                 # React + TypeScript + Vite
│   ├── src/
│   │   ├── app/                  # provider OIDC e sessão
│   │   ├── components/           # layout e UI
│   │   ├── hooks/                # useAttendance, useClasses
│   │   ├── modules/
│   │   │   ├── attendance/       # domínio, storage, resumo, componentes
│   │   │   └── classes/
│   │   ├── pages/                # Dashboard, Aluno, Professor, Admin
│   │   ├── integration.ts        # cliente HTTP da API
│   │   └── routes.tsx
│   ├── tests/                    # v1-llm, v2 e integration
│   ├── Dockerfile
│   ├── nginx.conf
│   └── REFATORACAO.md
├── docs/
│   ├── integracao/               # integração da Sprint 3 e evidências
│   ├── qualidade/                # dívida técnica, log e relatório de refatoração
│   ├── testes/                   # matrizes, logs, relatórios e análise crítica
│   ├── scripts/
│   ├── manual-desenvolvedor.md
│   └── SPRINT3-CHECKLIST.md
└── README.md
```

</details>

### Principais responsabilidades

| Camada | Arquivo / função | Responsabilidade |
|---|---|---|
| Identidade | `common/auth/identity/keycloak.identity-source.ts` | Assinatura JWT/JWKS, issuer, audience/azp, subject e papel |
| Autorização | `modules/classes/class-access.ts` | Restringe leitura e gestão por vínculo e papel |
| Aplicação | `modules/attendance/attendance.service.ts` | `list`, `open`, `register`, `close`, `correct` |
| Apresentação | `modules/attendance/call-view.ts` | Normaliza datas e oculta código e registros de terceiros |
| Persistência | Prisma + migrations | Integridade, transações e auditoria |
| Orquestração (front) | `hooks/useAttendance.ts` | Executa ações, evita duplo envio e descarta consultas antigas |
| Transporte (front) | `integration.ts` | Endpoints e envelope da API |

---

<a id="api-dados"></a>
## API e dados

- **Prefixo padrão:** `/frequencia/api` · **Swagger:** `/api/docs` (padrão do `.env.example`)
- **Sucesso:** `{ success: true, data, timestamp }` · **Erros:** Problem Details
- **Códigos:** `422` corpo inválido · `401` identidade ausente/inválida · `403` acesso negado · `404` inexistente · `409` conflito

###  Endpoints

| Método e caminho | Acesso | Corpo |
|---|---|---|
| `GET /classes` | Turmas vinculadas; admin vê todas | — |
| `GET /classes/:id` | Membro da turma ou admin | — |
| `GET /classes/:id/students` | Professor vinculado ou admin | — |
| `GET /calls?classId=UUID` | Mesma restrição de turmas | — |
| `POST /classes/:id/calls` | Professor vinculado ou admin | `{ "minutes": 5 }` (inteiro 1–120) |
| `POST /attendance` | Aluno matriculado | `{ "code": "ABC123" }` |
| `POST /calls/:id/close` | Professor vinculado ou admin | — |
| `PATCH /calls/:id/attendance/:studentId` | Professor vinculado ou admin | `{ "status": "presente" }` ou `"ausente"` |

>  A identidade do aluno vem **do token**, nunca de um `studentId` no corpo do registro. O código é **compartilhado por toda a turma** até expirar. Expirar o código **não encerra** a chamada: o professor encerra e pode abrir outra.

### Modelo de dados (Prisma)

| Entidade | Papel |
|---|---|
| `Teacher`, `Student` | Identificados pelo `sub` do Keycloak |
| `Class` | Turma (indexada por semestre) |
| `ClassTeacher`, `Enrollment` | Vínculos professor×turma e aluno×turma (únicos) |
| `Call`, `CallStatus` | Chamada e seus status (no máximo uma aberta por turma) |
| `AttendanceToken` | Código de presença com expiração |
| `Attendance`, `AttendanceStatus` | Presença única por aluno/chamada |
| `AuditLog` | Auditoria das ações |

---

<a id="qualidade"></a>
## Qualidade e testes

| Item | Resultado |
|---|---|
| Frontend — testes | **58** (50 da suíte v2 + 8 do cliente HTTP), com tipagem e build aprovados |
| Backend — testes unitários | **39**, com build aprovado |
|  Integração HTTP | **5 cenários** com PostgreSQL temporário e JWT RS256 via JWKS local: autenticação, isolamento, concorrência, duplicidade, correção, auditoria e expiração |
| Cobertura (domínio de presença no frontend) | v1: 100% linhas / 97,67% branches · v2: 100% / 100% |

 Os 100% de cobertura valem **apenas para o domínio de presença do frontend**, não para o projeto inteiro. Os testes não substituem a homologação do realm Keycloak, do CORS e do PostgreSQL 16 do compose.

### Documentação

| Documento | Local |
|---|---|
| Manual do desenvolvedor | `docs/manual-desenvolvedor.md` |
| Integração (Sprint 3) e dívida complementar | `docs/integracao/README.md` |
| Checklist da Sprint 3 | `docs/SPRINT3-CHECKLIST.md` |
| Dívida técnica e plano de pagamento | `docs/qualidade/divida-tecnica.md` |
| Relatório de refatoração | `docs/qualidade/relatorio-refatoracao.pdf` |
| Matrizes, logs e análise crítica | `docs/testes/` |
| Notas de migração do banco | `backend/MIGRATION-NOTES.md` |

### Limitações conhecidas

- Nomes completos dos alunos ainda não existem no schema (a lista usa matrícula ou identificador).
- Não há tela de administração de usuários e matrículas.
- Listagens sem paginação e com *polling* de 5 s no frontend.
- Realm, audiência e vínculos do Keycloak precisam ser provisionados e homologados pela equipe antes de ativar a API.

---

<a id="stack"></a>
## Stack

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=flat-square&logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Keycloak-4D4D4D?style=flat-square&logo=keycloak&logoColor=white" alt="Keycloak" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/Vitest-6E9F18?style=flat-square&logo=vitest&logoColor=white" alt="Vitest" />
  <img src="https://img.shields.io/badge/Biome-60A5FA?style=flat-square&logo=biome&logoColor=white" alt="Biome" />
  <img src="https://img.shields.io/badge/Git-F03C2E?style=flat-square&logo=git&logoColor=white" alt="Git" />
</p>

<details>
<summary><b> Dependências principais</b></summary>

<br>

Veja `backend/package.json` e `p07-frontend/package.json` para a lista completa.

**Backend**
- **NestJS** (^10): framework da API
- **Prisma** (^5): ORM e migrations
- **jose** (^5): validação de JWT/JWKS
- **zod** / **class-validator**: validação de entrada
- **helmet** e **@nestjs/throttler**: segurança e limite de requisições
- **Swagger**: documentação da API
- **Vitest** (^1) e **Biome** (^1.8): testes e lint

**Frontend**
- **React** (^18.3) e **React Router** (^7)
- **Vite** (^7) e **TypeScript** (~5.9)
- **react-oidc-context** e **oidc-client-ts**: login via Keycloak
- **Vitest** (3.2.4): testes

>  Base do frontend adaptada do StarterKit ReactJS do CInCoders.

</details>

---

<a id="equipe"></a>
## Equipe

<div align="center">
  <table>
    <tr>
      <td align="center" style="padding: 0 10px;">
        <a href="https://github.com/mateuscresp">
          <img src="https://images.weserv.nl/?url=github.com/mateuscresp.png&w=72&h=72&mask=circle" alt="mateuscresp" width="72"><br><sub><b>mateuscresp</b></sub>
        </a>
      </td>
      <td align="center" style="padding: 0 10px;">
        <a href="https://github.com/Eugeni1">
          <img src="https://images.weserv.nl/?url=github.com/Eugeni1.png&w=72&h=72&mask=circle" alt="Eugeni1" width="72"><br><sub><b>Eugeni1</b></sub>
        </a>
      </td>
      <td align="center" style="padding: 0 10px;">
        <a href="https://github.com/codigopratico">
          <img src="https://images.weserv.nl/?url=github.com/codigopratico.png&w=72&h=72&mask=circle" alt="codigopratico" width="72"><br><sub><b>codigopratico</b></sub>
        </a>
      </td>
      <td align="center" style="padding: 0 10px;">
        <a href="https://github.com/Guilhermerlemos">
          <img src="https://images.weserv.nl/?url=github.com/Guilhermerlemos.png&w=72&h=72&mask=circle" alt="Guilhermerlemos" width="72"><br><sub><b>Guilhermerlemos</b></sub>
        </a>
      </td>
      <td align="center" style="padding: 0 10px;">
        <a href="https://github.com/SANTOSBUENO-cpu">
          <img src="https://images.weserv.nl/?url=github.com/SANTOSBUENO-cpu.png&w=72&h=72&mask=circle" alt="SANTOSBUENO-cpu" width="72"><br><sub><b>SANTOSBUENO-cpu</b></sub>
        </a>
      </td>
    </tr>
  </table>
</div>

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&height=120&color=0:4C1D95,100:0F766E&section=footer&v=99&version=3&cache=1" width="100%" alt="Rodapé" />
</p>
