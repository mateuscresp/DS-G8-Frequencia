import type { FormEvent } from 'react'
import DesignIcon from '../../../components/ui/DesignIcon'
import Feedback, { type Notice } from '../../../components/ui/Feedback'
type Props = { code: string; onCode: (value: string) => void; onSubmit: (event: FormEvent) => void; busy: boolean; notice?: Notice; onPaste: () => void }
export default function StudentCheckIn({ code, onCode, onSubmit, busy, notice, onPaste }: Props) {
 return <section className="card student-checkin" id="chamada">
  <span className="checkin-icon"><DesignIcon name="scanner" /></span>
  <h2>Inserir Token de Presença</h2>
  <p className="muted">O professor gerou um token para você, insira o código abaixo<br className="desktop-break" /> para registrar sua presença na aula.</p>
  <form className="checkin-form" onSubmit={onSubmit}>
   <label className="sr-only" htmlFor="presence-code">Código de presença</label>
   <input id="presence-code" className="code" value={code} autoComplete="off" spellCheck={false} autoCapitalize="characters" maxLength={6} required pattern="[A-Z0-9]{6}" placeholder="Digite o token (ex.: 8F3A2C)" onPaste={e => { e.preventDefault(); onPaste() }} onDrop={e => e.preventDefault()} onChange={e => onCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))} />
   <button className="primary" aria-label="Registrar presença" disabled={busy || code.length !== 6}><DesignIcon name="send" />ENVIAR</button>
  </form>
  <Feedback notice={notice} />
 </section>
}
