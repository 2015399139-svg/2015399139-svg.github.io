export const profile = {
  name: '朱成斌',
  tagline: '全栈开发 · 动效与界面设计',
  bio: '我专注于把复杂的想法做成顺滑、可感知的数字体验。这里是我精选的项目与实验性动效展示。',
  email: '201539913@qq.com',
  wechatName: '生活在树上',
  resumeFileName: '朱成斌-简历.pdf',
  tools: ['Cinema 4D', 'Blender', 'After Effects', 'Premiere', 'Photoshop', 'Figma'] as const,
  skills: ['3D 渲染', '动效设计', '品牌视觉', '产品设计', '插画'] as const,
  links: [] as { label: string; href: string }[],
}

/** 本地资源（对应 `public/`）。勿把 `?v=` 写进 path，缓存戳请在调用处拼接。 */
export function publicAsset(path: string) {
  const cleaned = path.replace(/^\//, '').split('?')[0] ?? ''
  // 开发服务器始终以 `/` 提供 public，用绝对路径可避免 base: './' 下偶发加载失败
  if (import.meta.env.DEV) {
    return `/${cleaned}`
  }
  const base = import.meta.env.BASE_URL
  // base 为 `./` 时，在子路由（如 /work/...）下会变成「相对当前路径」，导致 public 资源 404
  if (base === './' || base === '.' || base === '') {
    return `/${cleaned}`
  }
  return base.endsWith('/') ? `${base}${cleaned}` : `${base}/${cleaned}`
}

export type PortfolioProject = {
  title: string
  desc: string
  tags: string[]
  accent: string
  /** 演示视频；与 coverImage 二选一或并存（并存时以视频为主，封面可作 poster） */
  videoSrc?: string
  /** 静态封面 / 纯图片作品 */
  coverImage?: string
  poster?: string
  href?: string
  /** 站内案例页路径（如 Maine Coon 专题） */
  caseStudyPath?: string
  /** 首页点击时以弹层卡片打开专题（仍保留 caseStudyPath 直达链接） */
  caseStudyModal?: boolean
}

/** 首页精选作品在 `src/data/studio.ts`。 */

/** Maine Coon 品牌专题 · 图 */
export const maineCoonImages = {
  hero: publicAsset('images/projects/maine-coon/hero-key-visual.jpg'),
  collection: publicAsset('images/projects/maine-coon/collection-packaging.jpg'),
  app: publicAsset('images/projects/maine-coon/mobile-app-ui.jpg'),
  icon: publicAsset('images/projects/maine-coon/icon-guidelines.jpg'),
  food: publicAsset('images/projects/maine-coon/packaging-cat-food.jpg'),
  store: publicAsset('images/projects/maine-coon/storefront-space.jpg'),
}
