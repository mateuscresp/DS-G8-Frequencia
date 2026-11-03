# P07 - Backend do Sistema de Controle de Frequência

Backend do projeto acadêmico P07 para registro e consolidação de frequência de alunos.

## Stack

- **NestJS 11** - Framework Node.js
- **TypeScript** - Tipagem estática
- **Prisma ORM** - Acesso ao banco de dados
- **PostgreSQL** - Banco de dados relacional
- **Keycloak** - Autenticação e autorização (IAM)
- **Zod** - Validação de dados
- **Vitest** - Testes unitários
- **Biome** - Linting e formatação

## Setup

### Pré-requisitos

- Node.js 22 LTS (`nvm install 22 && nvm use 22`)
- Docker + Docker Compose

### Instalação

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Configure o ambiente:**
   ```bash
   cp .env.example .env
   ```

3. **Inicie os serviços de infraestrutura:**
   ```bash
   docker compose up -d
   ```

4. **Configure o banco de dados:**
   ```bash
   npm run migration:run
   npm run db:seed
   ```

### Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000/frequencia/api`

Swagger/OpenAPI: `http://localhost:3000/api/docs`

### Comandos úteis

| Comando | Descrição |
|---------|-----------|
| `npm run build` | Compilar TypeScript para JavaScript |
| `npm run lint` | Verificar e corrigir lint com Biome |
| `npm test` | Executar testes unitários |
| `npm run migration:generate` | Gerar e aplicar migration |
| `npm run migration:run` | Aplicar migrations pendentes |
| `npm run db:seed` | Popular tabelas de lookup |

## Arquitetura

```
src/
├── common/              # Recursos transversais
│   ├── auth/            # Keycloak, Guards, Decorators
│   ├── decorators/      # @Public(), @Roles()
│   ├── filters/         # HttpExceptionFilter
│   └── interceptors/    # TransformInterceptor
├── config/              # Configurações e validação de ambiente
├── database/            # Prisma Service (global)
├── modules/             # Módulos de domínio
│   ├── health/          # Health check
│   ├── classes/         # Turmas/Classes
│   ├── calls/           # Chamadas (attendance)
│   ├── attendances/     # Presenças
│   └── ...
├── app.module.ts        # Módulo raiz
└── main.ts              # Entry point
```

## Segurança

- **Autenticação**: Keycloak com JWT/JWKS
- **Autorização**: RBAC baseado em roles
- **Validação**: Zod + NestJS Pipes
- **Banco de dados**: Prisma (SQL injection safe)
- **Audit**: AuditLog para rastrear alterações

## Status

✅ Estrutura base criada
⏳ Módulos a implementar:
  - Autenticação com Keycloak
  - Módulo de turmas/classes
  - Módulo de chamadas
  - Módulo de presenças
  - Relatórios e cálculo de frequência
  - Testes

## Documentação

- [Backend Boilerplate CInCoders](https://cincoders-nestjs-starterkit.vercel.app)
- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
