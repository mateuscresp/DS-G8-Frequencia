import type { Class, Student } from './attendance'
import { API_URL, fetchApi, getApiErrorMessage } from './services/api'
export { demo } from './config/env'

type User = { keycloakId: string; username: string }
type ApiClass = {
  id: string
  name: string
  code: string
  semester: string | null
  teachers: { teacher: { user: User } }[]
}
type Enrollment = { student: { id: string; studentNumber: string | null; user: User } }

async function request<T>(path: string, signal: AbortSignal): Promise<T> {
  const response = await fetchApi(API_URL + path, { signal })
  if (!response.ok) throw new Error(await getApiErrorMessage(response, 'Não foi possível consultar os dados.'))
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
