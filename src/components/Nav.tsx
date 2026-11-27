import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { profile, publicAsset } from '../data/profile'

const resumeHref = publicAsset('resume.pdf')

const links = [
  { id: 'work', label: '作品' },
  { id: 'motion', label: '擅长工具' },
  { id: 'contact', label: '联系' },
]

const heroLinks = [
  { id: 'work', label: 'Projects' },
  { id: 'motion', label: 'Tools' },
  { id: 'contact', label: 'Contact' },
]

const linkClass =
  'rounded-full px-4 py-2 text-[13px] font-medium tracking-wide text-[#d7c2b4] transition-[color,background-color] duration-200 hover:bg-white/[0.06] hover:text-white [-webkit-tap-highlight-color:transparent]'

export function Nav() {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [pastHero, setPastHero] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  const closeMenu = useCallback(() => setMenuOpen(false), [])

  useMotionValueEvent(scrollY, 'change', (y) => {
    setScrolled(y > 56)
    setPastHero(y > window.innerHeight * 0.72)
  })

  useEffect(() => {
    if (!isHome) return
    setPastHero(window.scrollY > window.innerHeight * 0.72)
  }, [isHome, location.hash])

  useEffect(() => {
    closeMenu()
  }, [location.pathname, location.hash, closeMenu])

  useEffect(() => {
    if (!menuOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [menuOpen])

  if (isHome) {
    return (
      <motion.header
        className={`hero-nav fixed inset-x-0 top-0 z-50 px-4 pt-[max(1.1rem,env(safe-area-inset-top))] transition-[background,box-shadow,padding] duration-300 sm:px-6 lg:px-10 ${
          pastHero
            ? 'bg-[#140a07]/72 pb-3 shadow-[0_18px_40px_-28px_rgba(80,18,0,0.8)] backdrop-blur-xl'
            : ''
        }`}
        initial={{ y: -18, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <nav aria-label="主导航" className="flex items-center justify-between gap-2 text-white sm:gap-4">
          <Link
            to="/"
            className="inline-flex min-w-0 shrink items-center gap-2 truncate font-sans text-[10px] font-medium uppercase tracking-[0.28em] sm:text-[11px] sm:tracking-[0.38em]"
            onClick={closeMenu}
          >
            <img src={publicAsset('favicon.svg')} alt="" width={16} height={16} className="size-4 rounded-[4px]" />
            Zhuchengbin
          </Link>

          <ul className="hidden items-center gap-8 lg:flex">
            {heroLinks.map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  className="text-[11px] font-medium uppercase tracking-[0.28em] text-white/90 transition-opacity hover:text-white"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
            <a
              href="#contact"
              className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-white/85 px-2.5 py-2 text-[10px] font-medium uppercase tracking-[0.14em] transition-colors hover:bg-white hover:text-[#fd2601] sm:gap-2 sm:px-4 sm:text-xs sm:tracking-[0.2em]"
              onClick={closeMenu}
            >
              <span className="max-[340px]:sr-only">Hire me</span>
              <svg
                viewBox="0 0 24 24"
                aria-hidden
                className="size-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 17 17 7" />
                <path d="M9 7h8v8" />
              </svg>
            </a>
            <button
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-full border border-white/80 text-white [-webkit-tap-highlight-color:transparent] lg:hidden"
              aria-expanded={menuOpen}
              aria-controls="home-nav-sheet"
              aria-label={menuOpen ? '关闭导航' : '打开导航'}
              onClick={() => setMenuOpen((o) => !o)}
            >
              <span className="flex w-[1.05rem] flex-col gap-1.5" aria-hidden>
                <span
                  className={`h-0.5 w-full origin-center rounded-full bg-current transition-transform ${menuOpen ? 'translate-y-[6px] rotate-45' : ''}`}
                />
                <span className={`h-0.5 w-full rounded-full bg-current transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
                <span
                  className={`h-0.5 w-full origin-center rounded-full bg-current transition-transform ${menuOpen ? '-translate-y-[6px] -rotate-45' : ''}`}
                />
              </span>
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {menuOpen ? (
            <motion.ul
              id="home-nav-sheet"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="mt-3 space-y-1 rounded-2xl bg-white p-3 text-[#fd2601] shadow-2xl lg:hidden"
            >
              {links.map((l) => (
                <li key={l.id}>
                  <a
                    href={`#${l.id}`}
                    className="block rounded-xl px-4 py-3.5 text-base font-semibold tracking-wide [-webkit-tap-highlight-color:transparent]"
                    onClick={closeMenu}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={resumeHref}
                  download={profile.resumeFileName}
                  className="block rounded-xl px-4 py-3.5 text-base font-semibold tracking-wide [-webkit-tap-highlight-color:transparent]"
                  onClick={closeMenu}
                >
                  下载简历
                </a>
              </li>
            </motion.ul>
          ) : null}
        </AnimatePresence>
      </motion.header>
    )
  }

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="fixed left-0 right-0 top-0 z-50 px-4 pb-0 pt-[max(1.25rem,env(safe-area-inset-top))] md:px-8 md:pt-6"
    >
      <nav
        aria-label="主导航"
        className={`relative mx-auto flex max-w-[68rem] items-center justify-between gap-3 rounded-full border px-4 py-2.5 transition-[background,box-shadow,border-color] duration-300 sm:px-5 sm:py-3 md:px-7 ${
          scrolled
            ? 'border-white/[0.09] bg-[#140a07]/82 shadow-[0_20px_48px_-28px_rgba(80,18,0,0.72)] backdrop-blur-2xl'
            : 'border-white/[0.06] bg-[#140a07]/48 shadow-[0_8px_32px_-20px_rgba(60,16,0,0.5)] backdrop-blur-xl'
        }`}
      >
        <Link
          to="/"
          className="inline-flex min-w-0 shrink items-center gap-2 font-display text-[0.95rem] font-semibold tracking-[-0.02em] text-white [-webkit-tap-highlight-color:transparent]"
          onClick={closeMenu}
        >
          <img src={publicAsset('favicon.svg')} alt="" width={18} height={18} className="size-[18px] rounded-[5px]" />
          Portfolio
        </Link>

        <ul className="hidden items-center gap-0.5 md:flex md:gap-1">
          {links.map((l) => (
            <li key={l.id}>
              {isHome ? (
                <a href={`#${l.id}`} className={linkClass}>
                  {l.label}
                </a>
              ) : (
                <Link to={`/#${l.id}`} className={linkClass}>
                  {l.label}
                </Link>
              )}
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-white/14 text-white/90 transition-colors hover:bg-white/10 [-webkit-tap-highlight-color:transparent] md:hidden"
          aria-expanded={menuOpen}
          aria-controls="home-nav-sheet"
          aria-label={menuOpen ? '关闭导航' : '打开导航'}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span className="flex w-[1.125rem] flex-col gap-1.5" aria-hidden>
            <motion.span
              className="h-0.5 w-full origin-center rounded-full bg-current"
              animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            />
            <motion.span
              className="h-0.5 w-full rounded-full bg-current"
              animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
            />
            <motion.span
              className="h-0.5 w-full origin-center rounded-full bg-current"
              animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
            />
          </span>
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            id="home-nav-sheet"
            className="fixed inset-0 z-[45] px-4 pb-[env(safe-area-inset-bottom)] pt-[calc(max(5.75rem,env(safe-area-inset-top))+3.75rem)] md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              type="button"
              className="absolute inset-0 bg-black/60 backdrop-blur-sm [-webkit-tap-highlight-color:transparent]"
              aria-label="关闭菜单"
              onClick={closeMenu}
            />
            <motion.ul
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="relative mx-auto mt-2 max-w-[68rem] space-y-1 rounded-2xl border border-white/12 bg-[#140a07]/94 p-3 shadow-2xl backdrop-blur-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {links.map((l) => (
                <li key={l.id}>
                  {isHome ? (
                    <a
                      href={`#${l.id}`}
                      className="block rounded-xl px-5 py-3.5 text-base font-semibold text-[#fff6ef] transition-colors active:bg-white/[0.08] [-webkit-tap-highlight-color:transparent]"
                      onClick={closeMenu}
                    >
                      {l.label}
                    </a>
                  ) : (
                    <Link
                      to={`/#${l.id}`}
                      className="block rounded-xl px-5 py-3.5 text-base font-semibold text-[#fff6ef] transition-colors active:bg-white/[0.08] [-webkit-tap-highlight-color:transparent]"
                      onClick={closeMenu}
                    >
                      {l.label}
                    </Link>
                  )}
                </li>
              ))}
            </motion.ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  )
}
