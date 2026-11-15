import type { Call, Class } from '../../../attendance'
import DesignIcon from '../../../components/ui/DesignIcon'
import { attendanceSummary } from '../../attendance/summary'
type Props = { classes: Class[]; search?: string; title?: string; selected?: string; onSelect?: (id: string) => void; loading?: boolean; error?: string; onRetry?: () => void; calls?: Call[]; studentId?: string; onViewHistory?: (id: string) => void }
export default function ClassList({ classes, search = '', title = 'Minhas Turmas', selected, onSelect, loading, error, onRetry, calls = [], studentId, onViewHistory }: Props) {
 const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
 const visible = classes.filter(group => normalize([group.name, group.code, group.teacher, group.semester].join(' ')).includes(normalize(search.trim())))
 return <section className={studentId ? 'student-classes' : 'card'} id="turmas">
  <h2 className={studentId ? 'section-title' : 'card-title'}>{title}</h2>
  <div className={studentId ? 'class-panel' : ''}>
   {error && <p className="notice error" role="alert">{error}</p>}{error && onRetry && <button className="secondary" onClick={onRetry}>Tentar novamente</button>}
   {loading ? <p role="status">Carregando turmas…</p> : visible.length ? <ul className="groups">{visible.map(group => {
    const { percentage } = attendanceSummary(calls.filter(call => call.classId === group.id), studentId ?? '')
    return <li key={group.id}><button type="button" className={studentId ? 'student-class' : ''} aria-pressed={onSelect ? selected === group.id : undefined} onClick={() => studentId ? onViewHistory?.(group.id) : onSelect?.(group.id)}>
     {studentId && <span className="class-icon"><DesignIcon name="classroom" /></span>}
     <span className="class-name"><b>{group.name}</b><small>{group.code} · {group.semester}{studentId && group.teacher ? ' · ' + group.teacher : ''}</small></span>
     {studentId && <span className="class-progress"><b>{percentage === null ? '—' : percentage + '%'}</b><small>{percentage === null ? 'Sem chamadas encerradas' : 'Frequência nas aulas'}</small><progress max="100" value={percentage ?? 0} aria-label={'Frequência em ' + group.name} /></span>}
     <DesignIcon name="chevron" />
    </button></li>
   })}</ul> : <p className="empty">{search ? 'Nenhuma turma encontrada para esta busca.' : 'Nenhuma turma disponível.'}</p>}
  </div>
 </section>
}
