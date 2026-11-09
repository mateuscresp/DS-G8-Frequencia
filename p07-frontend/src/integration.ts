import Keycloak from 'keycloak-js'
import type { Class, Student } from './attendance'

const env = import.meta.env
export const demo = env.VITE_APP_MODE !== 'keycloak'
const apiUrl = (env.VITE_API_URL || 'http://localhost:3000/frequencia/api').replace(/\/+$/, '')
export type Role = 'professor' | 'aluno'

type User = { keycloakId: string; username: string }
type ApiClass = {
  id: string
  name: string
  code: string
  semester: string | null
  teachers: { teacher: { user: User } }[]
}
type Enrollment = { student: { id: string; studentNumber: string | null; user: User } }

let keycloak: Keycloak | undefined
const redirectUri = new URL(import.meta.env.BASE_URL, window.location.origin).href

export async function authenticate() {
  let config: { 'auth-server-url'?: string; realm?: string; resource?: string }
  try {
    config = JSON.parse(env.VITE_KEYCLOAK_JSON || '{}')
  } catch {
    throw new Error('A configuração VITE_KEYCLOAK_JSON precisa ser um JSON válido.')
  }
  const { 'auth-server-url': url, realm, resource: clientId } = config ?? {}
  if (!url || !realm || !clientId) throw new Error('Configure a URL, o realm e o client ID em VITE_KEYCLOAK_JSON.')
  keycloak = new Keycloak({ url, realm, clientId })
  await keycloak.init({ onLoad: 'login-required', pkceMethod: 'S256', checkLoginIframe: false, redirectUri })
  const roles = [...(keycloak.realmAccess?.roles ?? []), ...(keycloak.resourceAccess?.[clientId]?.roles ?? [])]
  const role: Role | undefined = roles.includes('PROFESSOR') ? 'professor' : roles.includes('STUDENT') ? 'aluno' : undefined
  if (!role) throw new Error('Sua conta precisa do perfil PROFESSOR ou STUDENT.')
  const subject = keycloak.subject
  if (!subject) throw new Error('A sessão não contém um identificador de usuário.')
  return { role, subject, name: keycloak.tokenParsed?.name || keycloak.tokenParsed?.preferred_username || (role === 'professor' ? 'Professor' : 'Aluno') }
}

export function logout() {
  return keycloak?.logout({ redirectUri })
}

async function request<T>(path: string, signal: AbortSignal): Promise<T> {
  if (!keycloak?.authenticated) throw new Error('Entre com sua conta para consultar as turmas.')
  await keycloak.updateToken(30)
  const response = await fetch(apiUrl + path, {
    signal,
    headers: { Authorization: 'Bearer ' + keycloak.token },
  })
  if (!response.ok) throw new Error('A consulta à API falhou. Verifique a conexão e tente novamente.')
  const body = await response.json() as { success: boolean; data: T }
  if (!body.success || body.data == null) throw new Error('A API retornou uma resposta inesperada.')
  return body.data
}

export async function loadTeacherClasses(subject: string, signal: AbortSignal): Promise<Class[]> {
  const classes = await request<ApiClass[]>('/classes', signal)
  return classes.filter(group => group.teachers.some(link => link.teacher.user.keycloakId === subject))
    .map(group => ({ id: group.id, name: group.name, code: group.code, semester: group.semester ?? undefined }))
}

export async function loadStudents(classId: string, signal: AbortSignal): Promise<Student[]> {
  const enrollments = await request<Enrollment[]>('/classes/' + encodeURIComponent(classId) + '/students', signal)
  return enrollments.map(({ student }) => ({
    id: student.id, name: student.user.username, number: student.studentNumber ?? undefined,
  }))
}
