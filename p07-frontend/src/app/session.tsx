import { createContext, useContext } from 'react'

export type Role = 'admin' | 'professor' | 'aluno'
export type Session = { role: Role; subject: string; name: string }
export const roleLabels: Record<Role, string> = {
  admin: 'Administrador', professor: 'Professor', aluno: 'Aluno',
}
export const roles: Role[] = ['professor', 'aluno', 'admin']
export function isRole(value: string | null): value is Role {
  return roles.includes(value as Role)
}
export type SessionContextValue = {
  session: Session
  switchRole?: (role: Role) => void
  logout?: () => Promise<void>
}
export const SessionContext = createContext<SessionContextValue | undefined>(undefined)
export function useSession() {
  const value = useContext(SessionContext)
  if (!value) throw new Error('Sessão indisponível.')
  return value
}
