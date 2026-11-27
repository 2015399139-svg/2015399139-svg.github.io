import { motion, useReducedMotion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { studioPieces, studioProjects, type StudioPiece } from '../../data/studio'
import type { PortfolioProject } from '../../data/profile'
import { WarmParticles } from './WarmParticles'

const pieces = studioPieces
const projects = studioProjects
const count = pieces.length
const step = 360 / count

type Open = (project: PortfolioProject) => void

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function face(item: StudioPiece) {
  if (item.slug === 'yuan-tu') return item.coverSet?.[2] ?? item.cover
  if (item.slug === 'maine-coon-brand') return item.coverSet?.[0] ?? item.cover
  return item.cover
}

function wrap(i: number) {
  return ((i % count) + count) % count
}

export function WorkStage({ onOpen }: { onOpen: Open }) {
  const reduce = useReducedMotion()
  const [active, setActive] = useState(0)
  const piece = pieces[active]
  const stageRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef(0)
  const drag = useRef({ on: false, x: 0, acc: 0, moved: false })
  activeRef.current = active

  const go = useCallback((next: number) => {
    setActive(wrap(next))
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const root = stageRef.current
      if (!root) return
      const inView = root.getBoundingClientRect().top < window.innerHeight && root.getBoundingClientRect().bottom > 0
      if (!inView) return
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        go(active + 1)
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        go(active - 1)
      } else if (e.key === 'Enter') {
        onOpen(projects[active])
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, go, onOpen])

  useEffect(() => {
    if (reduce) return
    let last = 0
    const onWheel = (e: WheelEvent) => {
      const root = stageRef.current
      if (!root) return
      const box = root.getBoundingClientRect()
      if (e.clientY < box.top || e.clientY > box.bottom) return
      if (Math.abs(e.deltaX) < 6 && Math.abs(e.deltaY) < 14) return
      e.preventDefault()
      const now = performance.now()
      if (now - last < 480) return
      last = now
      const dir = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
      go(activeRef.current + (dir > 0 ? 1 : -1))
    }
    window.addEventListener('wheel', onWheel, { passive: false })
    return () => window.removeEventListener('wheel', onWheel)
  }, [go, reduce])

  function onDown(e: ReactPointerEvent<HTMLElement>) {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    drag.current = { on: true, x: e.clientX, acc: 0, moved: false }
  }

  function onMove(e: ReactPointerEvent<HTMLElement>) {
    if (!drag.current.on) return
    drag.current.acc += e.clientX - drag.current.x
    drag.current.x = e.clientX
    if (Math.abs(drag.current.acc) > 56) {
      drag.current.moved = true
      go(activeRef.current + (drag.current.acc < 0 ? 1 : -1))
      drag.current.acc = 0
    }
  }

  function onUp() {
    drag.current.on = false
  }

  return (
    <div id="work-stage" className="relative overflow-x-clip bg-[#140a07] pb-16 pt-6 md:pb-24 md:pt-10">
      <div className="mx-auto max-w-[72rem] px-5 md:px-10 lg:px-12">
        <div className="mb-2 flex items-end justify-between gap-4 md:mb-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-white/55">// Work</p>
            <h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.03em] text-[#fff6ef] md:text-3xl">
              精选作品
            </h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-[#d7c2b4]">
              滚轮、拖动或方向键转动。中间那件点开进专题。
            </p>
          </div>
          <p className="hidden font-display text-[11px] tracking-[0.2em] text-[#ffb089] sm:block">
            {pad(active + 1)}
            <span className="text-white/35"> / {pad(count)}</span>
          </p>
        </div>
      </div>

      <div
        ref={stageRef}
        className="pointer-events-none relative mx-auto mt-2 h-[26rem] max-w-[76rem] overflow-hidden touch-pan-y select-none sm:h-[30rem] md:h-[36rem]"
      >
        {!reduce ? <WarmParticles mode="stage" /> : null}
        <p
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[42%] z-0 -translate-x-1/2 -translate-y-1/2 font-anton text-[28vw] leading-none text-white/[0.045] md:text-[9.5rem]"
        >
          {pad(active + 1)}
        </p>
        <div className="work-orbit pointer-events-none absolute inset-0">
          <div className="work-orbit-scene">
            {!reduce ? <div className="work-orbit-floor" aria-hidden /> : null}
            <div
              className="work-orbit-ring"
              style={{ transform: `rotateY(${-active * step}deg)` }}
            >
              {pieces.map((item, i) => {
                const on = i === active
                const src = face(item)
                return (
                  <button
                    key={item.slug}
                    type="button"
                    aria-current={on ? 'true' : undefined}
                    aria-label={`${item.title}，查看专题`}
                    className={`work-orbit-item pointer-events-auto ${on ? 'work-orbit-item-on' : ''}`}
                    style={{ transform: `rotateY(${i * step}deg) translateZ(var(--orbit-r))` }}
                    onPointerDown={onDown}
                    onPointerMove={onMove}
                    onPointerUp={onUp}
                    onPointerCancel={onUp}
                    onClick={() => {
                      if (drag.current.moved) return
                      if (on) onOpen(projects[i])
                      else go(i)
                    }}
                  >
                    <span className="work-orbit-card">
                      <img src={src} alt="" draggable={false} loading="lazy" decoding="async" />
                      <span className="work-orbit-shine" aria-hidden />
                      <span className="work-orbit-rim" aria-hidden />
                      <span className="work-orbit-meta">
                        <span>
                          {pad(i + 1)} · {item.discipline}
                        </span>
                        <strong>{item.title}</strong>
                      </span>
                    </span>
                    <span className="work-orbit-reflect" aria-hidden>
                      <img src={src} alt="" draggable={false} />
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-4 max-w-[40rem] px-5 text-center md:mt-6">
        <motion.div
          key={piece.slug}
          initial={reduce ? false : { opacity: 0, y: 16, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.26em] text-[#ffb089]">{piece.discipline}</p>
          <p className="mt-2 font-display text-xl font-semibold tracking-[-0.03em] text-[#fff6ef] md:text-2xl">
            {piece.title}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[#d7c2b4]">{piece.desc}</p>
        </motion.div>
        <div className="mt-5 flex items-center justify-center gap-2">
          {pieces.map((item, i) => (
            <button
              key={item.slug}
              type="button"
              aria-label={item.title}
              onClick={() => go(i)}
              className={`h-1.5 rounded-full transition-[width,background-color] ${
                i === active ? 'w-7 bg-[#fd2601]' : 'w-2 bg-white/25 hover:bg-white/45'
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => onOpen(projects[active])}
          className="mt-5 text-sm font-medium tracking-wide text-[#ffb089] outline-offset-4 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ffb089]"
        >
          打开专题 →
        </button>
      </div>
    </div>
  )
}
