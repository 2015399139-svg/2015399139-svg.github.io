import { maineCoonImages, publicAsset, type PortfolioProject } from './profile'

export type StudioFrame = {
  src: string
  title: string
  body: string
  /** 有成片时，src 作封面，点播放看整支。 */
  video?: string
}

export type StudioPiece = {
  slug: string
  title: string
  discipline: string
  desc: string
  tags: string[]
  accent: string
  year: string
  role: string
  medium: string
  summary: string
  cover: string
  /** 首页展片里并排对比的封面组（如三种材质）。 */
  coverSet?: string[]
  /** 首页展片里循环播放。静音。 */
  coverVideo?: string
  /** 专题页只放成片，跳过灵感与过程。 */
  filmOnly?: boolean
  inspiration?: StudioFrame
  process?: StudioFrame[]
  outcome?: StudioFrame[]
  /** 过程区的小节名。缺省是「过程」。 */
  processKicker?: string
  /** 完成区的小节名。缺省是「完成」。 */
  outcomeKicker?: string
}

/** 支持 `file.jpg?v=2` 缓存戳；查询串不会写进文件路径。 */
const img = (file: string) => {
  const q = file.indexOf('?')
  const name = q === -1 ? file : file.slice(0, q)
  const stamp = q === -1 ? '' : file.slice(q)
  return `${publicAsset(`images/projects/studio/${name}`)}${stamp}`
}

export const studioPieces: StudioPiece[] = [
  {
    slug: 'daily-cup',
    title: '每日马克杯',
    discipline: '渲染',
    desc: '家里每天用的一只杯子。同一套模型，外壳换成白瓷、磨砂玻璃和不锈钢。',
    tags: ['统一建模', '杯子', '材质'],
    accent: 'from-[#e7e1da]/50 to-[#8a8178]/25',
    year: '2026',
    role: '造型、材质',
    medium: '同一网格 · 三种材质',
    summary: '马克杯只有一套模型。先握住高度和把手，灰模锁住轮廓，再只换材质：白瓷、磨砂玻璃、不锈钢。',
    cover: img('cup-ceramic.jpg'),
    coverSet: [img('cup-ceramic.jpg'), img('cup-glass.jpg'), img('cup-steel.jpg')],
    inspiration: {
      src: img('cup-ceramic.jpg'),
      title: '先是一只能握住的杯子',
      body: '直筒、一个把手、喝水的高度。不加图案，杯子先要能天天用。',
    },
    process: [
      {
        src: img('cup-clay.jpg'),
        title: '灰模先锁住外形',
        body: '不指定材质。杯口、杯壁和把手的位置先对齐，后面三种材质都用这一套。',
      },
      {
        src: img('cup-materials.svg'),
        title: '网格不动，只换材料',
        body: '白瓷、磨砂玻璃、不锈钢共用同一条杯口和同一只把手。',
      },
    ],
    outcome: [
      {
        src: img('cup-ceramic.jpg'),
        title: '白瓷',
        body: '早上喝水的那一只。表面有一点颗粒，光是软的。',
      },
      {
        src: img('cup-glass.jpg'),
        title: '磨砂玻璃',
        body: '同一只杯子换成磨砂玻璃。能看见里面，把手还在原来的位置。',
      },
      {
        src: img('cup-steel.jpg'),
        title: '不锈钢',
        body: '拉丝不锈钢。轮廓、机位和把手都与白瓷那一版对齐。',
      },
    ],
  },
  {
    slug: 'yuan-tu',
    title: '源图',
    discipline: '软件设计',
    desc: '能记笔记的头脑风暴导图。同一份想法，可以写成大纲、铺在平面上，再转到球面上。',
    tags: ['导图', '笔记', '三维'],
    accent: 'from-[#1a1208]/80 to-[#e6b325]/35',
    year: '2026',
    role: '产品与界面',
    medium: '2D / 3D 导图',
    summary: '源图把笔记和导图放在一处。先按条写下，再连成彩色的枝；要看全局时，同一张图收到三维球面上。',
    cover: img('yuantu-cover.jpg?v=3'),
    coverSet: [img('yuantu-notes.jpg?v=2'), img('yuantu-board.jpg?v=2'), img('yuantu-sphere.jpg?v=2')],
    inspiration: {
      src: img('yuantu-notes.jpg?v=2'),
      title: '先按条写下来',
      body: '十二个主题排在大纲里。市场分析、技术架构、用户体验各占一行，颜色已经标好，还没有连线。',
    },
    process: [
      {
        src: img('yuantu-board.jpg?v=2'),
        title: '摊成一张导图',
        body: '同一份大纲走到画面中央。枝按颜色分开，线上写着调研、支撑、视觉。左侧笔记还在，改一条，图跟着动。',
      },
      {
        src: img('yuantu-inspector.jpg?v=2'),
        title: '颜色、权重和线长',
        body: '选中节点就能改。权重决定它有多显眼，线长决定它离中心多远。图片、视频和文件可以挂在节点上。',
      },
      {
        src: img('yuantu-search.jpg?v=2'),
        title: '在图里找一句',
        body: '搜「市场」，市场分析和市场运营同时亮起来。没被搜到的枝退到后面。',
      },
    ],
    outcome: [
      {
        src: img('yuantu-light.jpg?v=2'),
        title: '换到白天',
        body: '深色和浅色是同一张图。节点、连线和笔记都还在，只是纸色换了。',
      },
      {
        src: img('yuantu-sphere.jpg?v=2'),
        title: '收到球面上',
        body: '平面上的枝转到三维。中心还是同一个主题，节点贴在网面上，可以转着看。',
      },
    ],
  },
  {
    slug: 'maine-coon-brand',
    title: '缅因猫舍',
    discipline: '品牌',
    desc: '侧脸剪影是标志。黑白影像从包装、应用到门店用同一套。',
    tags: ['标识', '包装', '空间'],
    accent: 'from-[#f4f1ec]/80 to-[#2a2a2a]/40',
    year: '2026',
    role: '品牌全案',
    medium: '标识 · 包装 · 应用 · 空间',
    summary:
      '极简黑白灰与柔和布光，强调缅因猫的高贵气质与温柔性格。标识以侧脸剪影为核心，贯穿包装、应用与空间。',
    cover: img('maine-cover.jpg?v=2'),
    coverSet: [maineCoonImages.hero, maineCoonImages.collection, maineCoonImages.store],
    inspiration: {
      src: maineCoonImages.hero,
      title: '侧脸剪影',
      body: '标志从写真的侧脸收成剪影。店名下面两行：Majestic by Nature. Gentle by Heart.',
    },
    processKicker: '创作',
    process: [
      {
        src: maineCoonImages.icon,
        title: '从图收到圆里',
        body: '耳簇、头型、眼部留白和颈毛流线先定下来，再切成图标。最小用到 16px 和 24px，反白也能用。',
      },
    ],
    outcomeKicker: '落地',
    outcome: [
      {
        src: maineCoonImages.collection,
        title: '包装与文创',
        body: '购物袋、礼盒、杯具和文具共用同一张影像和同一条线。',
      },
      {
        src: maineCoonImages.food,
        title: '猫粮',
        body: '自立袋和礼盒。真鸡、被毛和心关节写在正面，规格按全生命阶段。',
      },
      {
        src: maineCoonImages.app,
        title: '应用',
        body: '品种故事放在玻璃卡片上。体重、体长和寿命用数据条，底下留社区和画廊。',
      },
      {
        src: maineCoonImages.store,
        title: '门店',
        body: '门头背光，侧招和室内画框用同一张侧脸。暖光，留白。',
      },
    ],
  },
  {
    slug: 'passing-by',
    title: '路过',
    discipline: '插画',
    desc: '城市里五处停一下的地方。同一套墨色和一点橘红，雨天、早市、车厢、天台和桌面。',
    tags: ['插画', '城市', '系列'],
    accent: 'from-[#f4ebe2]/55 to-[#fd2601]/20',
    year: '2026',
    role: '插画',
    medium: '系列 · 五幅',
    summary:
      '路过不写故事结局。巴士站、蒸笼窗、空车厢、天台衣架和咖啡馆桌面，用同一套墨色和一点橘红画完。',
    cover: img('illu-bus.jpg'),
    coverSet: [img('illu-bus.jpg'), img('illu-bakery.jpg'), img('illu-metro.jpg')],
    inspiration: {
      src: img('illu-table.jpg'),
      title: '先记在纸上',
      body: '本子摊开，街角先被画成几条线。咖啡还剩一半，火柴横在旁边。',
    },
    processKicker: '分幅',
    process: [
      {
        src: img('illu-bakery.jpg'),
        title: '早市的窗',
        body: '蒸汽、两笼包子和一只纸杯。车轮只露半边，窗光是一块奶油色。',
      },
      {
        src: img('illu-metro.jpg'),
        title: '空车厢',
        body: '橘色座位排成几何形。一个人靠门看书，窗外一条霓虹。',
      },
      {
        src: img('illu-roof.jpg'),
        title: '天台',
        body: '三件衣服和一条围巾。下面是叠起来的屋顶，远处一盏灯。',
      },
    ],
    outcomeKicker: '成套',
    outcome: [
      {
        src: img('illu-bus.jpg'),
        title: '雨里等车',
        body: '圆灯、透明伞、短斜线画的雨。城市压成几层剪影。',
      },
    ],
  },
]


export function studioPieceBySlug(slug: string | undefined) {
  return studioPieces.find((piece) => piece.slug === slug)
}

export function studioPieceByPath(path: string | undefined) {
  if (!path?.startsWith('/work/')) return undefined
  return studioPieceBySlug(path.slice('/work/'.length))
}

export const studioProjects: PortfolioProject[] = studioPieces.map((piece) => ({
  title: piece.title,
  desc: piece.desc,
  tags: piece.tags,
  accent: piece.accent,
  coverImage: piece.cover,
  caseStudyPath: `/work/${piece.slug}`,
  caseStudyModal: true,
}))
