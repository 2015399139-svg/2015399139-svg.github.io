import { useEffect, useRef, useState, type RefObject } from 'react'
import { publicAsset } from '../../data/profile'

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
  loaded: boolean
  jumpCameraToGoal: () => void
}

type ModelViewerCtor = CustomElementConstructor & {
  dracoDecoderLocation: string
}

/** 约 400% 画面占比；半径锁死，禁止缩放到背面/底部 */
const ORBIT = '22deg 70deg 17%'
const FOV = '32deg'
const MIN_ORBIT = '-40deg 52deg 17%'
const MAX_ORBIT = '85deg 82deg 17%'
const EXPOSURE = 0.48

/** 正面来回摆动，不绕到背面 */
const SWAY_CENTER = 22
const SWAY_AMPLITUDE = 48
const SWAY_PHI = 70
const SWAY_RADIUS = '17%'
const SWAY_PERIOD_MS = 14000

function dracoPath() {
  const base = publicAsset('draco')
  return base.endsWith('/') ? base : `${base}/`
}

function ensureDracoLocation() {
  const path = dracoPath()
  const g = globalThis as typeof globalThis & {
    ModelViewerElement?: { dracoDecoderLocation?: string }
  }
  g.ModelViewerElement = g.ModelViewerElement || {}
  g.ModelViewerElement.dracoDecoderLocation = path
  const Ctor = customElements.get('model-viewer') as ModelViewerCtor | undefined
  if (Ctor) Ctor.dracoDecoderLocation = path
  return path
}

/** 网页里直接转的 glTF 预览。不可缩放，也不能转到背面和底部。 */
export function BlendViewer({ src, poster, className = '' }: Props) {
  const ref = useRef<ModelViewerEl | null>(null)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    ensureDracoLocation()
    if (customElements.get('model-viewer')) return
    void import('@google/model-viewer').then(() => {
      ensureDracoLocation()
    })
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    setReady(false)
    setFailed(false)
    ensureDracoLocation()

    const applyLook = () => {
      el.exposure = EXPOSURE
      el.shadowIntensity = 2
      el.shadowSoftness = 0.5
      el.toneMapping = 'agx'
      el.setAttribute('environment-image', 'neutral')
      el.cameraOrbit = ORBIT
      el.fieldOfView = FOV
      el.jumpCameraToGoal?.()
      if (el.loaded) setReady(true)
    }

    const onLoad = () => {
      applyLook()
      setReady(true)
      setFailed(false)
    }
    const onError = () => {
      setFailed(true)
      setReady(false)
    }

    applyLook()
    if (el.loaded) onLoad()
    el.addEventListener('load', onLoad)
    el.addEventListener('error', onError)
    return () => {
      el.removeEventListener('load', onLoad)
      el.removeEventListener('error', onError)
    }
  }, [src])

  // 自定义正面摇摆：替代原生 auto-rotate（会绕整圈到背面）
  useEffect(() => {
    const el = ref.current
    if (!el || !ready) return

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
  }, [src, ready])

  return (
    <div className={`relative overflow-hidden rounded-[1.15rem] bg-[#0a0402] ring-1 ring-white/10 ${className}`}>
      {!ready && !failed ? (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-0.5 overflow-hidden bg-white/10">
          <span className="block h-full w-1/3 animate-pulse bg-[#ffb089]/80" />
        </div>
      ) : null}
      {failed ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#0a0402]/88 px-4 text-center text-sm text-[#d7c2b4]">
          三维预览加载失败，请刷新重试
        </div>
      ) : null}
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
        exposure={String(EXPOSURE)}
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
