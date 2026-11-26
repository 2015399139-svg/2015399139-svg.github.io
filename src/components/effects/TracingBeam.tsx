import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { useRef, type ReactNode } from 'react'

/** Aceternity · Tracing Beam：一条光跟着滚动往下走。 */
export function TracingBeam({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 80%', 'end 40%'],
  })
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 24, mass: 0.4 })
  const dot = useTransform(progress, [0, 1], ['0%', '100%'])

  return (
    <div ref={ref} className="relative">
      <div className="pointer-events-none absolute bottom-8 left-3 top-8 z-20 hidden w-px md:block" aria-hidden>
        <div className="absolute inset-0 bg-white/10" />
        <motion.div
          className="absolute inset-x-0 top-0 origin-top bg-gradient-to-b from-[#fd2601] via-[#f37e1c] to-[#ffb089]"
          style={{ scaleY: reduce ? 1 : progress, height: '100%' }}
        />
        <motion.span
          className="absolute left-1/2 size-2.5 -translate-x-1/2 rounded-full bg-[#fff6ef] shadow-[0_0_16px_4px_rgba(253,38,1,0.85)]"
          style={{ top: reduce ? '0%' : dot }}
        />
      </div>
      {children}
    </div>
  )
}
