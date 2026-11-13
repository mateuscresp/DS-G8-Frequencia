# Hooks — estado e ações das telas

Esta pasta concentra a **lógica de estado** das telas. Os hooks escondem se os dados vêm do navegador (demonstração) ou da API (Keycloak), e as telas só consomem o resultado.

---

## Arquivos

| Arquivo | Responsabilidade |
|---|---|
| `useAttendance.ts` | Chamadas: lista e ações de abrir, registrar, encerrar e corrigir presença. |
| `useClasses.ts` | Turmas do usuário, com carregamento, erro e recarga. |

---

## useAttendance

| Retorno | Função |
|---|---|
| `calls` | Lista de chamadas visíveis ao usuário. |
| `busy` / `notice` | Estado de envio e mensagem de sucesso ou erro. |
| `startCall(classId, minutes)` | Abre uma chamada. |
| `registerPresence(code)` | Registra a presença do aluno. |
| `finishCall(id)` | Encerra a chamada. |
| `correctAttendance(id, studentId, status)` | Altera a presença de um aluno. |

**Como funciona**

- **Demonstração:** lê e grava no `localStorage` pelas funções de `modules/attendance/`. Outras abas são sincronizadas pelo evento `storage`.
- **Keycloak:** carrega as chamadas pela API e atualiza a lista a cada 5 segundos. Uma busca em andamento é cancelada ao trocar de perfil.
- Enquanto uma ação está em andamento, novas ações são ignoradas (`running`), evitando envio duplicado.
- Resposta remota atualiza a lista localmente, sem recarregar tudo.

---

## useClasses

| Retorno | Função |
|---|---|
| `classes` | Turmas do usuário. |
| `loading` / `error` | Estado do carregamento. |
| `reload()` | Busca as turmas de novo. |

**Como funciona**

- **Demonstração:** usa `demoClasses`. Para o aluno, filtra só as turmas em que ele está matriculado.
- **Keycloak:** busca as turmas pela API e recarrega quando perfil ou sessão mudam.

---

> **Observações**
>
> - Os hooks dependem de `useSession` (perfil atual) e do módulo `integration.ts` (chamadas à API).
> - O polling de 5 segundos é o único mecanismo de atualização em tempo real. Não há WebSocket.
