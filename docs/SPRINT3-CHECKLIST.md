# Sprint 3 - conferência de entrega

Base: frontend com refatoração visual já aplicada. Trabalho novo restrito a `p07-frontend/` e documentos novos em `docs/`. **Zero mudanças em `p07-backend/`, contratos da API, migrations, Docker ou configuração compartilhada de autenticação.** A entrega é importada em branch separada; não faz push nem merge automaticamente. O backend de outro integrante pode evoluir em sua própria branch.

## Materiais técnicos preparados

| Exigência | Evidência | Situação |
|---|---|---|
| Suíte v1 sem edição | `p07-frontend/tests/v1-llm`; resposta integral e SHA-256 | 44 testes passaram |
| Suíte v2 melhorada | `p07-frontend/tests/v2` | 50 testes passaram |
| Linhas e branches de v1/v2 | `docs/testes/relatorios/v1` e `v2` | 100% / 97,67% e 100% / 100%, respectivamente |
| Matriz inicial e final | `docs/testes/matriz-inicial.md`, `matriz-final.md` | Produzidas por IA; revisão humana pendente |
| Logs e contexto integral | `docs/testes/llm-log.md`, `contexto`, `respostas` | Disponíveis com limites metodológicos explícitos |
| Análise crítica até 5 páginas | `docs/testes/analise-critica.pdf` | 4 páginas |
| Dívida e plano de pagamento | `docs/qualidade/divida-tecnica.md` | 8 itens; 3 refatorados, 5 abertos; confirmação humana pendente |
| Log de análise e descartes | `docs/qualidade/log-analise.md` | Disponível |
| 3 refatorações em commits próprios | DT-01, DT-02 e DT-03 | 50 testes passaram antes e após cada item |
| Relatório até 3 páginas | `docs/qualidade/relatorio-refatoracao.pdf` | 3 páginas |
| Manual | `docs/manual-desenvolvedor.md` | Arquitetura, funções, execução, testes e limitações |
| Tipagem e build | `docs/testes/relatorios/typecheck-final.txt`, `build-final.txt` | Aprovados |

## Pendências que a IA não pode declarar concluídas pela equipe

- A matriz manual independente exigida pelo roteiro não existia antes desta interação. A matriz produzida aqui foi feita pela IA e o experimento não foi cego. Revisar agora não transforma retroativamente a etapa em manual: consultar a docente sobre aceitação ou repetição do procedimento.
- Reconciliar US01-US05 e critérios com as histórias efetivamente entregues na Sprint 2; US05 representa persistência de suporte.
- Cada achado de qualidade precisa ser confirmado por um integrante; registrar autores reais, divergências e decisões, sem atribuições fictícias.
- Revisar oráculos, distribuir tarefas no backlog e garantir que todos compreendam a suíte e as refatorações.
- Importar os commits, executar os comandos localmente e enviar ao GitHub quando revisado. Os commits locais são evidência da sequência desta execução assistida, não de uma sequência humana anterior.
- Confirmar a data de entrega no ambiente da disciplina: a mensagem recebida não trouxe uma data após “até”.

Não é correto marcar a Sprint inteira como entregue antes dessas verificações. A infraestrutura técnica e os materiais estão preparados para revisão; a integração real e testes do backend não fazem parte deste pacote.
