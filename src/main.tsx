import { Component, type ErrorInfo, type ReactNode, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

const rootEl = document.getElementById('root')
if (!rootEl) {
  throw new Error('找不到 #root，请检查 index.html')
}

// 打开/刷新时始终从顶部展示，避免浏览器恢复上次滚动位置
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual'
}
if (!window.location.hash) {
  window.scrollTo(0, 0)
}

function routerBasename(): string | undefined {
  const b = import.meta.env.BASE_URL
  if (b === '/' || b === './' || b === '' || b === '.') return undefined
  return b.endsWith('/') ? b.slice(0, -1) : b
}

const isDev = import.meta.env.DEV

type EBProps = { children: ReactNode }
type EBState = { error: Error | null; info: ErrorInfo | null }

class ErrorBoundary extends Component<EBProps, EBState> {
  state: EBState = { error: null, info: null }

  static getDerivedStateFromError(error: Error): EBState {
    return { error, info: null }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[portfolio]', error, info)
    this.setState({ error, info })
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            minHeight: '100svh',
            padding: '2rem',
            fontFamily: 'system-ui, sans-serif',
            background: '#140a07',
            color: '#e2e8f0',
            lineHeight: 1.6,
          }}
        >
          <h1 style={{ fontSize: '1.25rem', margin: '0 0 1rem' }}>页面运行时出错</h1>
          <p style={{ margin: '0 0 1rem', color: '#94a3b8' }}>
            {isDev
              ? '请打开浏览器开发者工具（F12）查看 Console，并把下面错误信息发给我或自行排查。'
              : '请刷新页面或稍后重试。若问题反复出现，可稍后再访问。'}
          </p>
          {isDev ? (
            <>
              <pre
                style={{
                  overflow: 'auto',
                  padding: '1rem',
                  borderRadius: '8px',
                  background: '#1e110c',
                  color: '#fecaca',
                  fontSize: '13px',
                }}
              >
                {this.state.error.stack ?? this.state.error.message}
              </pre>
              {this.state.info?.componentStack ? (
                <pre
                  style={{
                    marginTop: '1rem',
                    overflow: 'auto',
                    padding: '1rem',
                    borderRadius: '8px',
                    background: '#1e110c',
                    color: '#cbd5e1',
                    fontSize: '12px',
                  }}
                >
                  {this.state.info.componentStack}
                </pre>
              ) : null}
            </>
          ) : null}
        </div>
      )
    }
    return this.props.children
  }
}

createRoot(rootEl).render(
  <StrictMode>
    <BrowserRouter basename={routerBasename()}>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </BrowserRouter>
  </StrictMode>,
)
