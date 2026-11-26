import { useEffect, useRef, useState } from 'react'

type Props = {
  src: string
  poster?: string
  title?: string
  body?: string
  kicker?: string
  autoPlay?: boolean
  className?: string
}

/** 成片播放器：进入视口才挂载片源，离开/切后台即暂停。 */
export function ShowcaseFilm({
  src,
  poster,
  title,
  body,
  kicker = '成片演示',
  autoPlay = true,
  className = '',
}: Props) {
  const rootRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [muted, setMuted] = useState(true)
  const [playing, setPlaying] = useState(false)
  const [armed, setArmed] = useState(false)
  const [ratio] = useState('3 / 2')

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return
        const video = videoRef.current
        if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
          setArmed(true)
          if (autoPlay) {
            video?.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
          }
        } else {
          video?.pause()
          setPlaying(false)
        }
      },
      { threshold: [0, 0.25, 0.5], rootMargin: '80px' },
    )
    io.observe(root)
    return () => io.disconnect()
  }, [autoPlay])

  useEffect(() => {
    const onVis = () => {
      const video = videoRef.current
      if (document.hidden) {
        video?.pause()
        setPlaying(false)
      }
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = muted
  }, [muted, armed])

  function togglePlay() {
    const video = videoRef.current
    setArmed(true)
    if (!video) return
    if (video.paused) {
      video.play().then(() => setPlaying(true)).catch(() => {})
    } else {
      video.pause()
      setPlaying(false)
    }
  }

  return (
    <figure ref={rootRef} className={`min-w-0 ${className}`}>
      <div
        className="relative overflow-hidden rounded-[1rem] bg-[#100705] sm:rounded-[1.25rem]"
        style={{ aspectRatio: ratio }}
      >
        {poster ? (
          <img
            src={poster}
            alt=""
            aria-hidden
            className={`absolute inset-0 h-full w-full object-contain ${playing ? 'opacity-0' : 'opacity-100'}`}
          />
        ) : null}

        {armed ? (
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            playsInline
            loop
            muted={muted}
            preload="metadata"
            controls={false}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            className="absolute inset-0 h-full w-full object-contain"
          />
        ) : null}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />

        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 sm:bottom-4 sm:left-4 sm:right-4">
          <button
            type="button"
            onClick={togglePlay}
            className="inline-flex items-center gap-2 rounded-full bg-black/40 px-3.5 py-2 text-[12px] font-medium tracking-wide text-white/95 backdrop-blur-md transition-colors hover:bg-black/55 [-webkit-tap-highlight-color:transparent]"
            aria-label={playing ? '暂停' : '播放'}
          >
            {playing ? '暂停' : '播放'}
          </button>
          <button
            type="button"
            onClick={() => setMuted((m) => !m)}
            className="inline-flex items-center gap-2 rounded-full bg-black/40 px-3.5 py-2 text-[12px] font-medium tracking-wide text-white/95 backdrop-blur-md transition-colors hover:bg-black/55 [-webkit-tap-highlight-color:transparent]"
            aria-label={muted ? '开启声音' : '静音'}
          >
            {muted ? '开声' : '静音'}
          </button>
        </div>
      </div>

      {(kicker || title || body) && (
        <figcaption className="mt-5 max-w-2xl">
          {kicker ? (
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#ffb089]">{kicker}</p>
          ) : null}
          {title ? (
            <h2 className="mt-2 font-display text-2xl font-semibold text-[#fff6ef]">{title}</h2>
          ) : null}
          {body ? <p className="mt-2 text-sm leading-relaxed text-[#d7c2b4]">{body}</p> : null}
        </figcaption>
      )}
    </figure>
  )
}
