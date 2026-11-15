import type { Class } from '../../../attendance'
import DesignIcon from '../../../components/ui/DesignIcon'
export default function NextClasses({ classes }: { classes: Class[] }) {
 const next = classes.filter(group => group.next)
 return <section className="card next-classes" id="agenda"><h2><DesignIcon name="book" />Próximas Aulas</h2>
  {next.length ? <div className="next-list">{next.map(group => <div key={group.id}><b>{group.name}</b><p>{group.next?.day}<br />{group.next?.time}<br />{group.next?.room}</p></div>)}</div> : <p className="muted">Nenhuma aula disponível.</p>}
 </section>
}
