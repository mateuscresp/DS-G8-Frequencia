import { useEffect, useState } from 'react'
import { timeLeft, type Call } from '../../../attendance'
import DesignIcon from '../../../components/ui/DesignIcon'
export default function TokenValidity({ call }: { call?: Call }) {
 const [now, setNow] = useState(Date.now)
 useEffect(() => { setNow(Date.now()); if (!call || call.closedAt) return; const timer = window.setInterval(() => setNow(Date.now()), 1000); return () => window.clearInterval(timer) }, [call])
 return <section className="card token-validity"><DesignIcon name="timer" /><div><h2>Token válido por</h2><strong>{call ? call.closedAt ? 'Encerrado' : timeLeft(call.expiresAt, now) : '—'}</strong><p>{call ? 'Após esse tempo será necessário solicitar um novo token.' : 'Digite o código da aula para consultar o tempo restante.'}</p></div></section>
}
