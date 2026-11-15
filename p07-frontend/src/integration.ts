import type { Call, Class, Status, Student } from './attendance'
import { API_URL, fetchApi, getApiErrorMessage } from './services/api'
export { demo } from './config/env'

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetchApi(API_URL + path, init)
  if (!response.ok) throw new Error(await getApiErrorMessage(response, 'Não foi possível concluir a operação.'))
  const body = await response.json() as { success: boolean; data: T }
  if (body.success !== true || body.data == null) throw new Error('A API retornou uma resposta inesperada.')
  return body.data
}
function json(method: string, body?: object): RequestInit {
  return { method, ...(body ? { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : {}) }
}
export const loadClasses = (signal: AbortSignal) => request<Class[]>('/classes', { signal })
export const loadStudents = (id: string, signal: AbortSignal) => request<Student[]>('/classes/' + encodeURIComponent(id) + '/students', { signal })
export const loadCalls = (signal: AbortSignal) => request<Call[]>('/calls', { signal })
export const createCall = (id: string, minutes: number) => request<Call>('/classes/' + encodeURIComponent(id) + '/calls', json('POST', { minutes }))
export const submitPresence = (code: string) => request<Call>('/attendance', json('POST', { code }))
export const closeCall = (id: string) => request<Call>('/calls/' + encodeURIComponent(id) + '/close', json('POST'))
export const correctPresence = (id: string, studentId: string, status: Status) => request<Call>('/calls/' + encodeURIComponent(id) + '/attendance/' + encodeURIComponent(studentId), json('PATCH', { status }))
