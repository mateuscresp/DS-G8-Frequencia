import type { ReactNode } from 'react'
export default function CardTitle({ icon, children }: { icon: ReactNode; children: ReactNode }) {
 return <h2 className="card-title"><span className="icon-box">{icon}</span>{children}</h2>
}
