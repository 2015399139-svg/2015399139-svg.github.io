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
  /** 首页展片里并排对比的封面组。 */
  coverSet?: string[]
  /** 首页展片里循环播放。静音。 */
  coverVideo?: string
  /** 专题页只放成片，跳过灵感与过程。 */
  filmOnly?: boolean
  film?: {
    src: string
    poster?: string
    title: string
    body: string
    kicker?: string
  }
  inspiration?: StudioFrame
  process?: StudioFrame[]
  outcome?: StudioFrame[]
  /** 过程区的小节名。缺省是「过程」。 */
  processKicker?: string
  /** 完成区的小节名。缺省是「完成」。 */
  outcomeKicker?: string
  /** 可在网页里旋转、拉近的 glTF / GLB。 */
  modelSrc?: string
  modelPoster?: string
}

/** 支持 `file.jpg?v=2` 缓存戳；查询串不会写进文件路径。 */
const img = (file: string) => {
  const q = file.indexOf('?')
  const name = q === -1 ? file : file.slice(0, q)
  const stamp = q === -1 ? '' : file.slice(q)
  return `${publicAsset(`images/projects/studio/${name}`)}${stamp}`
}

const vid = (file: string) => publicAsset(`video/${file}`)

export const studioPieces: StudioPiece[] = [
  {
    slug: 'water-garden',
    title: '水岸庭院',
    discipline: '渲染',
    desc: '从 Blender 场景导出的可交互预览。拖动环顾，滚轮拉近。',
    tags: ['Blender', '场景', '可交互'],
    accent: 'from-[#7eb8d4]/40 to-[#fd2601]/20',
    year: '2026',
    role: '场景与预览',
    medium: 'Blender · 实时预览',
    summary: '江南水岸庭院。网页里直接转、拉、看结构。拖动手感来自同一份 Blend 文件。',
    cover: img('blend-7277.jpg?v=3'),
    modelSrc: `${publicAsset('models/blend-7277.glb')}?v=dark2`,
    modelPoster: img('blend-7277.jpg?v=3'),
    inspiration: {
      src: img('blend-7277.jpg?v=3'),
      title: '先把院子摆进光里',
      body: '亭、桥、水岸和白墙压在同一套天光下。网页预览保留机位，可自己走近。',
    },
    process: [
      {
        src: img('blend-7277.jpg?v=3'),
        title: '场景进浏览器',
        body: 'Blend 不能直接上网页。导出 glTF，贴图压过，保留可转的结构。',
      },
    ],
    outcome: [
      {
        src: img('blend-7277.jpg?v=3'),
        title: '可交互成片',
        body: '拖动旋转，滚轮拉近。工牌上是静帧，点开专题是同一座院子。',
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
    medium: '2D / 3D 导图 · 演示视频',
    summary: '源图把笔记和导图放在一处。先按条写下，再连成彩色的枝；要看全局时，同一张图收到三维球面上。下方成片按原比例完整播放。',
    cover: img('yuantu-cover.jpg?v=3'),
    coverSet: [img('yuantu-notes.jpg?v=2'), img('yuantu-board.jpg?v=2'), img('yuantu-sphere.jpg?v=2')],
    filmOnly: true,
    film: {
      src: `${vid('yuantu-demo.mp4')}?v=4`,
      poster: img('yuantu-cover.jpg?v=3'),
      kicker: '成片演示',
      title: '从大纲到球面的一次完整走查',
      body: '同一份想法：大纲、平面导图、节点属性和搜索，再到球面总览。进入专题后自动播放，界面完整入画。',
    },
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
