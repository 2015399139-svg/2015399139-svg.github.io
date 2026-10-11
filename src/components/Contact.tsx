import { motion } from 'framer-motion'
import { profile } from '../data/profile'

export function Contact() {
  return (
    <section
      id="contact"
      className="relative z-[2] bg-[#140a07] px-5 pb-28 pt-6 md:px-10 md:pb-32 md:pt-10 lg:px-12"
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

          <div className="relative max-w-2xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-white/70">
              // Contact
            </p>
            <h2 className="mt-3 font-display text-[1.75rem] font-semibold tracking-[-0.03em] text-[#fff6ef] sm:text-3xl md:text-[2.125rem]">
              有合作或想法？
            </h2>
            <p className="mt-4 text-pretty text-[0.9375rem] leading-[1.72] text-[#d7c2b4] md:text-base">
              欢迎发邮件。微信或 QQ 可在邮件里留下，我收到后回复。
            </p>
            <a
              href={`mailto:${profile.email}`}
              className="mt-8 inline-flex w-full max-w-full items-center justify-center break-all rounded-full bg-[#fd2601] px-5 py-3.5 text-[13px] font-semibold text-white transition-[filter,transform] hover:brightness-110 active:scale-[0.98] sm:mt-10 sm:w-auto sm:px-9"
            >
              {profile.email}
            </a>
          </div>
        </motion.div>

        <p className="mt-10 pb-[env(safe-area-inset-bottom)] text-center text-[11px] tracking-[0.22em] text-[#d7c2b4]/70 sm:mt-12">
          © {new Date().getFullYear()} {profile.name}
        </p>
      </div>
    </section>
  )
}
