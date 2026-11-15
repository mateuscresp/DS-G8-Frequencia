import { useEffect, useRef } from 'react'
import { Clock3, X } from 'lucide-react'
import { timeLeft, type Call } from '../../../attendance'
export default function TokenProjection({ call, name, now, onClose }: { call: Call; name?: string; now: number; onClose: () => void }) {
 const dialog = useRef<HTMLDialogElement>(null)
 const valid = call.expiresAt > now
 useEffect(() => { const element = dialog.current; element?.showModal(); return () => element?.close() }, [])
 return <dialog ref={dialog} id="projection" aria-labelledby="projection-title" onCancel={onClose}>
  <button className="close" aria-label="Fechar projeção" onClick={onClose}><X /></button>
  <div className="projection-content"><span className="eyebrow">FREQUÊNCIA UFPE</span><h2 id="projection-title">{name}</h2>
   <p>{valid ? 'Digite o código para registrar sua presença' : 'O código de presença expirou'}</p>
   {valid && <strong>{call.code}</strong>}<div className="countdown"><Clock3 size={24} />{timeLeft(call.expiresAt, now)}</div>
  </div>
 </dialog>
}
