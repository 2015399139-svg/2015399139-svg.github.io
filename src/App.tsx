import { motion, useReducedMotion } from 'framer-motion'
import { useLayoutEffect } from 'react'
import { Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom'
import { ClickSpark } from './components/bits/ClickSpark'
import { Nav } from './components/Nav'
import { HomePage } from './pages/HomePage'
import { studioPieceBySlug } from './data/studio'
import { MaineCoonBrandPage } from './pages/MaineCoonBrandPage'
import { StudioPiecePage } from './pages/StudioPiecePage'

/** 路由切换时回到顶部（带 #hash 的首页锚点除外） */
function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useLayoutEffect(() => {
    if (pathname === '/' && hash) return
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname, hash])

  return null
}

function StudioRoute() {
  const { slug } = useParams()
  const piece = studioPieceBySlug(slug)
  if (!piece) return <Navigate to="/" replace />
  return <StudioPiecePage piece={piece} />
}

/** 首页底图：与橙色首屏同一暖色轴 */
function AmbientBackground() {
  const reduce = useReducedMotion()
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#1a0c08_0%,#140a07_42%,#120906_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_95%_50%_at_46%_-10%,rgba(253,38,1,0.16),transparent_56%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_52%_42%_at_100%_26%,rgba(243,126,28,0.12),transparent_54%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_46%_38%_at_0%_70%,rgba(253,38,1,0.08),transparent_52%)]" />
      <div className="absolute inset-y-0 left-0 w-[36%] max-w-lg bg-[radial-gradient(ellipse_85%_65%_at_0%_48%,rgba(253,38,1,0.07),transparent_72%)]" />
      <div className="absolute inset-y-0 right-0 w-[36%] max-w-lg bg-[radial-gradient(ellipse_85%_65%_at_100%_52%,rgba(243,126,28,0.07),transparent_72%)]" />
      {!reduce && (
        <>
          <motion.div
            className="absolute -left-28 top-[22%] h-72 w-72 rounded-full bg-[#fd2601]/[0.16] blur-[110px]"
            animate={{ x: [0, 28, 0], y: [0, 20, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute -right-24 top-[48%] h-[26rem] w-[26rem] rounded-full bg-[#f37e1c]/[0.14] blur-[120px]"
            animate={{ x: [0, -36, 0], y: [0, -28, 0], scale: [1, 1.06, 1] }}
            transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-0 left-[28%] h-72 w-72 rounded-full bg-[#fd2601]/[0.1] blur-[100px]"
            animate={{ y: [0, -20, 0], opacity: [0.55, 0.85, 0.55] }}
            transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          />
        </>
      )}
      <div
        className="absolute inset-0 opacity-[0.28]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.1'/%3E%3C/svg%3E")`,
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(10,4,2,0.45)_100%)]" />
    </div>
  )
}

function PortfolioShell() {
  return (
    <ClickSpark>
      <AmbientBackground />
      <Nav />
      <HomePage />
    </ClickSpark>
  )
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<PortfolioShell />} />
        <Route path="/work/maine-coon-brand" element={<MaineCoonBrandPage />} />
        <Route path="/work/:slug" element={<StudioRoute />} />
      </Routes>
    </>
  )
}

export default App
