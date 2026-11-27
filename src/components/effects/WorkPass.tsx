import { motion, useMotionValue, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, type PointerEvent as ReactPointerEvent } from 'react'

const GRAVITY = 2100
const SWING_DAMP = 0.58
const AIR = 0.16
const MAX = 0.46

type Body = { theta: number; omega: number }

const strapFill =
  'repeating-linear-gradient(90deg, #5c1608 0 2px, #fd2601 2px 5px, #ffd7c2 5px 7px, #e23b12 7px 11px, #7a1a08 11px 14px)'

export function WorkPass({
  src,
  title,
  kicker,
  index,
  phase,
  onOpen,
  onHover,
  onImpulse,
  takeImpulse,
}: {
  src: string
  title: string
  kicker: string
  index: number
  phase: number
  onOpen: () => void
  onHover: () => void
  onImpulse: (from: number, omega: number) => void
  takeImpulse: (handler: (omega: number) => void) => void
}) {
  const reduce = useReducedMotion()
  const rootRef = useRef<HTMLDivElement>(null)
  const rot = useMotionValue(0)
  const body = useRef<Body>({ theta: 0.1 * (index % 2 === 0 ? 1 : -1), omega: 0 })
  const drag = useRef({ on: false, ox: 0, oy: 0, moved: false, t: 0 })
  const loopRef = useRef(0)
  const kick = useRef(() => {})

  useEffect(() => {
    takeImpulse((omega) => {
      body.current.omega += omega
      kick.current()
    })
  }, [takeImpulse])

  useEffect(() => {
    if (reduce) return
    let running = false
    let last = performance.now()
    let visible = true

    const loop = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000)
      last = now
      const b = body.current
      if (!drag.current.on) {
        const breeze = 0.055 * Math.sin(now * 0.0011 + phase)
        b.omega += (-(GRAVITY / 92) * Math.sin(b.theta) + breeze - SWING_DAMP * b.omega - AIR * b.omega) * dt
        b.theta += b.omega * dt
        if (b.theta > MAX) {
          b.theta = MAX
          if (b.omega > 0) b.omega *= -0.32
        } else if (b.theta < -MAX) {
          b.theta = -MAX
          if (b.omega < 0) b.omega *= -0.32
        }
      }
      rot.set((b.theta * 180) / Math.PI)
      const still = Math.abs(b.omega) < 0.004 && Math.abs(b.theta) < 0.01 && !drag.current.on
      if (!visible || still) {
        running = false
        loopRef.current = 0
        return
      }
      loopRef.current = requestAnimationFrame(loop)
    }

    kick.current = () => {
      if (running) return
      running = true
      last = performance.now()
      loopRef.current = requestAnimationFrame(loop)
    }
    kick.current()

    const io = new IntersectionObserver(([entry]) => {
      visible = !!entry?.isIntersecting
      if (visible) kick.current()
    })
    if (rootRef.current) io.observe(rootRef.current)
    return () => {
      cancelAnimationFrame(loopRef.current)
      io.disconnect()
    }
  }, [phase, reduce, rot])

  function pin() {
    const box = rootRef.current?.getBoundingClientRect()
    if (!box) return { x: 0, y: 0 }
    return { x: box.left + box.width / 2, y: box.top + 10 }
  }

  function onDown(e: ReactPointerEvent<HTMLButtonElement>) {
    if (reduce) return
    drag.current = { on: true, ox: e.clientX, oy: e.clientY, moved: false, t: performance.now() }
    body.current.omega = 0
    kick.current()
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      /* ignore */
    }
  }

  function onMove(e: ReactPointerEvent<HTMLButtonElement>) {
    if (!drag.current.on) return
    if (Math.hypot(e.clientX - drag.current.ox, e.clientY - drag.current.oy) > 7) drag.current.moved = true
    const p = pin()
    const dx = e.clientX - p.x
    const dy = Math.max(36, e.clientY - p.y)
    const next = Math.max(-MAX, Math.min(MAX, Math.atan2(dx, dy)))
    const now = performance.now()
    const dt = Math.max(0.008, (now - drag.current.t) / 1000)
    body.current.omega = (next - body.current.theta) / dt
    body.current.theta = next
    drag.current.t = now
    rot.set((next * 180) / Math.PI)
  }

  function onUp() {
    if (!drag.current.on) return
    drag.current.on = false
    if (Math.abs(body.current.omega) > 0.4) onImpulse(index, body.current.omega * 0.16)
    kick.current()
  }

  return (
    <div ref={rootRef} className="work-pass">
      <span className="work-pass-pin" aria-hidden>
        <span className="work-pass-nail" />
        <span className="work-pass-ring" />
      </span>
      <motion.div className="work-pass-arm" style={{ rotate: rot }}>
        <span className="work-pass-loop" aria-hidden style={{ backgroundImage: strapFill }} />
        <span className="work-pass-strap" aria-hidden style={{ backgroundImage: strapFill }} />
        <span className="work-pass-bead" aria-hidden />
        <motion.button
          type="button"
          aria-label={`${title}，查看专题`}
          className="work-pass-card"
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          onPointerEnter={onHover}
          onClick={() => {
            if (drag.current.moved) return
            onOpen()
          }}
        >
          <span className="work-pass-shell">
            <span className="work-pass-photo">
              <img src={src} alt="" draggable={false} />
            </span>
            <span className="work-pass-plate">
              <span>
                {kicker}
              </span>
              <strong>{title}</strong>
            </span>
          </span>
          <span className="work-pass-tab" aria-hidden />
        </motion.button>
      </motion.div>
    </div>
  )
}
