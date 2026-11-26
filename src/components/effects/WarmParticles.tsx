import { useReducedMotion } from 'framer-motion'
import { useEffect, useRef } from 'react'

type Mode = 'page' | 'stage'

type Dot = {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  a: number
  tw: number
  spark: boolean
}

function countFor(mode: Mode, w: number) {
  const mobile = w < 640
  if (mode === 'stage') return mobile ? 36 : 64
  return mobile ? 48 : 96
}

/** 暖色光尘：首页铺一层，作品环再密一点。 */
export function WarmParticles({ mode }: { mode: Mode }) {
  const reduce = useReducedMotion()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (reduce) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let w = 0
    let h = 0
    let raf = 0
    let visible = true
    let running = !document.hidden
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    const pointer = { x: 0.5, y: 0.45, on: false }
    let dots: Dot[] = []

    const spawn = (n: number): Dot[] =>
      Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * (mode === 'page' ? 0.22 : 0.28),
        vy: -0.08 - Math.random() * (mode === 'page' ? 0.28 : 0.38),
        r: 0.5 + Math.random() * (mode === 'page' ? 2.4 : 1.9),
        a: 0.14 + Math.random() * 0.42,
        tw: Math.random() * Math.PI * 2,
        spark: Math.random() < 0.12,
      }))

    const fit = () => {
      const box = canvas.getBoundingClientRect()
      w = Math.max(1, box.width)
      h = Math.max(1, box.height)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const n = countFor(mode, w)
      if (dots.length !== n) dots = spawn(n)
    }

    const onMove = (e: PointerEvent) => {
      pointer.on = true
      pointer.x = e.clientX / Math.max(1, window.innerWidth)
      pointer.y = e.clientY / Math.max(1, window.innerHeight)
    }
    const onLeave = () => {
      pointer.on = false
    }

    const tick = () => {
      if (!visible || !running) {
        raf = requestAnimationFrame(tick)
        return
      }
      ctx.clearRect(0, 0, w, h)
      const t = performance.now() * 0.001
      const px = pointer.x * w
      const py = pointer.y * h
      const pull = pointer.on ? 0.000055 : 0.000012

      for (const d of dots) {
        d.tw += 0.018
        d.vx += (px - d.x) * pull
        d.vy += (py - d.y) * pull * 0.45
        d.vx *= 0.992
        d.vy *= 0.994
        d.x += d.vx
        d.y += d.vy
        if (d.y < -8) {
          d.y = h + 6
          d.x = Math.random() * w
        }
        if (d.y > h + 10) d.y = -4
        if (d.x < -10) d.x = w + 4
        if (d.x > w + 10) d.x = -4

        const flicker = 0.55 + 0.45 * Math.sin(d.tw + t)
        const alpha = d.a * flicker
        if (d.spark) {
          ctx.beginPath()
          ctx.fillStyle = `rgba(255, 236, 210, ${alpha * 0.9})`
          ctx.arc(d.x, d.y, d.r * 1.15, 0, Math.PI * 2)
          ctx.fill()
          ctx.beginPath()
          ctx.strokeStyle = `rgba(255, 168, 110, ${alpha * 0.55})`
          ctx.lineWidth = 0.7
          ctx.moveTo(d.x - d.r * 2.2, d.y)
          ctx.lineTo(d.x + d.r * 2.2, d.y)
          ctx.moveTo(d.x, d.y - d.r * 2.2)
          ctx.lineTo(d.x, d.y + d.r * 2.2)
          ctx.stroke()
        } else {
          const g = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r * 3.2)
          g.addColorStop(0, `rgba(255, 214, 170, ${alpha})`)
          g.addColorStop(0.45, `rgba(253, 120, 48, ${alpha * 0.35})`)
          g.addColorStop(1, 'rgba(253, 38, 1, 0)')
          ctx.beginPath()
          ctx.fillStyle = g
          ctx.arc(d.x, d.y, d.r * 3.2, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      raf = requestAnimationFrame(tick)
    }

    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(canvas)
    const io = new IntersectionObserver(([entry]) => {
      visible = !!entry?.isIntersecting
    })
    io.observe(canvas)
    const onVis = () => {
      running = !document.hidden
    }
    document.addEventListener('visibilitychange', onVis)
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerleave', onLeave)
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
    }
  }, [mode, reduce])

  if (reduce) return null

  return (
    <canvas
      ref={canvasRef}
      className={
        mode === 'page'
          ? 'pointer-events-none fixed inset-0 z-[3] mix-blend-screen'
          : 'pointer-events-none absolute inset-0 z-0 mix-blend-screen'
      }
      aria-hidden
    />
  )
}
