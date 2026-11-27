import { motion, useReducedMotion } from 'framer-motion'
import { profile } from '../../data/profile'

const toolkit = [
  {
    tool: 'Cinema 4D',
    craft: '建模与材质',
    note: '产品与场景的体量、光影先在这里立住。',
  },
  {
    tool: 'Blender',
    craft: '场景与预览',
    note: '复杂场景落地，也能直接挂进网页里转。',
  },
  {
    tool: 'After Effects',
    craft: '动效节奏',
    note: '时间轴上的呼吸感，把静态画面写成段落。',
  },
  {
    tool: 'Premiere',
    craft: '剪辑叙事',
    note: '片子的起承转合，音画对齐到一眼可读。',
  },
  {
    tool: 'Photoshop',
    craft: '影像与品牌',
    note: '主视觉、包装与延展共用一套色与线。',
  },
  {
    tool: 'Figma',
    craft: '结构与界面',
    note: '从大纲到球面导图，先把信息关系画清。',
  },
] as const

/** 工具箱索引：纯排版，不和精选作品抢同一套缩略图。 */
export function StickyReveal() {
  const reduce = useReducedMotion()

  return (
    <section
      id="motion"
      className="relative scroll-mt-24 overflow-hidden bg-gradient-to-b from-[#2a120c] via-[#1a0c08] to-[#140a07] py-14 md:py-24"
    >
      <p
        aria-hidden
        className="pointer-events-none absolute -top-4 left-[-2%] select-none font-anton text-[28vw] leading-none text-white/[0.03] md:left-auto md:right-[-3%] md:text-[11rem]"
      >
        KIT
      </p>

      <div className="relative mx-auto max-w-[68rem] px-5 md:px-10 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.2fr)] lg:items-end lg:gap-16">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.45 }}
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-white/55">// Toolkit</p>
            <h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.03em] text-[#fff6ef] md:text-3xl">
              擅长工具
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#d7c2b4] md:text-[0.95rem]">
              日常开着的软件箱。作品在下一节挂着，这里只谈手跟什么工具在一起。
            </p>
            <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2">
              {profile.skills.map((skill) => (
                <li
                  key={skill}
                  className="font-anton text-[0.7rem] tracking-[0.16em] text-[#ffb089]/85"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </motion.div>

          <ol className="min-w-0 border-t border-white/[0.1]">
            {toolkit.map((item, i) => (
              <motion.li
                key={item.tool}
                initial={reduce ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-24px' }}
                transition={{
                  duration: 0.45,
                  delay: reduce ? 0 : i * 0.05,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group grid grid-cols-[auto_1fr] gap-x-4 border-b border-white/[0.08] py-4 sm:grid-cols-[7.5rem_minmax(0,1fr)_minmax(0,1.35fr)] sm:items-baseline sm:gap-x-6 sm:py-5"
              >
                <span className="pt-1 font-anton text-[0.65rem] tracking-[0.2em] text-white/30 sm:pt-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0 sm:contents">
                  <p className="font-anton text-[1.15rem] leading-none tracking-[0.04em] text-[#fff6ef] transition-colors group-hover:text-white sm:text-[1.35rem]">
                    {item.tool}
                  </p>
                  <p className="mt-1.5 text-[11px] tracking-[0.12em] text-[#ffb089]/80 sm:mt-0 sm:justify-self-end sm:text-right">
                    {item.craft}
                  </p>
                </div>
                <p className="col-span-2 mt-2 text-sm leading-relaxed text-[#d7c2b4]/90 sm:col-span-3 sm:mt-2 sm:max-w-xl sm:pl-[calc(7.5rem+1.5rem)]">
                  {item.note}
                </p>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
