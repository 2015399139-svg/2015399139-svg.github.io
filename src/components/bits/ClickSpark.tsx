import { useReducedMotion } from 'framer-motion'
import { useEffect, useRef, type ReactNode } from 'react'

type Spark = { x: number; y: number; angle: number; born: number }

/** React Bits · ClickSpark：点击处迸出一小束暖色火星。 */
export function ClickSpark({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sparks = useRef<Spark[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || reduce) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    fit()
    window.addEventListener('resize', fit)

    let raf = 0
    const draw = (now: number) => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      sparks.current = sparks.current.filter((s) => now - s.born < 420)
      for (const s of sparks.current) {
        const t = (now - s.born) / 420
        const dist = 10 + t * 36
        const alpha = 1 - t
        ctx.strokeStyle = `rgba(255, 214, 186, ${alpha})`
        ctx.lineWidth = 1.4
        ctx.beginPath()
        ctx.moveTo(s.x + Math.cos(s.angle) * 4, s.y + Math.sin(s.angle) * 4)
        ctx.lineTo(s.x + Math.cos(s.angle) * dist, s.y + Math.sin(s.angle) * dist)
        ctx.stroke()
      }
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (target?.closest('[role="dialog"]')) return
      const count = 10
      for (let i = 0; i < count; i++) {
        sparks.current.push({
          x: e.clientX,
          y: e.clientY,
          angle: (Math.PI * 2 * i) / count + Math.random() * 0.2,
          born: performance.now(),
        })
      }
    }
    window.addEventListener('click', onClick)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', fit)
      window.removeEventListener('click', onClick)
    }
  }, [reduce])

  return (
    <>
      {children}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-[80]"
        aria-hidden
      />
    </>
  )
}
