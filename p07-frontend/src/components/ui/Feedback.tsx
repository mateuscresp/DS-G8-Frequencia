import { CheckCircle2 } from 'lucide-react'
export type Notice = { kind: 'error' | 'success'; text: string }
export default function Feedback({ notice }: { notice?: Notice }) {
 return notice ? <p className={'notice ' + notice.kind} role={notice.kind === 'error' ? 'alert' : 'status'}>{notice.kind === 'success' && <CheckCircle2 size={18} />}{notice.text}</p> : null
}
