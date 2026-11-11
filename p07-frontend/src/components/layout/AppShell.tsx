import type { ReactNode } from 'react'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
export default function AppShell({ children, search, onSearch }: { children: ReactNode; search: string; onSearch: (value: string) => void }) {
 return <div className="shell"><a className="skip-link" href="#inicio">Ir para o conteúdo</a><Sidebar /><div className="workspace"><TopBar search={search} onSearch={onSearch} /><main id="inicio">{children}</main></div></div>
}
