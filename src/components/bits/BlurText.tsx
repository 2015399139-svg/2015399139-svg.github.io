import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

/** React Bits · BlurText：从虚焦收到清晰。中文整句入场，英文按词。 */
export function BlurText({
  text,
  className,
  delay = 0,
}: {
  text: string
  className?: string
  delay?: number
}) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const [on, setOn] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setOn(true)
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const trimmed = text.trim()
  const hasCjk = /[\u4e00-\u9fff]/.test(trimmed)
  const parts = hasCjk
    ? [trimmed]
    : /\s/.test(trimmed)
      ? trimmed.split(/(\s+)/)
      : [...trimmed]

  return (
    <span ref={ref} className={className}>
      {parts.map((part, i) =>
        part.trim() === '' ? (
          <span key={i}>{part}</span>
        ) : (
          <motion.span
            key={i}
            className={hasCjk ? 'inline' : 'inline-block'}
            initial={reduce ? false : { opacity: 0, y: 8, filter: 'blur(10px)' }}
            animate={
              on || reduce
                ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                : { opacity: 0, y: 8, filter: 'blur(10px)' }
            }
            transition={{
              duration: 0.65,
              delay: delay + Math.min(i, 14) * 0.028,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {part}
          </motion.span>
        ),
      )}
    </span>
  )
}
