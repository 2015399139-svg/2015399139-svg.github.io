import { motion, useReducedMotion } from 'framer-motion'
import { publicAsset } from '../../data/profile'

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

/** 能力 + 工具：橙英雄区落下后，用四件作品对齐叙事。 */
export function StickyReveal() {
  const reduce = useReducedMotion()

  return (
    <section
      id="motion"
      className="relative scroll-mt-24 bg-gradient-to-b from-[#2a120c] via-[#140a07] to-[#140a07] py-12 md:py-24"
    >
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
              initial={reduce ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: reduce ? 0 : i * 0.05 }}
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
                <div className="overflow-hidden rounded-[1rem] border border-white/10 bg-[#1a0d09]">
                  <img
                    src={step.thumb}
                    alt=""
                    className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <p className="mt-4 font-anton text-sm tracking-[0.16em] text-[#fd2601]">{step.kicker}</p>
                <h3 className="mt-2 font-display text-xl font-semibold tracking-[-0.03em] text-[#fff6ef]">
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
