import { AppProvider } from './app/provider'
import RouteMap from './routes'

export default function App() {
  return <AppProvider><RouteMap /></AppProvider>
}
