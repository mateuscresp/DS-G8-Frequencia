import { useState } from 'react'
import { useSession } from '../app/session'
import AppShell from '../components/layout/AppShell'
import PageIntro from '../components/layout/PageIntro'
import StudentDashboard from './StudentDashboard'
import TeacherDashboard from './TeacherDashboard'
export default function Dashboard() {
 const { session } = useSession()
 const [search, setSearch] = useState('')
 return <AppShell search={search} onSearch={setSearch}><PageIntro />{session.role === 'aluno' ? <StudentDashboard search={search} /> : <TeacherDashboard search={search} />}</AppShell>
}
