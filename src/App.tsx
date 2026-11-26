import { lazy, Suspense, useLayoutEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { ClickSpark } from './components/bits/ClickSpark'
import { PointerGlow } from './components/effects/PointerGlow'
import { Nav } from './components/Nav'
import { HomePage } from './pages/HomePage'

const MaineCoonBrandPage = lazy(() =>
  import('./pages/MaineCoonBrandPage').then((m) => ({ default: m.MaineCoonBrandPage })),
)
const StudioRoute = lazy(() => import('./pages/StudioRoute').then((m) => ({ default: m.StudioRoute })))

function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useLayoutEffect(() => {
    if (pathname === '/' && hash) return
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname, hash])

  return null
}

function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#1a0c08_0%,#140a07_42%,#120906_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_95%_50%_at_46%_-10%,rgba(253,38,1,0.16),transparent_56%)]" />
      <div className="absolute inset-y-0 right-0 w-[36%] max-w-lg bg-[radial-gradient(ellipse_85%_65%_at_100%_52%,rgba(243,126,28,0.07),transparent_72%)]" />
    </div>
  )
}

function PortfolioShell() {
  return (
    <ClickSpark>
      <AmbientBackground />
      <PointerGlow />
      <Nav />
      <HomePage />
    </ClickSpark>
  )
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<PortfolioShell />} />
          <Route path="/work/maine-coon-brand" element={<MaineCoonBrandPage />} />
          <Route path="/work/:slug" element={<StudioRoute />} />
        </Routes>
      </Suspense>
    </>
  )
}

export default App
