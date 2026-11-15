import { beforeEach, expect, it, vi } from 'vitest'
import { loadClasses, loadStudents, loadCalls, createCall, submitPresence, closeCall, correctPresence } from '../../src/integration'
import { fetchApi } from '../../src/services/api'
vi.mock('../../src/services/api', () => ({ API_URL: 'http://api', fetchApi: vi.fn(), getApiErrorMessage: async (r: Response) => (await r.json()).detail }))
beforeEach(() => vi.clearAllMocks())
function reply(data: unknown) { vi.mocked(fetchApi).mockImplementation(async () => new Response(JSON.stringify({ success: true, data }))) }
it('usa DTO de turmas sem depender de teacher.user', async () => { reply([{id:'ds',name:'Software',code:'IF1'}]); expect(await loadClasses(new AbortController().signal)).toEqual([{id:'ds',name:'Software',code:'IF1'}]) })
it('usa keycloakId normalizado no DTO dos alunos', async () => { reply([{id:'subject',name:'Aluno 01',number:'01'}]); expect((await loadStudents('ds',new AbortController().signal))[0].id).toBe('subject') })
it('consulta somente chamadas visíveis ao usuário autenticado', async () => { reply([]); expect(await loadCalls(new AbortController().signal)).toEqual([]); expect(fetchApi).toHaveBeenCalledWith('http://api/calls',expect.any(Object)) })
it('abre com duração e codifica id no caminho', async () => { reply({id:'call'}); await createCall('a/b',5); expect(fetchApi).toHaveBeenCalledWith('http://api/classes/a%2Fb/calls',expect.objectContaining({method:'POST',body:'{"minutes":5}'})) })
it('não envia id de aluno no registro', async () => { reply({id:'call'}); await submitPresence('ABC123'); expect(fetchApi).toHaveBeenCalledWith('http://api/attendance',expect.objectContaining({body:'{"code":"ABC123"}'})) })
it('encerra e corrige pelos endpoints correspondentes', async () => { reply({id:'call'}); await closeCall('call'); await correctPresence('call','user/id','ausente'); expect(fetchApi).toHaveBeenNthCalledWith(1,'http://api/calls/call/close',expect.objectContaining({method:'POST'}));expect(fetchApi).toHaveBeenNthCalledWith(2,'http://api/calls/call/attendance/user%2Fid',expect.objectContaining({method:'PATCH',body:'{"status":"ausente"}'})) })
it('propaga mensagem de erro da API', async () => { vi.mocked(fetchApi).mockResolvedValue(new Response(JSON.stringify({detail:'Chamada encerrada'}),{status:409}));await expect(submitPresence('ABC123')).rejects.toThrow('Chamada encerrada') })
it('recusa envelope inesperado', async () => { vi.mocked(fetchApi).mockResolvedValue(new Response('{}')); await expect(loadClasses(new AbortController().signal)).rejects.toThrow('resposta inesperada') })
