import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'

type NavItem = { id: string; label: string }

type Props = {
  items: NavItem[]
  desktopLinkClassName: string
  panelClassName: string
  mobileLinkClassName: string
  /** 小屏右上角菜单按钮 */
  menuButtonClassName: string
  /** 小屏展开的章节列表外层圆角卡片 */
  mobileFrameClassName: string
}

/** 专题页：桌面锚点横向；小屏汉堡菜单避免导航挤出视口。 */
export function ResponsiveAnchorNav({
  items,
  desktopLinkClassName,
  panelClassName,
  mobileLinkClassName,
  menuButtonClassName,
  mobileFrameClassName,
}: Props) {
  const [open, setOpen] = useState(false)

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [open])

  return (
    <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
      <nav
        aria-label="章节"
        className="hidden gap-1 overflow-x-auto md:flex md:flex-1 md:justify-end"
      >
        {items.map((n) => (
          <a key={n.id} href={`#${n.id}`} className={`shrink-0 ${desktopLinkClassName}`} onClick={close}>
            {n.label}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className={`relative z-[60] inline-flex size-11 shrink-0 items-center justify-center rounded-full border backdrop-blur-sm transition-colors [-webkit-tap-highlight-color:transparent] md:hidden ${menuButtonClassName}`}
        aria-expanded={open}
        aria-controls="responsive-anchor-panel"
        aria-label={open ? '关闭章节菜单' : '打开章节菜单'}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="sr-only">{open ? '关闭菜单' : '菜单'}</span>
        <span className="flex w-5 flex-col gap-1.5" aria-hidden>
          <motion.span
            className="h-0.5 w-full origin-center rounded-full bg-current opacity-90"
            animate={open ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
          />
          <motion.span
            className="h-0.5 w-full rounded-full bg-current opacity-90"
            animate={open ? { opacity: 0, x: -4 } : { opacity: 1, x: 0 }}
          />
          <motion.span
            className="h-0.5 w-full origin-center rounded-full bg-current opacity-90"
            animate={open ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
          />
        </span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="responsive-anchor-panel"
            className={`fixed inset-0 z-[55] pb-[env(safe-area-inset-bottom)] pt-14 md:hidden ${panelClassName}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              type="button"
              className="absolute inset-0 cursor-default [-webkit-tap-highlight-color:transparent]"
              aria-label="关闭菜单遮罩"
              onClick={close}
            />
            <motion.nav
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              aria-label="章节列表"
              className={`relative mx-4 mt-2 flex flex-col rounded-2xl border p-4 shadow-xl backdrop-blur-xl ${mobileFrameClassName}`}
              onClick={(e) => e.stopPropagation()}
            >
              {items.map((n) => (
                <a key={n.id} href={`#${n.id}`} className={mobileLinkClassName} onClick={close}>
                  {n.label}
                </a>
              ))}
            </motion.nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
