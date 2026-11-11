import DesignIcon from '../ui/DesignIcon'
export default function QuickAccess() {
 return <section className="card quick-access"><h2>Acesso Rápido</h2>
  <a href="#turmas"><span className="quick-icon"><DesignIcon name="quickGroups" /></span><span><b>Minhas Turmas</b><small>Visualize suas disciplinas</small></span><DesignIcon name="quickArrow" /></a>
  <a href="#chamada"><span className="quick-icon"><DesignIcon name="quickCheck" /></span><span><b>Registrar Presença</b><small>Digite o código da aula</small></span><DesignIcon name="quickArrow" /></a>
  <a href="#frequencia"><span className="quick-icon"><DesignIcon name="history" /></span><span><b>Minha Frequência</b><small>Acompanhe suas presenças</small></span><DesignIcon name="quickArrow" /></a>
 </section>
}
