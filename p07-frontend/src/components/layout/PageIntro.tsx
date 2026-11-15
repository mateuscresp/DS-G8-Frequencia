import { useSession } from '../../app/session'
export default function PageIntro() {
 const { session: { name, role } } = useSession()
 return <div className="intro"><h1>Olá, {name}!</h1><p>{role === 'aluno' ? 'Acompanhe sua frequência e mantenha seu desempenho em dia.' : role === 'admin' ? 'Acompanhe as turmas, alunos e chamadas do sistema.' : 'Gerencie as chamadas e acompanhe os alunos das suas turmas.'}</p></div>
}
