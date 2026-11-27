import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import { useRef, type PointerEvent as ReactPointerEvent } from 'react'
import { Lanyard } from './effects/Lanyard'
import { profile, publicAsset } from '../data/profile'

const portraitSrc = publicAsset('images/hero-portrait.jpg')
const ease = [0.22, 1, 0.36, 1] as const

export function Hero() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 42, damping: 18, mass: 0.6 })

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const leaveY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 56])
  const leaveOpacity = useTransform(scrollYProgress, [0, 0.8], reduce ? [1, 1] : [1, 0.28])
  const leaveScale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1, 0.96])
  const titleX = useTransform(sx, [-0.5, 0.5], reduce ? [0, 0] : [10, -10])

  function onMove(e: ReactPointerEvent<HTMLElement>) {
    if (reduce || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }

  function onLeave() {
    mx.set(0)
    my.set(0)
  }

  return (
    <section
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="hero-stage relative isolate flex min-h-svh flex-col overflow-hidden text-white supports-[height:100dvh]:min-h-dvh"
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_18%,rgba(255,214,186,0.22),transparent_56%),linear-gradient(180deg,#ff2a08_0%,#fd2601_38%,#f37e1c_100%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-40 bg-gradient-to-b from-black/15 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-36 bg-gradient-to-t from-[#c45110]/45 to-transparent"
        aria-hidden
      />

      <motion.div
        className="relative z-20 mt-14 flex min-h-0 flex-1 flex-col items-center justify-center px-3 sm:mt-16 sm:px-4"
        style={{ y: leaveY, opacity: leaveOpacity, scale: leaveScale }}
      >
        <motion.div style={{ x: titleX }} className="relative flex w-full flex-col items-center">
          <h1 className="sr-only">Personal Portfolio</h1>
          <div className="relative z-10 w-full">
            <Lanyard src={portraitSrc} leanX={mx} leanY={my} />
          </div>
          <div className="relative z-20 -mt-3 w-full sm:-mt-6 lg:-mt-8">
            <motion.p
              aria-hidden
              className="hero-display-word"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduce ? 0 : 0.75, delay: reduce ? 0 : 0.08, ease }}
            >
              Personal
            </motion.p>
            <motion.p
              aria-hidden
              className="hero-display-word mt-[0.12em]"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduce ? 0 : 0.75, delay: reduce ? 0 : 0.16, ease }}
            >
              Portfolio
            </motion.p>
          </div>
        </motion.div>
      </motion.div>

      <div className="relative z-30 mx-auto w-full max-w-6xl px-5 pb-2 sm:px-8">
        <motion.div
          id="about"
          className="flex flex-col gap-4 border-t border-white/15 pt-4 sm:flex-row sm:items-end sm:justify-between sm:gap-8 sm:pt-5"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.7, delay: reduce ? 0 : 0.45, ease }}
        >
          <div className="max-w-md">
            <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-white/75">
              {profile.name}
            </p>
            <p className="mt-2 text-[13px] font-normal leading-[1.75] tracking-[0.01em] text-white/92 sm:text-[14px]">
              {profile.bio}
            </p>
          </div>
          <div className="flex max-w-xl flex-col gap-2 sm:items-end">
            <p className="flex flex-wrap gap-1.5 sm:justify-end">
              {profile.tools.map((tool) => (
                <span
                  key={tool}
                  className="rounded-full border border-white/28 bg-white/[0.08] px-2.5 py-[5px] text-[10px] font-medium tracking-[0.06em] text-white/92"
                >
                  {tool}
                </span>
              ))}
            </p>
            <p className="flex flex-wrap gap-1.5 sm:justify-end">
              {profile.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-black/12 px-2.5 py-[5px] text-[10px] tracking-[0.08em] text-white/78"
                >
                  {skill}
                </span>
              ))}
            </p>
          </div>
        </motion.div>
      </div>

      <div className="h-[max(0.9rem,env(safe-area-inset-bottom))] sm:h-[max(1.35rem,env(safe-area-inset-bottom))]" />
    </section>
  )
}
