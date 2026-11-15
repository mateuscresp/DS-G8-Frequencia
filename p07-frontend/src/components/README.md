# Components — componentes compartilhados

Esta pasta guarda os componentes **usados em mais de uma tela**. Ela tem três partes: o `ErrorBoundary`, o layout da página e os elementos básicos de interface.

---

## Estrutura

| Arquivo / pasta | Responsabilidade |
|---|---|
| `ErrorBoundary.tsx` | Captura erros de renderização e mostra uma tela de erro com botão para tentar de novo. |
| `layout/` | Estrutura da página: `AppShell`, `Sidebar`, `TopBar`, `PageIntro` e `QuickAccess`. |
| `ui/` | Elementos básicos: `CardTitle`, `DesignIcon` e `Feedback`. |

---

## ErrorBoundary

- Componente de classe, porque o React só captura erro de renderização por `getDerivedStateFromError` e `componentDidCatch`.
- Aceita `label` (aparece no log), `resetKey` (quando muda, o erro é limpo) e `fallback` (tela própria, opcional).
- Sem `fallback`, usa `DefaultErrorFallback`: título, mensagem, detalhe do erro e o botão "Tentar novamente".

> O `ErrorBoundary` não captura erros de eventos (como `onClick`) nem de código assíncrono. Esses erros precisam ser tratados nas próprias telas.

---

## Layout

| Componente | O que mostra |
|---|---|
| `AppShell` | Estrutura principal: link "Ir para o conteúdo", `Sidebar`, `TopBar` e a área `main#inicio`. |
| `Sidebar` | Menu lateral. Os itens mudam conforme o perfil. Alunos veem "Registrar presença" e "Minha frequência". Admins veem "Todas as turmas". |
| `TopBar` | Seletor de perfil (demonstração) ou botão "Sair" (Keycloak), busca, avisos e avatar. |
| `PageIntro` | Saudação com o nome do usuário e um texto que muda conforme o perfil. |
| `QuickAccess` | Atalhos para as seções `#turmas`, `#chamada` e `#frequencia`. |

---

## UI

| Componente | Função |
|---|---|
| `CardTitle` | Título de card com ícone em um quadro. |
| `DesignIcon` | Renderiza um SVG de `src/assets/figma/` pelo nome. A imagem é decorativa (`aria-hidden`). |
| `Feedback` | Mensagem de erro (`role="alert"`) ou de sucesso (`role="status"`). |

---

> **Observações**
>
> - `DesignIcon` aceita apenas os nomes da lista interna. Um nome fora dela não compila.
> - As seções `#turmas`, `#chamada` e `#frequencia` são âncoras da página. Os links de `Sidebar` e `QuickAccess` dependem delas.
