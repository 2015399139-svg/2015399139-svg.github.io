import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { studioPieces, studioProjects } from '../../data/studio'
import type { PortfolioProject } from '../../data/profile'

const pieces = studioPieces
const projects = studioProjects
const count = pieces.length

type Open = (project: PortfolioProject) => void

/** 滚动大部分时间停在一件上，临近下一件时再滑过去。 */
function holdShift(delta: number) {
  const sign = Math.sign(delta)
  const a = Math.abs(delta)
  if (a <= 0.34) return sign * a * 0.06
  if (a >= 0.66) return sign * (1 + (a - 1) * 0.04)
  const t = (a - 0.34) / 0.32
  const s = t * t * (3 - 2 * t)
  return sign * (0.02 + s * 0.98)
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

export function WorkStage({ onOpen }: { onOpen: Open }) {
  const reduce = useReducedMotion()
  const [narrow, setNarrow] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 767px)').matches : false,
  )

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const apply = () => setNarrow(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  if (reduce || narrow) return <WorkList onOpen={onOpen} />
  return <WorkScroll onOpen={onOpen} />
}

function WorkList({ onOpen }: { onOpen: Open }) {
  return (
    <div className="mx-auto flex max-w-[68rem] flex-col px-5 pb-8 md:px-10 lg:px-12">
      <div className="mb-2 flex items-end justify-between gap-4 md:hidden">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.28em] text-white/70">精选作品</h2>
        <p className="font-anton text-sm tracking-[0.16em] text-[#ffb089]">{pad(count)}</p>
      </div>
      {pieces.map((piece, i) => {
        const set = piece.coverSet && piece.coverSet.length >= 2 ? piece.coverSet.slice(0, 3) : null
        return (
          <button
            key={piece.slug}
            type="button"
            onClick={() => onOpen(projects[i])}
            className="grid gap-3 border-t border-white/10 py-7 text-left outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ffb089] [-webkit-tap-highlight-color:transparent] md:grid-cols-[8rem_minmax(0,1fr)] md:gap-8 md:py-8"
          >
            <p className="font-anton text-2xl tracking-[0.08em] text-[#fd2601] md:text-3xl">{pad(i + 1)}</p>
            <span>
              {set ? (
                <span className="-mx-1 flex snap-x snap-mandatory gap-2 overflow-x-auto px-1 pb-0.5 [scrollbar-width:none] [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden md:mx-0 md:grid md:aspect-[16/10] md:snap-none md:grid-cols-3 md:gap-1.5 md:overflow-hidden md:rounded-[0.85rem] md:bg-[#100705] md:p-2 md:px-2">
                  {set.map((shot) => (
                    <img
                      key={shot}
                      src={shot}
                      alt=""
                      className="aspect-[5/4] w-[78%] shrink-0 snap-center rounded-[0.75rem] bg-[#100705] object-cover md:h-full md:w-full md:rounded-[0.45rem]"
                    />
                  ))}
                </span>
              ) : (
                <img
                  src={piece.cover}
                  alt=""
                  className="aspect-[16/10] w-full rounded-[0.85rem] bg-[#100705] object-contain"
                />
              )}
              <span className="mt-3 block font-display text-xl font-semibold text-[#fff6ef] md:mt-4 md:text-2xl">
                {piece.title}
              </span>
              <span className="mt-1 block text-sm text-[#ffb089]">{piece.discipline}</span>
              <span className="mt-2 block max-w-xl text-sm leading-relaxed text-[#d7c2b4]">{piece.desc}</span>
              <span className="mt-3 inline-block text-sm font-medium text-[#ffb089] md:hidden">查看专题 →</span>
            </span>
          </button>
        )
      })}
    </div>
  )
}

function WorkScroll({ onOpen }: { onOpen: Open }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 32, mass: 0.28 })
  const progress = useTransform(smooth, [0, 1], [0, count - 1])
  const [active, setActive] = useState(0)

  useMotionValueEvent(progress, 'change', (v) => {
    const next = Math.min(count - 1, Math.max(0, Math.round(v)))
    setActive((prev) => (prev === next ? prev : next))
  })

  function scrollToIndex(i: number) {
    const el = ref.current
    if (!el) return
    const start = el.getBoundingClientRect().top + window.scrollY
    const travel = el.offsetHeight - window.innerHeight
    const top = start + (count <= 1 ? 0 : (i / (count - 1)) * travel)
    window.scrollTo({ top, behavior: 'smooth' })
  }

  const piece = pieces[active]

  return (
    <div
      ref={ref}
      className="relative"
      style={{ height: `calc(88svh + ${(count - 1) * 52}svh)` }}
    >
      <div className="sticky top-0 flex h-svh flex-col px-5 pt-[4.75rem] pb-5 md:px-10 lg:px-14">
        <div className="mb-3 flex items-end justify-between gap-4">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.28em] text-white/70">精选作品</h2>
          <p className="font-anton text-sm tracking-[0.16em] text-[#ffb089]">
            {pad(active + 1)}
            <span className="text-white/40"> / {pad(count)}</span>
          </p>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 grid-rows-[auto_minmax(0,1fr)] content-start gap-4 md:grid-cols-[minmax(14.5rem,18.5rem)_minmax(0,1fr)] md:grid-rows-1 md:content-stretch md:gap-8 lg:grid-cols-[minmax(16rem,21rem)_minmax(0,1fr)] lg:gap-12">
          <div className="order-2 flex min-h-0 flex-col gap-4 md:order-1 md:h-full md:justify-center">
            <ol
              className="hidden flex-col md:flex"
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown') {
                  e.preventDefault()
                  scrollToIndex(Math.min(count - 1, active + 1))
                } else if (e.key === 'ArrowUp') {
                  e.preventDefault()
                  scrollToIndex(Math.max(0, active - 1))
                }
              }}
            >
              {pieces.map((item, i) => {
                const on = i === active
                return (
                  <li key={item.slug}>
                    <button
                      type="button"
                      aria-current={on ? 'true' : undefined}
                      onClick={() => scrollToIndex(i)}
                      className={`flex w-full items-baseline gap-3 py-1 text-left outline-offset-4 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ffb089] ${
                        on ? 'text-[#fff6ef]' : 'text-[#d7c2b4]/40 hover:text-[#d7c2b4]'
                      }`}
                    >
                      <span className={`w-6 shrink-0 font-anton text-[11px] tracking-[0.12em] ${on ? 'text-[#fd2601]' : ''}`}>
                        {pad(i + 1)}
                      </span>
                      <span className={on ? 'font-display text-[1.15rem] font-semibold tracking-[-0.03em]' : 'text-sm'}>
                        {item.title}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ol>

            <div className="relative min-h-[7.5rem] md:mt-6">
                <motion.div
                  key={piece.slug}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="text-[11px] tracking-[0.18em] text-[#ffb089]">{piece.discipline}</p>
                  <h3 className="mt-1 font-display text-[1.65rem] font-semibold leading-none tracking-[-0.04em] text-[#fff6ef] md:text-4xl">
                    {piece.title}
                  </h3>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#d7c2b4] md:line-clamp-3">{piece.desc}</p>
                  <button
                    type="button"
                    onClick={() => onOpen(projects[active])}
                    className="mt-3 hidden text-sm font-medium text-[#ffb089] outline-offset-4 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ffb089] md:inline"
                  >
                    查看专题 →
                  </button>
                </motion.div>
            </div>

            <div className="relative md:hidden">
              <div className="flex gap-2 overflow-x-auto pb-1 [mask-image:linear-gradient(90deg,#000_0%,#000_88%,transparent)]">
                {pieces.map((item, i) => (
                  <button
                    key={item.slug}
                    type="button"
                    aria-current={i === active ? 'true' : undefined}
                    onClick={() => scrollToIndex(i)}
                    className={`shrink-0 rounded-full px-3 py-1 text-xs ${
                      i === active ? 'bg-[#fd2601] text-white' : 'bg-white/10 text-[#d7c2b4]'
                    }`}
                  >
                    {pad(i + 1)} {item.title}
                  </button>
                ))}
              </div>
            </div>

          </div>

          <PlateStage progress={progress} active={active} onOpen={() => onOpen(projects[active])} />
        </div>
      </div>
    </div>
  )
}

function PlateStage({
  progress,
  active,
  onOpen,
}: {
  progress: MotionValue<number>
  active: number
  onOpen: () => void
}) {
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const cx = useMotionValue(0)
  const cy = useMotionValue(0)
  const spx = useSpring(px, { stiffness: 160, damping: 22, mass: 0.35 })
  const spy = useSpring(py, { stiffness: 160, damping: 22, mass: 0.35 })
  const scx = useSpring(cx, { stiffness: 320, damping: 30, mass: 0.28 })
  const scy = useSpring(cy, { stiffness: 320, damping: 30, mass: 0.28 })
  const rotateY = useTransform(spx, [-0.5, 0.5], [-7, 7])
  const rotateX = useTransform(spy, [-0.5, 0.5], [5, -5])
  const driftX = useTransform(spx, (v) => v * 18)
  const driftY = useTransform(spy, (v) => v * 12)
  const [inside, setInside] = useState(false)
  const insideRef = useRef(false)
  const piece = pieces[active]

  function onMove(e: ReactPointerEvent<HTMLButtonElement>) {
    if (e.pointerType !== 'mouse') return
    if (!insideRef.current) {
      insideRef.current = true
      setInside(true)
    }
    const r = e.currentTarget.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width - 0.5)
    py.set((e.clientY - r.top) / r.height - 0.5)
    cx.set(e.clientX - r.left)
    cy.set(e.clientY - r.top)
  }

  return (
    <button
      type="button"
      onClick={onOpen}
      onPointerEnter={(e) => {
        if (e.pointerType !== 'mouse') return
        insideRef.current = true
        setInside(true)
      }}
      onPointerMove={onMove}
      onPointerLeave={() => {
        insideRef.current = false
        px.set(0)
        py.set(0)
        setInside(false)
      }}
      aria-label={`${piece.title}，查看专题`}
      className={`relative order-1 aspect-[16/10] w-full text-left outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ffb089] md:order-2 md:aspect-auto md:h-full ${
        inside ? 'cursor-none' : ''
      }`}
    >
      <div className="absolute inset-0 overflow-hidden rounded-[1.35rem] border border-white/10 bg-[#100705] [perspective:1100px]">
        <motion.div className="absolute inset-0" style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}>
          <motion.div className="absolute inset-[-4%]" style={{ x: driftX, y: driftY }}>
            {pieces.map((item, i) => (
              <Plate
                key={item.slug}
                i={i}
                src={item.cover}
                coverSet={item.coverSet}
                video={item.coverVideo}
                progress={progress}
              />
            ))}
          </motion.div>
        </motion.div>
        <motion.div
          aria-hidden
          className="pointer-events-none absolute z-[2] size-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,246,239,0.2),transparent_68%)] mix-blend-screen"
          style={{ left: scx, top: scy, opacity: inside ? 1 : 0 }}
        />
      </div>
      <FollowCursor x={scx} y={scy} show={inside} label={piece.title} />
    </button>
  )
}

function Plate({
  i,
  src,
  coverSet,
  video,
  progress,
}: {
  i: number
  src: string
  coverSet?: string[]
  video?: string
  progress: MotionValue<number>
}) {
  const x = useTransform(progress, (v) => `${holdShift(i - v) * 100}%`)
  const set = coverSet && coverSet.length >= 2 ? coverSet.slice(0, 3) : null
  return (
    <motion.div className="absolute inset-0" style={{ x }}>
      {video ? (
        <video
          src={video}
          poster={src}
          muted
          loop
          autoPlay
          playsInline
          preload="metadata"
          className="h-full w-full object-contain"
        />
      ) : set ? (
        <div className="grid h-full w-full grid-cols-3 gap-1.5 p-2 sm:gap-2 sm:p-3">
          {set.map((shot) => (
            <img
              key={shot}
              src={shot}
              alt=""
              draggable={false}
              className="h-full w-full rounded-[0.65rem] bg-[#140a07] object-cover"
            />
          ))}
        </div>
      ) : (
        <img src={src} alt="" draggable={false} className="h-full w-full object-contain" />
      )}
    </motion.div>
  )
}

function FollowCursor({
  x,
  y,
  show,
  label,
}: {
  x: MotionValue<number>
  y: MotionValue<number>
  show: boolean
  label: string
}) {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute left-0 top-0 z-20 hidden md:block"
      style={{ x, y, opacity: show ? 1 : 0 }}
    >
      <svg
        viewBox="0 0 16 16"
        className="h-5 w-5 -translate-x-1.5 -translate-y-1 -rotate-[70deg] fill-[#fff6ef]"
      >
        <path d="M14.082 2.182a.5.5 0 0 1 .103.557l-5.5 13a.5.5 0 0 1-.928-.086l-2.2-5.2-5.2-2.2a.5.5 0 0 1-.086-.928l13-5.5a.5.5 0 0 1 .454.103z" />
      </svg>
      <span className="absolute left-4 top-3 whitespace-nowrap rounded-full bg-[#fff6ef] px-2.5 py-1 text-[11px] font-medium tracking-wide text-[#140a07]">
        打开 · {label}
      </span>
    </motion.div>
  )
}
