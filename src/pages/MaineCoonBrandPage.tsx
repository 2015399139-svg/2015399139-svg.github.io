import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import { useEffect, useRef, type PointerEvent } from 'react'
import { Link } from 'react-router-dom'
import { ResponsiveAnchorNav } from '../components/ResponsiveAnchorNav'
import { maineCoonImages as img } from '../data/profile'

const nav = [
  { id: 'mc-hero', label: '序章' },
  { id: 'mc-identity', label: '主视觉' },
  { id: 'mc-packaging', label: '包装' },
  { id: 'mc-app', label: '应用' },
  { id: 'mc-icon', label: '图标' },
  { id: 'mc-product', label: '产品' },
  { id: 'mc-space', label: '空间' },
]

const values = [
  { en: 'PURE BREED', zh: '纯正血统' },
  { en: 'GENTLE CARE', zh: '温柔呵护' },
  { en: 'NATURAL HEALTH', zh: '自然健康' },
]

function RevealImage({
  src,
  alt,
  delay = 0,
}: {
  src: string
  alt: string
  delay?: number
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={reduce ? false : { clipPath: 'inset(8% 6% 8% 6%)' }}
      whileInView={reduce ? undefined : { clipPath: 'inset(0% 0% 0% 0%)' }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden"
    >
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="block h-auto w-full"
        initial={reduce ? false : { scale: 1.06 }}
        whileInView={reduce ? undefined : { scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.05, delay: delay + 0.05, ease: [0.22, 1, 0.36, 1] }}
      />
    </motion.div>
  )
}

export type MaineCoonBrandPageProps = {
  embedded?: boolean
  onClose?: () => void
}

export function MaineCoonBrandPage({
  embedded = false,
  onClose,
}: MaineCoonBrandPageProps = {}) {
  const reduce = useReducedMotion()
  const heroRef = useRef<HTMLElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const sx = useSpring(mx, { stiffness: 60, damping: 20 })
  const sy = useSpring(my, { stiffness: 60, damping: 20 })
  const sxp = useTransform(sx, [0, 1], [0, 100])
  const syp = useTransform(sy, [0, 1], [0, 100])
  const imgX = useTransform(sx, [0, 1], reduce ? [0, 0] : [14, -14])
  const imgY = useTransform(sy, [0, 1], reduce ? [0, 0] : [10, -10])
  const spotlight = useMotionTemplate`radial-gradient(500px circle at ${sxp}% ${syp}%, rgba(253,38,1,0.14), transparent 68%)`

  const { scrollYProgress } = useScroll(
    embedded ? { container: scrollRef, offset: ['start start', 'end end'] } : undefined,
  )
  const barScale = useTransform(scrollYProgress, [0, 0.15], [0.15, 1])

  useEffect(() => {
    document.documentElement.classList.add('mc-brand-case')
    return () => document.documentElement.classList.remove('mc-brand-case')
  }, [])

  function onHeroMove(e: PointerEvent<HTMLElement>) {
    if (reduce || !heroRef.current) return
    const r = heroRef.current.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width)
    my.set((e.clientY - r.top) / r.height)
  }

  const title = 'Maine Coon'

  const barClass = embedded
    ? 'pointer-events-none sticky top-0 z-40 h-[2px] w-full origin-left bg-[#fd2601]'
    : 'pointer-events-none fixed left-0 top-0 z-40 h-[2px] w-full origin-left bg-[#fd2601]'

  const pageInner = (
    <>
      <motion.div className={barClass} style={{ scaleX: barScale }} />

      <header
        className={
          embedded
            ? 'sticky top-0 z-30 border-b border-[#fd2601]/16 bg-[#140a07]/88 pt-[env(safe-area-inset-top)] backdrop-blur-xl shadow-none'
            : 'sticky top-0 z-30 border-b border-[#fd2601]/16 bg-[#140a07]/88 pt-[env(safe-area-inset-top)] backdrop-blur-xl shadow-none'
        }
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-8">
          {embedded && onClose ? (
            <button
              type="button"
              onClick={onClose}
              className="group inline-flex items-center gap-2 text-sm font-semibold text-[#fff4ec] transition-colors hover:text-white"
            >
              <motion.span
                className="inline-block"
                whileHover={{ x: -3 }}
                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                aria-hidden
              >
                ←
              </motion.span>
              关闭
            </button>
          ) : (
            <Link
              to="/"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-[#fff4ec] transition-colors hover:text-white"
            >
              <motion.span
                className="inline-block"
                whileHover={{ x: -3 }}
                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                aria-hidden
              >
                ←
              </motion.span>
              返回作品集
            </Link>
          )}
          <ResponsiveAnchorNav
            items={nav}
            desktopLinkClassName="whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold tracking-wide text-[#d7c2b4] transition-colors hover:bg-[#fd2601] hover:text-white"
            panelClassName="bg-[#140a07]/55"
            mobileFrameClassName="border-[#fd2601]/25 bg-[#140a07]/95 text-white shadow-2xl"
            mobileLinkClassName="rounded-xl px-4 py-3.5 text-base font-semibold text-white transition-colors active:bg-white/15"
            menuButtonClassName="border-[#fd2601]/30 text-[#fff6ef] bg-[#1e110c]/72"
          />
        </div>
      </header>

      <motion.section
        ref={heroRef}
        id="mc-hero"
        onPointerMove={onHeroMove}
        onPointerLeave={() => {
          mx.set(0.5)
          my.set(0.5)
        }}
        className="relative overflow-hidden bg-gradient-to-b from-[#1a0d09] via-[#140a07] to-[#100705] px-4 pb-20 pt-12 md:px-8 md:pb-28 md:pt-16"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#1a0d09] via-transparent to-[#fd2601]/[0.08]"
          aria-hidden
        />
        {!reduce && (
          <motion.div
            className="pointer-events-none absolute inset-0"
            style={{ background: spotlight }}
            aria-hidden
          />
        )}
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            backgroundImage: `linear-gradient(to right, transparent 0%, rgba(253,38,1,0.08) 50%, transparent 100%)`,
            backgroundSize: '1px 100%',
            backgroundRepeat: 'repeat-x',
          }}
        />

        <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-16">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 text-[11px] font-bold uppercase tracking-[0.38em] text-[#c9b3a4]"
            >
              Brand Landing · 全案
            </motion.p>
            <h1 className="font-display text-4xl font-extrabold leading-[0.95] tracking-tight text-[#fff6ef] sm:text-5xl md:text-7xl lg:text-8xl">
              {title.split('').map((ch, i) => (
                <motion.span
                  key={`${ch}-${i}`}
                  className="inline-block"
                  initial={{ opacity: 0, y: 28, rotate: reduce ? 0 : -2 }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  transition={{
                    delay: 0.06 * i,
                    duration: 0.55,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {ch === ' ' ? '\u00a0' : ch}
                </motion.span>
              ))}
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              className="mt-6 max-w-md text-balance text-lg font-normal leading-relaxed text-[#fff4ec] md:text-xl"
            >
              Majestic by Nature.
              <br />
              Gentle by Heart.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.5 }}
              className="mt-10 flex flex-wrap gap-3"
            >
              <span className="rounded-full border border-[#ffb089]/35 bg-[#1e110c]/95 px-4 py-2 text-xs font-semibold text-[#fff4ec] shadow-sm">
                包装 · 文创 · 数字界面
              </span>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <motion.div
              className="overflow-hidden"
              style={{ x: imgX, y: imgY }}
            >
              <img
                src={img.hero}
                alt="Maine Coon 品牌主视觉"
                className="block h-auto w-full"
              />
            </motion.div>
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -bottom-6 -right-4 h-24 w-24 border border-[#fd2601]/25 md:h-32 md:w-32"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="relative mx-auto mt-16 max-w-6xl overflow-hidden border-y border-[#fd2601]/16 py-3.5 md:mt-24"
        >
          <motion.div
            className="flex w-max gap-12 whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.26em] text-[#c9b3a4]"
            animate={reduce ? undefined : { x: ['0%', '-50%'] }}
            transition={
              reduce ? undefined : { duration: 28, repeat: Infinity, ease: 'linear' }
            }
          >
            {[...Array(2)].map((_, i) => (
              <span key={i}>
                Majestic by Nature · Gentle by Heart · Maine Coon Cat Brand ·
                Packaging & Cultural Creative ·
              </span>
            ))}
          </motion.div>
        </motion.div>
      </motion.section>

      <section
        id="mc-identity"
        className="scroll-mt-24 border-t border-[#fd2601]/16 bg-[#1a0d09] px-4 py-16 md:px-8 md:py-24"
      >
        <div className="mx-auto max-w-6xl">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl font-bold tracking-tight text-[#fff6ef] md:text-4xl"
          >
            品牌基调
          </motion.h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#d7c2b4] md:text-[1.05rem]">
            极简黑白灰与柔和布光，强调缅因猫的高贵气质与温柔性格；标识以侧脸剪影为核心，贯穿包装、应用与空间。
          </p>
          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {values.map((v, i) => (
              <motion.div
                key={v.en}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={reduce ? undefined : { y: -6 }}
                className="group cursor-default border-t border-[#fd2601]/25 py-6"
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#c9b3a4]">
                  {v.en}
                </p>
                <p className="mt-2 font-display text-lg font-bold text-[#fff6ef]">
                  {v.zh}
                </p>
                <div className="mt-4 h-px w-0 bg-[#fd2601] transition-all duration-500 group-hover:w-full" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="mc-packaging"
        className="scroll-mt-24 bg-[#120906] px-4 py-16 md:px-8 md:py-24"
      >
        <div className="mx-auto max-w-6xl">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl font-bold text-[#fff6ef] md:text-4xl"
          >
            包装与文创集合
          </motion.h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#d7c2b4]">
            购物袋、礼盒、杯具与文具共享同一影像与线型语言，形成可陈列的系列感。
          </p>
          <div className="mt-10">
            <RevealImage
              src={img.collection}
              alt="Maine Coon 包装与文创"
              delay={0.05}
            />
            <p className="mt-4 text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-[#c9b3a4]">
              Packaging & Cultural Creative Collection
            </p>
          </div>
        </div>
      </section>

      <section
        id="mc-app"
        className="scroll-mt-24 border-t border-[#fd2601]/16 bg-[#1a0d09] px-4 py-16 md:px-8 md:py-24"
      >
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-3xl font-bold text-[#fff6ef] md:text-4xl">
            移动端体验
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#d7c2b4]">
            玻璃拟态卡片承载品种故事与日常灵感；数据条呈现体重、体长与寿命，底部导航预留社区与画廊扩展。
          </p>
          <div className="mt-10 max-w-4xl">
            <RevealImage src={img.app} alt="Maine Coon 移动应用界面" />
          </div>
        </div>
      </section>

      <section
        id="mc-icon"
        className="scroll-mt-24 border-t border-[#fd2601]/16 bg-[#120906] px-4 py-16 md:px-8 md:py-24"
      >
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-3xl font-bold text-[#fff6ef] md:text-4xl">
            图标与网格
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#d7c2b4]">
            从写真到几何圆切，规范耳簇、头型、眼部留白与颈毛流线；标注最小 16px / 24px 与反白应用。
          </p>
          <div className="mt-10">
            <RevealImage src={img.icon} alt="Maine Coon 图标拆解" delay={0.08} />
          </div>
        </div>
      </section>

      <section
        id="mc-product"
        className="scroll-mt-24 border-t border-[#fd2601]/16 bg-gradient-to-b from-[#1a0d09] to-[#140a07] px-4 py-16 md:px-8 md:py-24"
      >
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-3xl font-bold text-[#fff6ef] md:text-4xl">
            Premium Cat Food
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#d7c2b4]">
            真鸡首料、被毛健康与心关节呵护三大利益点；自立袋与礼盒双规格，适配全生命阶段说明。
          </p>
          <div className="mt-10">
            <RevealImage src={img.food} alt="Maine Coon 猫粮包装" />
          </div>
        </div>
      </section>

      <section
        id="mc-space"
        className="scroll-mt-24 border-t border-[#fd2601]/16 bg-[#1a0d09] px-4 py-16 md:px-8 md:py-24"
      >
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-3xl font-bold text-[#fff6ef] md:text-4xl">
            线下空间概念
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#d7c2b4]">
            门头背光、侧招与室内画框共同强化影像叙事；暖光与留白营造可步入的品牌氛围。
          </p>
          <div className="mt-10">
            <RevealImage src={img.store} alt="Maine Coon 门店概念" delay={0.06} />
          </div>
        </div>
      </section>

      <footer className="border-t border-[#fd2601]/16 bg-gradient-to-b from-[#1e110c] to-[#140a07] px-4 py-16 md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="font-display text-2xl font-bold text-[#fff6ef]">
              Maine Coon
            </p>
            <p className="mt-2 text-sm font-medium leading-relaxed text-[#c9b3a4]">
              品牌落地页专题 · 黑白影像与极简字体
            </p>
          </div>
          {embedded && onClose ? (
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-2 rounded-full bg-[#fd2601] px-8 py-3.5 text-sm font-semibold text-white shadow-xl transition-colors hover:bg-[#e02200]"
              >
                回到精选作品
              </button>
            </motion.div>
          ) : (
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-full bg-[#fd2601] px-8 py-3.5 text-sm font-semibold text-white shadow-xl transition-colors hover:bg-[#e02200]"
              >
                返回作品集主页
              </Link>
            </motion.div>
          )}
        </div>
      </footer>
    </>
  )

  return (
    <div
      className={
        embedded
          ? 'relative flex min-h-0 max-h-full min-w-0 flex-1 flex-col overflow-hidden bg-transparent text-[#fff6ef] antialiased'
          : 'relative min-h-svh bg-gradient-to-b from-[#140a07] via-[#140a07] to-[#100705] text-[#fff6ef] antialiased'
      }
    >
      {embedded ? (
        <div
          ref={scrollRef}
          className="relative min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain"
        >
          {pageInner}
        </div>
      ) : (
        pageInner
      )}
    </div>
  )
}
