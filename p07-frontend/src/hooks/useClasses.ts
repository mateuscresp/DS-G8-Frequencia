import { useEffect, useState } from 'react'
import { demoClasses, demoStudent, type Class } from '../attendance'
import { demo, loadClasses } from '../integration'
import { useSession } from '../app/session'
export function useClasses() {
  const { session } = useSession()
  const [remote, setRemote] = useState<Class[]>([])
  const [loading, setLoading] = useState(!demo)
  const [error, setError] = useState('')
  const [version, setVersion] = useState(0)
  useEffect(() => {
    if (demo) return
    const controller = new AbortController()
    setLoading(true); setError(''); setRemote([])
    loadClasses(controller.signal)
      .then(value => { if (!controller.signal.aborted) setRemote(value) })
      .catch(error => { if (!controller.signal.aborted) setError(error.message) })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [session.subject, session.role, version])
  const classes = demo ? session.role === 'aluno' ? demoClasses.filter(group => group.students?.some(student => student.id === demoStudent.id)) : demoClasses : remote
  return { classes, loading, error, reload: () => setVersion(value => value + 1) }
}
