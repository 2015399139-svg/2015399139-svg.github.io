import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { profile } from '../../data/profile'

const tools = profile.tools

const REST_DESKTOP = 156
const REST_MOBILE = 112
const GRAVITY = 2600
const SPRING = 420
const SWING_DAMP = 0.42
const RADIAL_DAMP = 7.5
const AIR = 0.15

function readRest() {
  if (typeof window === 'undefined') return REST_DESKTOP
  return window.matchMedia('(max-width: 639px)').matches ? REST_MOBILE : REST_DESKTOP
}

type Body = {
  theta: number
  omega: number
  radius: number
  radial: number
}

/** 吊牌：绳端就是卡片的孔。先从一侧坠落，再沿绳子来回荡。 */
export function Lanyard({
  src,
  leanX,
  leanY,
}: {
  src: string
  leanX?: MotionValue<number>
  leanY?: MotionValue<number>
}) {
  const reduce = useReducedMotion()
  const rootRef = useRef<HTMLDivElement>(null)
  const restRef = useRef(readRest())
  const ropeLen = useMotionValue(restRef.current)
  const ropeRot = useMotionValue(0)
  const ropeDraw = useTransform(ropeLen, (value) => value + 28)
  const body = useRef<Body>({
    theta: 0.22,
    omega: 0,
    radius: restRef.current,
    radial: 0,
  })
  const leanRef = useRef(leanX)
  const leanYRef = useRef(leanY)
  leanRef.current = leanX
  leanYRef.current = leanY

  const [flipped, setFlipped] = useState(false)
  const [hint, setHint] = useState(true)
  const flippedRef = useRef(false)
  const flip = useSpring(0, { stiffness: 140, damping: 16 })
  const drag = useRef({ on: false, ox: 0, oy: 0, moved: false, t: 0, gx: 0, gy: 0 })
  const releaseRef = useRef<(x: number, y: number) => void>(() => {})

  function toggleFlip() {
    const next = !flippedRef.current
    flippedRef.current = next
    setFlipped(next)
    flip.set(next ? 180 : 0)
  }

  function pinPoint() {
    const box = rootRef.current?.getBoundingClientRect()
    if (!box) return { x: 0, y: 0 }
    // 与金属环中心对齐（悬挂旋转原点）
    const pinY = window.matchMedia('(min-width: 640px)').matches ? 16 : 15
    return { x: box.left + box.width / 2, y: box.top + pinY }
  }

  function place(theta: number, radius: number) {
    ropeLen.set(radius)
    ropeRot.set((theta * 180) / Math.PI)
  }

  function step(dt: number) {
    const b = body.current
    const rest = restRef.current
    const lean = (leanRef.current?.get() ?? 0) * 7.2
    const lift = (leanYRef.current?.get() ?? 0) * 180
    const outward = b.radius * b.omega * b.omega + Math.cos(b.theta) * GRAVITY + lift
    b.radial += (outward - SPRING * (b.radius - rest) - RADIAL_DAMP * b.radial) * dt
    b.radius += b.radial * dt
    b.radius = Math.max(rest * 0.86, Math.min(rest * 1.42, b.radius))

    const tangential = -(GRAVITY / b.radius) * Math.sin(b.theta) + lean - SWING_DAMP * b.omega - AIR * b.omega
    b.omega += tangential * dt
    b.theta += b.omega * dt
    if (b.theta > 0.72) {
      b.theta = 0.72
      if (b.omega > 0) b.omega *= -0.35
    } else if (b.theta < -0.72) {
      b.theta = -0.72
      if (b.omega < 0) b.omega *= -0.35
    }

    place(b.theta, b.radius)
  }

  function fromPointer(clientX: number, clientY: number) {
    const pin = pinPoint()
    const rest = restRef.current
    let x = clientX - pin.x
    let y = Math.max(24, clientY - pin.y)
    const dist = Math.hypot(x, y) || 1
    const max = rest * 1.38
    const min = rest * 0.88
    const clamped = Math.max(min, Math.min(max, dist))
    x = (x / dist) * clamped
    y = (y / dist) * clamped
    return { theta: Math.atan2(x, y), radius: clamped }
  }

  function release(clientX: number, clientY: number) {
    if (!drag.current.on) return
    const flicked = drag.current.moved || Math.hypot(clientX - drag.current.ox, clientY - drag.current.oy) > 8
    drag.current.on = false
    if (!flicked) {
      body.current.omega = 0
      body.current.radial = 0
      setHint(false)
      toggleFlip()
    }
  }
  releaseRef.current = release

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)')
    const sync = () => {
      const next = mq.matches ? REST_MOBILE : REST_DESKTOP
      const prev = restRef.current
      if (next === prev) return
      const scale = next / prev
      restRef.current = next
      body.current.radius *= scale
      place(body.current.theta, body.current.radius)
    }
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    const end = (e: PointerEvent) => releaseRef.current(e.clientX, e.clientY)
    window.addEventListener('pointerup', end)
    window.addEventListener('pointercancel', end)
    return () => {
      window.removeEventListener('pointerup', end)
      window.removeEventListener('pointercancel', end)
    }
  }, [])

  useEffect(() => {
    const rest = restRef.current
    if (reduce) {
      body.current = { theta: 0, omega: 0, radius: rest, radial: 0 }
      place(0, rest)
      return
    }
    const born = performance.now()
    body.current = { theta: 0.32, omega: 0.35, radius: rest * 0.96, radial: 0 }
    place(0.32, rest * 0.96)
    const hintTimer = window.setTimeout(() => setHint(false), 4200)
    let raf = 0
    let last = born
    const tick = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000)
      last = now
      if (!drag.current.on && now - born > 120) {
        const sub = 4
        const h = dt / sub
        for (let i = 0; i < sub; i++) step(h)
      } else if (!drag.current.on) {
        place(body.current.theta, body.current.radius)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(hintTimer)
    }
  }, [reduce, ropeLen, ropeRot])

  function onDown(e: ReactPointerEvent<HTMLButtonElement>) {
    if (reduce) {
      toggleFlip()
      return
    }
    const pin = pinPoint()
    const b = body.current
    const holeX = pin.x + Math.sin(b.theta) * b.radius
    const holeY = pin.y + Math.cos(b.theta) * b.radius
    drag.current = {
      on: true,
      ox: e.clientX,
      oy: e.clientY,
      moved: false,
      t: performance.now(),
      gx: e.clientX - holeX,
      gy: e.clientY - holeY,
    }
    body.current.omega = 0
    body.current.radial = 0
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      /* 松手时改由 window pointerup 收回 */
    }
  }

  function onMove(e: ReactPointerEvent<HTMLButtonElement>) {
    if (!drag.current.on) return
    if (Math.hypot(e.clientX - drag.current.ox, e.clientY - drag.current.oy) > 8) drag.current.moved = true
    const now = performance.now()
    const dt = Math.max(0.008, (now - drag.current.t) / 1000)
    const next = fromPointer(e.clientX - drag.current.gx, e.clientY - drag.current.gy)
    body.current.omega = (next.theta - body.current.theta) / dt
    body.current.radial = (next.radius - body.current.radius) / dt
    body.current.theta = next.theta
    body.current.radius = next.radius
    drag.current.t = now
    place(next.theta, next.radius)
  }

  function onUp(e: ReactPointerEvent<HTMLButtonElement>) {
    release(e.clientX, e.clientY)
  }

  const strapFill =
    'repeating-linear-gradient(90deg, #5c1608 0 2px, #fd2601 2px 5px, #ffd7c2 5px 7px, #e23b12 7px 11px, #7a1a08 11px 14px)'

  return (
    <div ref={rootRef} className="relative mx-auto h-[340px] w-full sm:h-[530px] lg:h-[600px]">
      {/* 固定挂点：钉头 + 开口环，织带从环中穿过下垂 */}
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 z-40 -translate-x-1/2">
        <span className="absolute left-1/2 top-0 size-5 -translate-x-1/2 rounded-full bg-white/22 blur-[1.5px] sm:size-6" />
        <span className="absolute left-1/2 top-[1px] z-20 size-[10px] -translate-x-1/2 rounded-full bg-gradient-to-b from-[#fffefb] to-[#d8c8bc] shadow-[0_1px_3px_rgba(60,10,0,0.4),inset_0_1px_0_rgba(255,255,255,0.95)] sm:size-[11px]">
          <span className="absolute left-1/2 top-1/2 h-px w-[55%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#b89580]/85" />
        </span>
        <span className="absolute left-1/2 top-[7px] z-10 size-[15px] -translate-x-1/2 rounded-full border-[2.5px] border-[#fff6ef] bg-[radial-gradient(circle_at_50%_38%,rgba(255,246,239,0.22),rgba(253,38,1,0.12)_55%,transparent_72%)] shadow-[0_2px_4px_rgba(60,10,0,0.28),inset_0_1px_0_rgba(255,255,255,0.4)] sm:top-[8px] sm:size-[17px] sm:border-[3px]" />
      </div>
      {hint && !flipped && !reduce ? (
        <p className="pointer-events-none absolute bottom-1 left-1/2 z-40 -translate-x-1/2 whitespace-nowrap text-[10px] tracking-[0.12em] text-white/70 sm:bottom-2 sm:text-[11px] sm:tracking-[0.14em]">
          点按翻面 · 看工具
        </p>
      ) : null}
      <motion.div
        className="absolute left-1/2 top-[15px] z-20 sm:top-[16px]"
        style={{ width: 0, height: 0, rotate: ropeRot, transformOrigin: '0px 0px' }}
      >
      {/* 穿环回折的一小段织带 */}
      <span
        aria-hidden
        className="absolute left-[-4px] top-[-8px] z-[1] h-[11px] w-[8px] rounded-[4px] shadow-[1px_1px_0_rgba(90,20,0,0.22)] sm:left-[-5px] sm:top-[-9px] sm:h-[12px] sm:w-[10px]"
        style={{ backgroundImage: strapFill }}
      />
      <motion.div
        aria-hidden
        className="absolute top-0 left-[-7px] w-[14px] origin-top rounded-b-sm shadow-[2px_0_0_rgba(90,20,0,0.28)] sm:left-[-9px] sm:w-[18px]"
        style={{
          height: ropeDraw,
          backgroundImage: strapFill,
          clipPath: 'polygon(22% 0, 78% 0, 100% 10px, 100% 100%, 0 100%, 0 10px)',
        }}
      />
      <motion.button
        type="button"
        aria-label={flipped ? '翻回头像' : '拖动或翻面'}
        className="absolute left-0 z-20 cursor-grab touch-none [perspective:1100px] active:cursor-grabbing"
        style={{ top: ropeLen, x: '-50%', y: -20 }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
          <motion.span
            className="relative z-0 block h-[210px] w-[146px] [transform-style:preserve-3d] sm:h-[314px] sm:w-[218px] lg:h-[362px] lg:w-[250px]"
            style={{ rotateY: reduce ? (flipped ? 180 : 0) : flip, transformOrigin: 'center center' }}
          >
            <span className="absolute inset-0 flex flex-col overflow-hidden rounded-[1rem] border-[2.5px] border-white/55 bg-white/35 shadow-[0_0_0_2px_rgba(253,38,1,0.18),0_28px_50px_-24px_rgba(60,10,0,0.55)] backdrop-blur-[3px] [backface-visibility:hidden] sm:rounded-[1.15rem] sm:border-[3px]">
              <span className="h-[24px] shrink-0 sm:h-[34px] lg:h-[38px]" aria-hidden />
              <span
                className="relative mx-[6px] mb-[6px] min-h-0 flex-1 overflow-hidden rounded-[0.55rem] bg-[#fd2601] sm:mx-2 sm:mb-2 sm:rounded-[0.8rem]"
                style={{
                  backgroundImage: `url(${src})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '150% auto',
                  backgroundPosition: '14% 28%',
                }}
                role="img"
                aria-hidden
              />
            </span>
            <span className="absolute inset-0 flex flex-col overflow-hidden rounded-[1rem] border-[2.5px] border-[#fff6ef] bg-gradient-to-b from-[#fff0e6] to-[#ffe0cc] px-3 pb-3 pt-7 text-left shadow-[0_0_0_2px_rgba(253,38,1,0.22),0_28px_50px_-24px_rgba(60,10,0,0.55)] [backface-visibility:hidden] [transform:rotateY(180deg)] sm:rounded-[1.15rem] sm:border-[3px] sm:px-5 sm:pb-5 sm:pt-10">
              <span className="text-[9px] font-medium uppercase tracking-[0.22em] text-[#c2410c] sm:text-[11px]">
                // Tools
              </span>
              <span className="mt-0.5 font-display text-sm font-semibold tracking-[-0.02em] text-[#3a1208] sm:mt-1 sm:text-lg">
                擅长工具
              </span>
              <span className="mt-2 flex min-h-0 flex-1 flex-col justify-center gap-1 sm:mt-4 sm:gap-2">
                {tools.map((tool) => (
                  <span
                    key={tool}
                    className="font-anton text-[0.92rem] leading-none tracking-[0.06em] text-[#7a1a08] sm:text-[1.2rem] lg:text-[1.35rem]"
                  >
                    {tool}
                  </span>
                ))}
              </span>
              <span className="mt-2 block text-[10px] leading-relaxed text-[#9a5a3a] sm:mt-3 sm:text-xs">
                {profile.name}
              </span>
            </span>
          </motion.span>
          <span
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-4 z-40 h-[42px] w-[32px] -translate-x-1/2 -translate-y-1/2 rounded-[8px] border border-[#fd2601]/35 bg-[#fff6ef] shadow-[0_0_0_2px_rgba(253,38,1,0.12),0_4px_10px_-4px_rgba(80,20,0,0.35)] sm:top-5 sm:h-[52px] sm:w-[40px] sm:rounded-[10px]"
            style={{
              WebkitMaskImage: 'radial-gradient(circle at 50% 50%, transparent 5px, #000 6px)',
              maskImage: 'radial-gradient(circle at 50% 50%, transparent 5px, #000 6px)',
            }}
          />
      </motion.button>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-0 z-30 size-3.5 rounded-full border-[2.5px] border-[#fff6ef] bg-[#fd2601] shadow-[0_2px_0_rgba(60,10,0,0.28)] sm:size-4 sm:border-[3px]"
        style={{ top: ropeLen, x: '-50%', y: '-50%' }}
      />
      </motion.div>
    </div>
  )
}
