# Refatoração da interface

Referência: [Tela do Aluno — Revisão após referências, frame 76:83](https://www.figma.com/design/zlK212GgVN50yrK3FY94Ao/Controle-de-Frequ%C3%AAncia?node-id=76-83).

## Organização

- `components/layout`: estrutura da página, navegação, cabeçalho, saudação e atalhos.
- `components/ui`: título de cartão, mensagens e ícones exportados do Figma.
- `pages`: composição das telas de aluno e professor; administrador utiliza a visão geral e a gestão de chamadas.
- `modules/attendance/components`: formulário do aluno, indicadores, validade do código, abertura da chamada, lista de alunos e projeção.
- `modules/classes/components`: lista de turmas com busca e próximas aulas.
- `hooks/useAttendance.ts`: persistência e sincronização da demonstração entre abas.
- `modules/attendance/summary.ts`: cálculo compartilhado da frequência, considerando chamadas encerradas.
- `styles.css`: tokens do Figma, estilos compartilhados e adaptação responsiva.

Poppins e Roboto são dependências locais via Fontsource. Os SVGs estão em `src/assets/figma`; a aplicação não depende dos links temporários do Figma.

## Adaptações ao escopo

A referência de desktop tem 1440 × 1024 px, menu de 288 px, cabeçalho de 80 px, margens de 48 px e espaços de 24 px. As regras para telas menores são adaptações responsivas.

Os números, nomes e horários vêm dos dados de demonstração e das chamadas salvas. A validade mostra o tempo do código digitado; sem um código identificado, mostra “—”. O percentual considera somente chamadas encerradas, incluindo correções feitas pelo professor. O cartão “Limite de Faltas” foi adaptado para “Aulas Encerradas”, pois ainda não há carga horária total nem regra de limite configuradas. Relatórios e configurações não foram acrescentados. O histórico existente continua disponível em “Minha frequência”.

O seletor de perfis da demonstração permanece no cabeçalho. A busca filtra turmas por nome, código, professor e semestre; clicar em uma turma do aluno seleciona seu histórico.

## Verificação

Executar `npm ci` e `npm run build`. Para visualizar, executar `npm run dev`.

Verificado no navegador: geração e projeção do código, código inválido e duplicado, registro do aluno, sincronização entre abas, encerramento, correção de presença, persistência após recarregar, busca, filtro de histórico, visão administrativa e larguras de 320, 390, 768, 1024 e 1440 px. A integração real com o backend continua pendente; esta refatoração mantém o modo de demonstração.
