import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { useEffect } from 'react'

/** Aceternity · 鼠标光斑：整页一块暖光跟着指针。 */
export function PointerGlow() {
  const reduce = useReducedMotion()
  const x = useMotionValue(-400)
  const y = useMotionValue(-400)
  const sx = useSpring(x, { stiffness: 70, damping: 22, mass: 0.5 })
  const sy = useSpring(y, { stiffness: 70, damping: 22, mass: 0.5 })

  useEffect(() => {
    if (reduce) return
    if (window.matchMedia('(pointer: coarse)').matches) return
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      x.set(e.clientX)
      y.set(e.clientY)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [reduce, x, y])

  if (reduce) return null

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed z-[5] size-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(253,38,1,0.28),rgba(243,126,28,0.08)_42%,transparent_68%)] mix-blend-screen"
      style={{ left: sx, top: sy }}
    />
  )
}
