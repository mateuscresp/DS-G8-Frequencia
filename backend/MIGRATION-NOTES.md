# Banco e identidade — integração de 12/11/2026

O schema utiliza Teacher.keycloakId e Student.keycloakId como identificadores externos do Keycloak, sem modelo local de credenciais.

## Banco novo

As migrations agora versionadas são `202611120001_initial` (schema atual) e `202611120002_one_open_call` (uma chamada aberta por turma). Com DATABASE_URL apontando para um banco vazio: `npm run prisma:generate`, `npm run migration:run`, `npm run db:seed`.

## Banco já existente

Não execute automaticamente a migration inicial em banco populado. Faça backup e compare o schema e a tabela `_prisma_migrations` com a equipe. Um banco do modelo antigo com User/UserRole exige migration de transição e mapeamento dos IDs ao Keycloak. Um banco já criado com o schema atual exige baseline validado antes do deploy. Não use reset nem marque migration como aplicada sem verificar equivalência.

O índice parcial também exige resolver chamadas abertas duplicadas antes de aplicá-lo; não remove dados automaticamente. As migrations foram validadas somente em banco novo descartável.

## Autenticação

Realm sugerido `p07-frequencia`; cliente público frontend `p07-front`; audience esperada na API `p07-back`; roles `p07-admin`, `p07-professor`, `p07-student`. O compose não provisiona realm, usuários, mapper de audience ou matrículas. O seed cria status de referência. Não há login próprio.

Consulte `docs/integracao/README.md` para contrato, execução, testes e limitações.
