import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { roles, roleLabels, useSession, type Role } from '../../app/session'
import { demo } from '../../integration'
import DesignIcon from '../ui/DesignIcon'
import Feedback, { type Notice } from '../ui/Feedback'
export default function TopBar({ search, onSearch }: { search: string; onSearch: (value: string) => void }) {
 const { session, switchRole, logout } = useSession()
 const navigate = useNavigate()
 const [notice, setNotice] = useState<Notice>()
 function changeRole(role: Role) { switchRole?.(role); navigate('/' + role) }
 return <header className="top">
  {demo ? <div className="role-switch" role="group" aria-label="Perfil da demonstração">
   {roles.map(role => <button key={role} type="button" aria-pressed={session.role === role} onClick={() => changeRole(role)}>{roleLabels[role]}</button>)}
  </div> : <button className="secondary" onClick={() => void logout?.().catch(() => setNotice({ kind: 'error', text: 'Não foi possível sair. Tente novamente.' }))}>Sair</button>}
  <label className="search"><DesignIcon name="search" /><input type="search" aria-label="Buscar disciplinas, professor ou turma" placeholder="Buscar disciplinas, professor ou turma..." value={search} onChange={e => onSearch(e.target.value)} /></label>
  <details className="notifications"><summary aria-label="Avisos"><DesignIcon name="bell" /></summary><div className="popover">{demo ? 'Ambiente de demonstração. Os registros ficam salvos neste navegador.' : 'Acompanhe suas turmas pelo portal.'}</div></details>
  <span className="top-avatar" title={session.name}><DesignIcon name="account" /></span>
  <Feedback notice={notice} />
 </header>
}
