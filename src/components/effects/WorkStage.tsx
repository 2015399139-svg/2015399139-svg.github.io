import { useReducedMotion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { studioPieces, studioProjects, type StudioPiece } from '../../data/studio'
import type { PortfolioProject } from '../../data/profile'
import { BlendViewer } from '../bits/BlendViewer'
import { WorkPass } from './WorkPass'

const pieces = studioPieces
const projects = studioProjects
const phases = [0.2, 1.4, 2.7, 3.9]

type Open = (project: PortfolioProject) => void

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function face(item: StudioPiece) {
  if (item.slug === 'yuan-tu') return item.coverSet?.[2] ?? item.cover
  if (item.slug === 'maine-coon-brand') return item.coverSet?.[0] ?? item.cover
  return item.cover
}

export function WorkStage({ onOpen }: { onOpen: Open }) {
  const reduce = useReducedMotion()
  const [active, setActive] = useState(0)
  const piece = pieces[active]
  const nudges = useRef<Array<(omega: number) => void>>([])
  const rackRef = useRef<HTMLDivElement>(null)
  const spotRef = useRef<HTMLSpanElement>(null)
  const aim = useRef({ x: 50, y: 42 })
  const cur = useRef({ x: 50, y: 42 })

  const takeImpulse = useMemo(
    () =>
      pieces.map((_, i) => (handler: (omega: number) => void) => {
        nudges.current[i] = handler
      }),
    [],
  )

  const onImpulse = useCallback((from: number, omega: number) => {
    nudges.current[from - 1]?.(omega * 0.55)
    nudges.current[from + 1]?.(omega * 0.55)
  }, [])

  useEffect(() => {
    if (reduce) return
    let raf = 0
    const tick = () => {
      cur.current.x += (aim.current.x - cur.current.x) * 0.14
      cur.current.y += (aim.current.y - cur.current.y) * 0.14
      const el = spotRef.current
      if (el) {
        el.style.setProperty('--sx', `${cur.current.x}%`)
        el.style.setProperty('--sy', `${cur.current.y}%`)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reduce])

  function aimAt(e: ReactPointerEvent<HTMLDivElement>) {
    const box = rackRef.current?.getBoundingClientRect()
    if (!box || box.width < 8 || box.height < 8) return
    aim.current = {
      x: ((e.clientX - box.left) / box.width) * 100,
      y: ((e.clientY - box.top) / box.height) * 100,
    }
  }

  return (
    <div id="work-stage" className="relative overflow-x-clip bg-[#140a07] pb-16 pt-8 md:pb-24 md:pt-12">
      <div className="mx-auto max-w-[72rem] px-5 md:px-10 lg:px-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-white/55">// Work</p>
            <h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.03em] text-[#fff6ef] md:text-3xl">
              精选作品
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-[#d7c2b4]">
              四张工牌挂在杆上。光跟着鼠标走，拖一拖会晃，点开进专题。
            </p>
          </div>
          <p className="hidden font-display text-[11px] tracking-[0.2em] text-[#ffb089] sm:block">
            {pad(active + 1)}
            <span className="text-white/35"> / {pad(pieces.length)}</span>
          </p>
        </div>
      </div>

      <div
        ref={rackRef}
        className="work-rack mx-auto mt-6 max-w-[76rem] md:mt-8"
        onPointerMove={aimAt}
      >
        {reduce ? null : <span ref={spotRef} className="work-spot" aria-hidden />}
        <div className="work-rail" aria-hidden>
          <span className="work-rail-bar" />
          <span className="work-rail-cap work-rail-cap-l" />
          <span className="work-rail-cap work-rail-cap-r" />
        </div>
        <div className="work-rack-row">
          {pieces.map((item, i) => (
            <WorkPass
              key={item.slug}
              src={face(item)}
              title={item.title}
              kicker={`${pad(i + 1)} · ${item.discipline}`}
              index={i}
              phase={phases[i] ?? i}
              onHover={() => setActive(i)}
              onOpen={() => {
                setActive(i)
                onOpen(projects[i])
              }}
              onImpulse={onImpulse}
              takeImpulse={takeImpulse[i] ?? (() => {})}
            />
          ))}
        </div>
        {piece.modelSrc ? (
          <div className="relative z-10 mx-auto mt-4 aspect-[1024/354] w-full max-w-[72rem] px-2 md:mt-6">
            <BlendViewer src={piece.modelSrc} poster={piece.modelPoster} className="h-full w-full" />
          </div>
        ) : null}
      </div>

      <div className="mx-auto mt-4 max-w-[40rem] px-5 text-center md:mt-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.26em] text-[#ffb089]">{piece.discipline}</p>
        <p className="mt-2 font-display text-xl font-semibold tracking-[-0.03em] text-[#fff6ef] md:text-2xl">
          {piece.title}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-[#d7c2b4]">{piece.desc}</p>
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
