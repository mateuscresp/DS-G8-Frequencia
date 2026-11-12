# Notas da preparação do P07

## Alterações de identidade e banco

O schema Prisma agora usa `Teacher.keycloakId` e `Student.keycloakId` como identificadores externos, sem o modelo local `User`/`UserRole`. As relações de turmas, matrículas e frequências foram ajustadas para usar esses identificadores string.

A pasta `prisma/migrations` original foi preservada. **Não aplique o schema novo em um banco que contenha dados importantes sem criar e revisar uma migration de transição.** A migration inicial existente ainda representa o schema antigo. Em ambiente local descartável, faça backup se necessário e gere uma nova migration conforme o fluxo do projeto; não apague migrations já aplicadas em ambientes compartilhados.

O seed semeia os status `PRESENT`, `ABSENT` e `MANUAL`. O status `JUSTIFIED` foi removido para manter os dados de referência alinhados aos status definidos pela regra de negócio atual do P07.

## Keycloak

O `.env` foi alinhado ao compose do P07 (Keycloak 25 sem `--http-relative-path=/auth`) e usa:
- Realm: `p07-frequencia`
- Client: `p07-back`
- Roles esperadas: `p07-admin`, `p07-professor`, `p07-student`

Esses nomes precisam existir no realm/client real do Keycloak. O compose original do P07 não importa automaticamente um realm; configure-o no Keycloak antes de testar endpoints protegidos.

## Docker

O Dockerfile foi trazido do SooBackend. O `.dockerignore` evita copiar dependências locais, builds e `.env` para o contexto da imagem.

## Dependências e primeira preparação

O `package.json` foi atualizado para remover Passport/JWT e incluir `helmet` e `@nestjs/throttler`, mantendo a linha NestJS 10 já usada pelo P07. O ambiente de execução desta preparação estava sem acesso ao npm registry; portanto, o `package-lock.json` original foi preservado e precisa ser sincronizado localmente antes de usar `npm ci`/Docker:

```bash
npm install
npx prisma generate
```

Depois disso, valide o schema e crie/revise a migration antes de aplicar em um banco.


## Correções desta revisão (v2)

- `prisma/seed.mjs`: removido `JUSTIFIED` e incluído `MANUAL`.
- `src/app.module.ts`: registrado `ThrottlerModule` com limite global padrão de 100 requisições por 60 segundos e `ThrottlerGuard` como `APP_GUARD`.
- Versionamento URI (`/v1`) não foi adicionado: o contrato atual do P07 define rotas sem esse prefixo.
- `ClassesController` e `ClassesService` ainda precisam da implementação de autenticação/autorização por papel e proteção contra IDOR. Não foram inventadas regras de acesso sem validar a especificação funcional.
- A migration antiga foi preservada. Antes de qualquer reset ou remoção, verifique o estado do banco com `npx prisma migrate status`. Não use `migrate reset` em banco com dados que devam ser preservados.
- `package-lock.json` ainda precisa ser sincronizado no ambiente com acesso ao npm registry: execute `npm install` na raiz antes de `npm ci` ou do build Docker.
