import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import { useRef, type PointerEvent as ReactPointerEvent } from 'react'
import { BlurText } from './bits/BlurText'
import { Lanyard } from './effects/Lanyard'
import { profile, publicAsset } from '../data/profile'

const portraitSrc = `${publicAsset('images/hero-portrait.jpg')}?v=2`

const titleWords = ['Personal', 'Portfolio'] as const
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
  const leaveY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 72])
  const leaveOpacity = useTransform(scrollYProgress, [0, 0.8], reduce ? [1, 1] : [1, 0.2])
  const leaveScale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1, 0.94])
  const titleX = useTransform(sx, [-0.5, 0.5], reduce ? [0, 0] : [18, -18])

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
      className="hero-stage relative isolate flex min-h-svh flex-col overflow-hidden bg-gradient-to-b from-[#fd2601] to-[#f37e1c] text-white supports-[height:100dvh]:min-h-dvh"
    >
      <motion.div
        className="pointer-events-none absolute bottom-16 right-[-2rem] z-[1] size-[220px] rounded-full bg-[#F4791B] opacity-60 mix-blend-screen blur-[80px] sm:size-[300px]"
        aria-hidden
        animate={reduce ? undefined : { x: [0, -28, 0], y: [0, -18, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="pointer-events-none absolute bottom-10 left-[-4rem] z-[1] h-[220px] w-[420px] rounded-full bg-[#F4791B] opacity-60 mix-blend-screen blur-[80px] sm:h-[300px] sm:w-[600px]"
        aria-hidden
        animate={reduce ? undefined : { x: [0, 40, 0], y: [0, 16, 0], scale: [1, 1.06, 1] }}
        transition={{ duration: 17, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="relative z-20 mt-12 flex min-h-0 flex-1 flex-col items-center justify-center px-3 sm:mt-14 sm:px-4"
        style={{ y: leaveY, opacity: leaveOpacity, scale: leaveScale }}
      >
        <div className="relative w-full">
          <motion.h1
            style={{ x: titleX }}
            className="pointer-events-none absolute left-1/2 top-[56%] z-0 w-[min(100vw,42rem)] -translate-x-1/2 -translate-y-1/2 text-center font-anton uppercase leading-[0.9] tracking-[0.04em] text-white/90 sm:top-[62%] sm:w-screen sm:leading-none sm:tracking-[0.06em] sm:text-white sm:[mask-image:linear-gradient(90deg,transparent,black_7%,black_93%,transparent)]"
          >
            <span className="inline-block overflow-hidden align-bottom">
              <motion.span
                className="relative inline-block text-[clamp(2.35rem,11.5vw,8.4rem)] will-change-transform"
                initial={reduce ? false : { y: '115%' }}
                animate={{ y: '0%' }}
                transition={{ duration: reduce ? 0 : 0.9, delay: reduce ? 0 : 0.08, ease }}
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 translate-x-[0.018em] translate-y-[0.028em] text-transparent [-webkit-text-stroke:0.6px_rgba(255,246,239,0.38)]"
                >
                  <span className="block sm:inline">{titleWords[0]}</span>
                  <span className="hidden sm:inline"> </span>
                  <span className="block sm:inline">{titleWords[1]}</span>
                </span>
                <span className={reduce ? 'hero-poster-type hero-poster-type-still' : 'hero-poster-type'}>
                  <span className="block sm:inline">{titleWords[0]}</span>
                  <span className="hidden sm:inline"> </span>
                  <span className="block sm:inline">{titleWords[1]}</span>
                </span>
              </motion.span>
            </span>
          </motion.h1>
          <div className="relative z-10">
            <Lanyard src={portraitSrc} leanX={mx} leanY={my} />
          </div>
        </div>
      </motion.div>

      <div className="relative z-30 mx-auto mt-1 w-full max-w-6xl px-5 pb-1 sm:mt-4 sm:px-6">
        <motion.div
          id="about"
          className="max-w-none text-left text-pretty text-white sm:max-w-md"
          initial={reduce ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.7, delay: reduce ? 0 : 0.55, ease }}
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/80">
            // {profile.name}
          </p>
          <BlurText
            text={profile.bio}
            delay={0.15}
            className="mt-2 block text-[12.5px] font-normal normal-case leading-relaxed tracking-normal text-white/95 sm:text-[13px]"
          />
          <div className="mt-4 space-y-2.5 text-[12px] leading-relaxed tracking-normal text-white/90 sm:mt-5 sm:text-[13px]">
            <p>
              <span className="text-white/65">工具 </span>
              {profile.tools.join(' · ')}
            </p>
            <p>
              <span className="text-white/65">技能 </span>
              {profile.skills.join(' · ')}
            </p>
          </div>
        </motion.div>
      </div>

      <div className="h-[max(0.85rem,env(safe-area-inset-bottom))] sm:h-[max(1.25rem,env(safe-area-inset-bottom))]" />
    </section>
  )
}
