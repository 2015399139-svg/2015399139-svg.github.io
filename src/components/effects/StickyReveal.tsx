import { motion, useReducedMotion } from 'framer-motion'
import { profile, publicAsset } from '../../data/profile'

const steps = [
  {
    kicker: '01',
    title: '渲染质感',
    body: '同一网格换材质。白瓷、玻璃和金属留在同一套暖光里。',
    tools: 'Cinema 4D · Blender',
    thumb: publicAsset('images/projects/studio/cup-ceramic.jpg'),
  },
  {
    kicker: '02',
    title: '软件结构',
    body: '想法先写成大纲，再铺成导图，必要时收到球面上总览。',
    tools: 'Figma · 产品设计',
    thumb: publicAsset('images/projects/studio/yuantu-cover.jpg'),
  },
  {
    kicker: '03',
    title: '品牌系统',
    body: '标志、包装、应用和门店共用一条影像与线型语言。',
    tools: 'Photoshop · 品牌系统',
    thumb: publicAsset('images/projects/studio/maine-cover.jpg'),
  },
  {
    kicker: '04',
    title: '插画观察',
    body: '城市里几处停一下的地方。墨色为主，一点橘红作语气。',
    tools: '手绘 · 插画',
    thumb: publicAsset('images/projects/studio/illu-bus.jpg'),
  },
] as const

const ticker = [...profile.tools, ...profile.skills, ...profile.tools, ...profile.skills]

/** 能力 + 工具：橙英雄区落下后，用四件作品对齐叙事。 */
export function StickyReveal() {
  const reduce = useReducedMotion()

  return (
    <section
      id="motion"
      className="relative scroll-mt-24 overflow-hidden bg-gradient-to-b from-[#2a120c] via-[#140a07] to-[#140a07] py-12 md:py-24"
    >
      <p
        aria-hidden
        className="pointer-events-none absolute -top-6 right-[-4%] select-none font-anton text-[22vw] leading-none text-white/[0.035] md:text-[9rem]"
      >
        TOOLS
      </p>

      <div className="relative mb-10 overflow-hidden border-y border-white/[0.06] py-3 md:mb-14">
        <div className={`flex w-max gap-10 pr-10 ${reduce ? '' : 'marquee-track'}`}>
          {ticker.map((item, i) => (
            <span
              key={`${item}-${i}`}
              className="font-anton text-sm tracking-[0.18em] text-white/35 sm:text-base"
            >
              {item}
              <span className="ml-10 text-[#fd2601]/70">✱</span>
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[68rem] px-5 md:px-10 lg:px-12">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45 }}
          className="max-w-xl"
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-white/55">// Tools</p>
          <h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.03em] text-[#fff6ef] md:text-3xl">
            擅长工具
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#d7c2b4] md:text-[0.95rem]">
            和下面作品一一对应。软件跟手艺走，点进专题看完整过程。
          </p>
        </motion.div>

        <ol className="mt-8 grid gap-8 sm:mt-10 sm:grid-cols-2 sm:gap-10 lg:grid-cols-4 lg:gap-8">
          {steps.map((step, i) => (
            <motion.li
              key={step.title}
              initial={reduce ? false : { opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, delay: reduce ? 0 : i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="min-w-0"
            >
              <a
                href="#work"
                className="group block outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ffb089]"
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                <div className="relative overflow-hidden rounded-[1rem] bg-[#1a0d09] ring-1 ring-white/10">
                  <img
                    src={step.thumb}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                  />
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#140a07]/55 to-transparent opacity-80" />
                  <span className="shine-sweep pointer-events-none absolute inset-0" />
                  <span className="absolute left-3 top-3 font-anton text-sm tracking-[0.14em] text-white/90">
                    {step.kicker}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-xl font-semibold tracking-[-0.03em] text-[#fff6ef] transition-colors group-hover:text-white">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#d7c2b4]">{step.body}</p>
                <p className="mt-3 text-[11px] tracking-[0.08em] text-white/45">{step.tools}</p>
              </a>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}
