import { useSession } from '../../app/session'
import DesignIcon from '../ui/DesignIcon'
export default function Sidebar() {
 const { session: { name, role } } = useSession()
 const student = role === 'aluno'
 return <aside className="sidebar">
  <a className="brand" href="#inicio"><DesignIcon name="logo" /><span>Frequência UFPE<small>CONTROLE DE FREQUÊNCIA</small></span></a>
  <nav aria-label="Navegação principal">
   <a href="#inicio"><span className="nav-icon"><DesignIcon name="home" /></span>Início</a>
   <a href="#turmas"><span className="nav-icon"><DesignIcon name="groups" /></span>{role === 'admin' ? 'Todas as turmas' : 'Minhas turmas'}</a>
   <a href="#chamada"><span className="nav-icon"><DesignIcon name="check" /></span>{student ? 'Registrar presença' : 'Chamada'}</a>
   {student && <a href="#frequencia"><span className="nav-icon"><DesignIcon name="history" /></span>Minha frequência</a>}
  </nav>
  <div className="profile"><DesignIcon name="profile" /><span>{name}<small>{student ? 'CONTA DISCENTE' : role === 'admin' ? 'ADMINISTRAÇÃO' : 'CONTA DOCENTE'}</small></span></div>
 </aside>
}
