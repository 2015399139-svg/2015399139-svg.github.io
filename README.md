# 个人作品集网站

React 19 · Vite 8 · TypeScript · Tailwind CSS 4 · Framer Motion · React Router  

纯前端静态站（无后端）。本地改好后 `npm run build`，把 **`dist/`** 发布即可。

---

## 环境

- **Node.js 20+**（推荐 22；与 CI / Netlify 一致）
- **npm**

```bash
npm ci
npm run dev      # 本地开发
npm run build    # 产出 dist/（含 SPA 用的 404.html）
npm run preview  # 预览生产包
```

手机预览：`npm run dev -- --host`

---

## 目录

| 路径 | 说明 |
|------|------|
| `src/` | 页面与组件 |
| `src/data/profile.ts` | 姓名、简介、工具技能、邮箱 |
| `src/data/studio.ts` | 作品与专题素材路径 |
| `public/images/` | 头像与作品图（构建时原样拷贝到 `dist/`） |
| `public/_redirects` | Netlify SPA 回退 |
| `vercel.json` | Vercel SPA 回退 |
| `.github/workflows/deploy-github-pages.yml` | GitHub Pages 自动部署 |

---

## 发布前自检

1. `npm ci && npm run build` 无报错  
2. `npm run preview` 打开后：**首屏在顶部**、图片齐全、`/work/xxx` **刷新不白屏**  
3. 邮箱、文案在 `src/data/profile.ts` / `studio.ts` 已核对  

---

## 部署方式（三选一即可）

### 1. Vercel（推荐，根域名 / 自定义域名都方便）

1. 把本仓库推到 GitHub / GitLab / Bitbucket，或用 Vercel CLI  
2. [vercel.com](https://vercel.com) → Import Project → 选本仓库  
3. Framework 选 Vite，**Build** `npm run build`，**Output** `dist`（`vercel.json` 已处理路由）  
4. 部署完成即得公网链接  

### 2. Netlify

连接仓库后会读 `netlify.toml`。确认：

- Build：`npm run build`
- Publish：`dist`
- SPA 回退：`public/_redirects` → `/* /index.html 200`

### 3. GitHub Pages

1. 推送到 GitHub，仓库 **Settings → Pages → Source** 选 **GitHub Actions**  
2. 推送 `main` / `master` 会跑 `.github/workflows/deploy-github-pages.yml`  
3. **用户主页仓**（`用户名.github.io`）用根路径 `/`；**项目仓**自动用 `/仓库名/`（`VITE_BASE_PATH`）  

本地模拟项目页子路径：

```bash
VITE_BASE_PATH=/你的仓库名/ npm run build
npm run preview
```

---

## 常见问题

| 现象 | 处理 |
|------|------|
| 刷新 `/work/...` 404 | 确认用了本仓库的 Vercel / Netlify / Pages 配置（SPA 回退） |
| 子路径下图片全裂 | 用 GitHub Actions 部署，或手动设对 `VITE_BASE_PATH` 再构建 |
| 打开停在页面中间 | 已关闭浏览器滚动恢复；硬刷新一次即可 |
| 不要用 `file://` 打开 `dist/index.html` | 用 `npm run preview` 或正式部署地址 |

---

## 未使用的方案

- 多页面静态 `about.html`：本站为 SPA  
- jQuery / Bootstrap / Three.js：未使用  
- PHP / 后端接口：无；数据都在 `src/data/`
