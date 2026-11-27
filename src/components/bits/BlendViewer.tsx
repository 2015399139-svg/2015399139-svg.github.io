import { useEffect, useRef, type RefObject } from 'react'

type Props = {
  src: string
  poster?: string
  className?: string
}

type ModelViewerEl = HTMLElement & {
  exposure: number
  shadowIntensity: number
  shadowSoftness: number
  toneMapping: string
  cameraOrbit: string
  fieldOfView: string
  jumpCameraToGoal: () => void
}

/** 约 400% 画面占比；半径锁死，禁止缩放到背面/底部 */
const ORBIT = '22deg 70deg 17%'
const FOV = '32deg'
const MIN_ORBIT = '-40deg 52deg 17%'
const MAX_ORBIT = '85deg 82deg 17%'

/** 正面来回摆动，不绕到背面 */
const SWAY_CENTER = 22
const SWAY_AMPLITUDE = 48
const SWAY_PHI = 70
const SWAY_RADIUS = '17%'
const SWAY_PERIOD_MS = 14000

/** 网页里直接转的 glTF 预览。不可缩放，也不能转到背面和底部。 */
export function BlendViewer({ src, poster, className = '' }: Props) {
  const ref = useRef<ModelViewerEl | null>(null)

  useEffect(() => {
    if (customElements.get('model-viewer')) return
    void import('@google/model-viewer')
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const applyLook = () => {
      el.exposure = 0.24
      el.shadowIntensity = 2
      el.shadowSoftness = 0.5
      el.toneMapping = 'agx'
      el.setAttribute('environment-image', 'neutral')
      el.cameraOrbit = ORBIT
      el.fieldOfView = FOV
      el.jumpCameraToGoal?.()
    }

    applyLook()
    el.addEventListener('load', applyLook)
    return () => el.removeEventListener('load', applyLook)
  }, [src])

  // 自定义正面摇摆：替代原生 auto-rotate（会绕整圈到背面）
  useEffect(() => {
    const el = ref.current
    if (!el) return

    let raf = 0
    let paused = false
    const started = performance.now()

    const tick = (now: number) => {
      if (!paused) {
        const t = ((now - started) % SWAY_PERIOD_MS) / SWAY_PERIOD_MS
        const theta = SWAY_CENTER + SWAY_AMPLITUDE * Math.sin(t * Math.PI * 2)
        el.cameraOrbit = `${theta.toFixed(2)}deg ${SWAY_PHI}deg ${SWAY_RADIUS}`
      }
      raf = requestAnimationFrame(tick)
    }

    const pause = () => {
      paused = true
    }
    const resume = () => {
      paused = false
    }

    el.addEventListener('pointerdown', pause)
    el.addEventListener('touchstart', pause, { passive: true })
    el.addEventListener('pointerup', resume)
    el.addEventListener('pointerleave', resume)
    el.addEventListener('touchend', resume)

    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('pointerdown', pause)
      el.removeEventListener('touchstart', pause)
      el.removeEventListener('pointerup', resume)
      el.removeEventListener('pointerleave', resume)
      el.removeEventListener('touchend', resume)
    }
  }, [src])

  return (
    <div className={`overflow-hidden rounded-[1.15rem] bg-[#0a0402] ring-1 ring-white/10 ${className}`}>
      <model-viewer
        ref={ref as unknown as RefObject<HTMLElement>}
        src={src}
        poster={poster}
        alt="可旋转的三维场景"
        camera-controls
        disable-zoom
        disable-pan
        touch-action="pan-y"
        shadow-intensity="2"
        shadow-softness="0.5"
        exposure="0.24"
        tone-mapping="agx"
        environment-image="neutral"
        interaction-prompt="auto"
        camera-orbit={ORBIT}
        field-of-view={FOV}
        min-camera-orbit={MIN_ORBIT}
        max-camera-orbit={MAX_ORBIT}
        min-field-of-view={FOV}
        max-field-of-view={FOV}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          backgroundColor: '#000000',
        }}
      />
    </div>
  )
}
