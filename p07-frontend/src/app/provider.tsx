import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { AuthProvider, useAuth } from 'react-oidc-context'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { authProviderProps } from '../utils/auth'
import { demo, keycloakConfig } from '../config/env'
import { setAuthToken, setLogoutFn, setRefreshTokenFn } from '../services/api'
import { SessionContext, isRole, type Role, type Session } from './session'
import { demoStudent } from '../attendance'

function DemoProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>(() => {
    const value = new URLSearchParams(location.search).get('perfil') || location.pathname.split('/').filter(Boolean).at(-1) || ''
    return isRole(value) ? value : 'professor'
  })
  const session: Session = {
    role, subject: role === 'aluno' ? demoStudent.id : role,
    name: role === 'aluno' ? demoStudent.name : role === 'admin' ? 'Administrador' : 'Professor',
  }
  return <SessionContext.Provider value={{ session, switchRole: setRole }}>{children}</SessionContext.Provider>
}

function OidcSession({ children }: { children: ReactNode }) {
  const auth = useAuth()
  const [ready, setReady] = useState(false)
  const session = useMemo<Session | undefined>(() => {
    if (!auth.user) return
    // Read role claims for UI routing. The API must enforce authorization.
    let claims: { realm_access?: { roles?: string[] }; resource_access?: Record<string, { roles?: string[] }> }
    try {
      const payload = auth.user.access_token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
      claims = JSON.parse(atob(payload))
    } catch {
      return
    }
    const assigned = [...(claims.realm_access?.roles ?? []), ...(claims.resource_access?.[keycloakConfig().resource]?.roles ?? [])]
    const mappings: [Role, string][] = [
      ['admin', import.meta.env.VITE_ROLE_ADMIN || 'ADMIN'],
      ['professor', import.meta.env.VITE_ROLE_PROFESSOR || 'PROFESSOR'],
      ['aluno', import.meta.env.VITE_ROLE_ALUNO || 'STUDENT'],
    ]
    const role = mappings.find(([, name]) => assigned.includes(name))?.[0]
    if (!role) return
    return { role, subject: auth.user.profile.sub, name: auth.user.profile.name || auth.user.profile.preferred_username || 'Usuário' }
  }, [auth.user])

  // Keep token refresh and HTTP errors centralized, as in the starter routes.
  useEffect(() => {
    setAuthToken(auth.user?.access_token ?? null)
    setRefreshTokenFn(async () => {
      const user = await auth.signinSilent()
      setAuthToken(user?.access_token ?? null)
      return user?.access_token ?? null
    })
    const clearSession = () => { setAuthToken(null); void auth.removeUser() }
    setLogoutFn(clearSession)
    auth.events.addAccessTokenExpired(clearSession)
    auth.events.addSilentRenewError(clearSession)
    setReady(true)
    return () => {
      setAuthToken(null)
      setRefreshTokenFn(null)
      setLogoutFn(null)
      auth.events.removeAccessTokenExpired(clearSession)
      auth.events.removeSilentRenewError(clearSession)
    }
  }, [auth.user, auth.events, auth.signinSilent, auth.removeUser])

  if (auth.isLoading || auth.activeNavigator || !ready) return <main><p role="status">Carregando sua sessão…</p></main>
  if (!auth.isAuthenticated) return <main className="login"><section className="card">
    <span className="eyebrow">FREQUÊNCIA UFPE</span><h1>Bem-vindo</h1>
    <p className="muted">Acesse com sua conta institucional.</p>
    {auth.error && <p className="notice error" role="alert">Não foi possível entrar. Tente novamente.</p>}
    <button className="primary" onClick={() => void auth.signinRedirect()}>Entrar com Keycloak</button>
  </section></main>
  if (!session) return <main><h1>Acesso indisponível</h1><p>Sua conta precisa de um perfil autorizado para este sistema.</p>
    <button className="secondary" onClick={() => void auth.signoutRedirect()}>Sair</button></main>
  return <SessionContext.Provider value={{ session, logout: () => auth.signoutRedirect() }}>{children}</SessionContext.Provider>
}

function LiveProvider({ children }: { children: ReactNode }) {
  const props = useMemo(authProviderProps, [])
  return <AuthProvider {...props}><OidcSession>{children}</OidcSession></AuthProvider>
}

export function AppProvider({ children }: { children: ReactNode }) {
  return <ErrorBoundary label="app">
    {demo ? <DemoProvider>{children}</DemoProvider> : <LiveProvider>{children}</LiveProvider>}
  </ErrorBoundary>
}
