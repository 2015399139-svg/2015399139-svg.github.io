import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

/** 生产环境部署与子路径：`VITE_BASE_PATH`（见 README.md、.github/workflows/deploy-github-pages.yml） */
function normalizeBase(raw: string | undefined): string {
  if (raw === undefined || raw === '' || raw === '/' || raw === '.') return '/'
  const withLead = raw.startsWith('/') ? raw : `/${raw}`
  return withLead.endsWith('/') ? withLead : `${withLead}/`
}

// https://vite.dev/config/
export default defineConfig({
  base: normalizeBase(process.env.VITE_BASE_PATH),
  plugins: [tailwindcss(), react()],
  server: {
    // 启动后打开系统默认浏览器（本机终端运行 npm run dev 时生效）
    open: true,
    // 需要手机/局域网预览时在终端执行：npm run dev -- --host
  },
})
