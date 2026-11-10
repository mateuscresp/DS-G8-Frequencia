import { Component, type ErrorInfo, type ReactNode } from 'react';
import { RefreshCw } from 'lucide-react';


interface ErrorBoundaryProps {
  children: ReactNode;
  /**
   * UI alternativa quando algo abaixo quebra. Recebe o erro e uma função para
   * tentar re-renderizar. Se omitida, usa `DefaultErrorFallback`.
   */
  fallback?: (props: { error: Error; reset: () => void }) => ReactNode;
  /** Rótulo da área protegida, usado só no `console.error` para diagnóstico. */
  label?: string;
  /**
   * Muda de valor → o boundary se recupera sozinho. Passe algo que identifique
   * "a tela mudou", tipicamente a rota (`location.pathname`), para um erro numa
   * página não deixar a aplicação inteira travada ao navegar para outra.
   */
  resetKey?: unknown;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/**
 * Error boundary padrão da aplicação. Envolve uma subárvore de componentes e,
 * quando qualquer um deles lança durante a renderização, mostra uma tela de
 * erro no lugar de uma página em branco.
 *
 * É um class component porque o React só oferece captura de erro de render via
 * `componentDidCatch` / `getDerivedStateFromError` — não há hook equivalente.
 * Não pega erros de eventos (onClick etc.) nem de código assíncrono; para
 * chamadas de API, trate o `error` do `useAsync` na própria página.
 *
 * Uso típico (ver `src/app/provider.tsx` e `src/routes.tsx`):
 *
 *   <ErrorBoundary label="app">
 *     <App />
 *   </ErrorBoundary>
 *
 *   <ErrorBoundary label="rota" resetKey={location.pathname}>
 *     <Outlet />
 *   </ErrorBoundary>
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (this.state.error && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ error: null });
    }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(
      `[ErrorBoundary${this.props.label ? `: ${this.props.label}` : ''}]`,
      error,
      info.componentStack,
    );
  }

  reset = () => this.setState({ error: null });

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    const fallback = this.props.fallback ?? DefaultErrorFallback;
    return fallback({ error, reset: this.reset });
  }
}

/** Tela de erro padrão: mensagem + botão de "tentar de novo". */
export function DefaultErrorFallback({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="login card">
      <h1>Algo deu errado nesta tela</h1>
      <p className="muted">
        Um erro inesperado interrompeu a renderização. Você pode tentar de novo;
        se persistir, recarregue a página.
      </p>
      <pre className="notice error">
        {error.message}
      </pre>
      <button
        onClick={reset}
        className="primary"
      >
        <RefreshCw size={18} />
        Tentar novamente
      </button>
    </div>
  );
}
