import { lazy, Suspense, useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Contact } from '../components/Contact'
import { Hero } from '../components/Hero'
import { TracingBeam } from '../components/effects/TracingBeam'

const StickyReveal = lazy(() =>
  import('../components/effects/StickyReveal').then((m) => ({ default: m.StickyReveal })),
)
const Projects = lazy(() => import('../components/Projects').then((m) => ({ default: m.Projects })))

export function HomePage() {
  const { hash } = useLocation()

  useLayoutEffect(() => {
    if (hash) {
      const id = hash.replace('#', '')
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      })
      return
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [hash])

  return (
    <main className="home-canvas relative isolate min-h-svh overflow-x-clip">
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(180deg,rgba(253,38,1,0.06)_0%,transparent_28%,transparent_62%,rgba(243,126,28,0.04)_100%)]"
        aria-hidden
      />

      <div className="relative z-[2]">
        <Hero />
        <div
          className="pointer-events-none h-10 bg-gradient-to-b from-[#f37e1c] via-[#5c180c] to-[#140a07] sm:h-16 md:h-20"
          aria-hidden
        />
        <TracingBeam>
          <Suspense fallback={null}>
            <StickyReveal />
            <Projects />
          </Suspense>
          <Contact />
        </TracingBeam>
      </div>
    </main>
  )
}
