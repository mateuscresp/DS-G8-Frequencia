import { BrowserRouter, Link, Navigate, Route, Routes, useParams } from 'react-router-dom'
import { isRole, useSession } from './app/session'
import Dashboard from './pages/Dashboard'
import { ErrorBoundary } from './components/ErrorBoundary'

function ProfilePage() {
  const { profile } = useParams()
  const { session } = useSession()
  if (!isRole(profile ?? null)) return <main><h1>Página não encontrada</h1><Link to={'/' + session.role}>Voltar ao início</Link></main>
  if (profile !== session.role) return <main><h1>Acesso indisponível</h1><Link to={'/' + session.role}>Voltar ao meu perfil</Link></main>
  return <ErrorBoundary resetKey={profile}><Dashboard key={profile} /></ErrorBoundary>
}

function Home() {
  const { session } = useSession()
  return <Navigate to={'/' + session.role} replace />
}

export default function RouteMap() {
  return <BrowserRouter basename={import.meta.env.BASE_URL}>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/:profile" element={<ProfilePage />} />
      <Route path="*" element={<main><h1>Página não encontrada</h1><Link to="/">Voltar ao início</Link></main>} />
    </Routes>
  </BrowserRouter>
}
