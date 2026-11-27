import { useId } from 'react'

type MarkProps = {
  className?: string
  title?: string
}

/** 站点标识：首页橙红渐变底 + 奶油色 z，导航与标签页共用。 */
export function SiteMark({ className = 'size-5', title }: MarkProps) {
  const gid = useId().replace(/:/g, '')
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden={title ? undefined : true} role={title ? 'img' : 'presentation'}>
      {title ? <title>{title}</title> : null}
      <defs>
        <linearGradient id={gid} x1="6" y1="2" x2="28" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ff6a2b" />
          <stop offset="0.46" stopColor="#fd2601" />
          <stop offset="1" stopColor="#c41e08" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill={`url(#${gid})`} />
      <rect x="1.15" y="1.15" width="29.7" height="29.7" rx="8" fill="none" stroke="#fff6ef" strokeOpacity="0.22" strokeWidth="1.15" />
      <path
        fill="none"
        stroke="#fff6ef"
        strokeWidth="2.85"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10 10.15h12M10 21.85h12M21.85 10.2 10.15 21.8"
      />
    </svg>
  )
}
