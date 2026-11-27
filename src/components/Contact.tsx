import { motion } from 'framer-motion'
import { profile, publicAsset } from '../data/profile'

const resumeHref = publicAsset('resume.pdf')
const wechatQr = publicAsset('images/wechat-qr-mark.png')
const wechatAvatar = publicAsset('images/wechat-avatar.jpg')

export function Contact() {
  return (
    <section
      id="contact"
      className="relative z-[2] scroll-mt-28 overflow-hidden bg-[#140a07] px-5 pb-28 pt-6 md:px-10 md:pb-32 md:pt-10 lg:px-12"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[min(42vh,18rem)] bg-[radial-gradient(ellipse_70%_80%_at_50%_0%,rgba(253,38,1,0.14),transparent_70%)]"
        aria-hidden
      />
      <div className="relative z-[1] mx-auto max-w-[68rem]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[1.35rem] border border-[#fd2601]/20 bg-[#1a0d09] p-6 sm:rounded-[1.65rem] sm:p-9 md:rounded-[2rem] md:p-14"
        >
          <div className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-[#fd2601]/18 blur-[100px]" />
          <span
            aria-hidden
            className="pointer-events-none absolute -bottom-8 left-2 select-none font-anton text-[18vw] leading-none text-white/[0.04] md:text-[7rem]"
          >
            HIRE
          </span>

          <div className="relative grid items-start gap-8 md:grid-cols-[minmax(0,1fr)_13.5rem] md:gap-10 lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-14">
            <div className="max-w-2xl">
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-white/70">
                // Contact
              </p>
              <h2 className="mt-3 font-display text-[1.75rem] font-semibold tracking-[-0.03em] text-[#fff6ef] sm:text-3xl md:text-[2.125rem]">
                有合作或想法？
              </h2>
              <p className="mt-4 text-pretty text-[0.9375rem] leading-[1.72] text-[#d7c2b4] md:text-base">
                扫码加微信，或发邮件、下载简历。微信名「{profile.wechatName}」。
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center">
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex w-full max-w-full items-center justify-center break-all rounded-full bg-[#fd2601] px-5 py-3.5 text-[13px] font-semibold text-white shadow-[0_12px_40px_-16px_rgba(253,38,1,0.9)] transition-[filter,transform] hover:brightness-110 active:scale-[0.98] sm:w-auto sm:px-9"
                >
                  {profile.email}
                </a>
                <a
                  href="#wechat"
                  className="inline-flex w-full items-center justify-center rounded-full border border-white/20 bg-white/[0.04] px-5 py-3.5 text-[13px] font-semibold text-[#fff6ef] transition-colors hover:border-white/40 hover:bg-white/[0.08] active:scale-[0.98] sm:w-auto sm:px-7"
                >
                  扫码加微信
                </a>
                <a
                  href={resumeHref}
                  download={profile.resumeFileName}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white/[0.04] px-5 py-3.5 text-[13px] font-semibold text-[#fff6ef] transition-colors hover:border-white/40 hover:bg-white/[0.08] active:scale-[0.98] sm:w-auto sm:px-7"
                >
                  下载简历
                </a>
              </div>
            </div>

            <figure
              id="wechat"
              className="mx-auto w-full max-w-[13.5rem] shrink-0 scroll-mt-28 md:mx-0 md:max-w-none"
            >
              <div className="rounded-[1.15rem] border border-[#fd2601]/28 bg-[#22140f] p-3.5 shadow-[0_18px_40px_-24px_rgba(80,18,0,0.65)]">
                <div className="mb-3 flex items-center gap-2.5">
                  <img
                    src={wechatAvatar}
                    alt=""
                    width={88}
                    height={88}
                    loading="lazy"
                    decoding="async"
                    className="size-9 shrink-0 rounded-[0.55rem] object-cover"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold tracking-wide text-[#fff6ef]">
                      {profile.wechatName}
                    </p>
                    <p className="mt-0.5 text-[11px] tracking-wide text-[#d7c2b4]">山东 · 德州</p>
                  </div>
                </div>
                <div className="rounded-[0.8rem] bg-[#fff6ef] p-2">
                  <img
                    src={wechatQr}
                    alt={`微信二维码，扫码添加「${profile.wechatName}」`}
                    width={480}
                    height={480}
                    loading="lazy"
                    decoding="async"
                    className="block h-auto w-full mix-blend-multiply"
                  />
                </div>
              </div>
              <figcaption className="mt-3 text-center text-[10px] tracking-[0.18em] text-[#d7c2b4]/80">
                扫码加微信
              </figcaption>
            </figure>
          </div>
        </motion.div>

        <p className="mt-10 pb-[env(safe-area-inset-bottom)] text-center text-[11px] tracking-[0.22em] text-[#d7c2b4]/70 sm:mt-12">
          © {new Date().getFullYear()} {profile.name}
        </p>
      </div>
    </section>
  )
}
