import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { type PortfolioProject } from '../data/profile'
import {
  CaseStudyModalPage,
  caseStudyModalShellFor,
  isCaseStudyModalPath,
} from './projects/CaseStudyModal'
import { WorkStage } from './effects/WorkStage'

export function Projects() {
  const [modalProject, setModalProject] = useState<PortfolioProject | null>(null)
  const reduceModalMotion = useReducedMotion()

  useEffect(() => {
    if (!modalProject) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModalProject(null)
    }
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [modalProject])

  const path =
    modalProject?.caseStudyModal && isCaseStudyModalPath(modalProject.caseStudyPath)
      ? modalProject.caseStudyPath
      : null
  const shell = path ? caseStudyModalShellFor(path) : null
  const ModalBackdrop = shell?.Backdrop

  const modalLayer = (
    <AnimatePresence>
      {path && shell && ModalBackdrop ? (
        <motion.div
          key={`case-modal-${path}`}
          role="presentation"
          className="fixed inset-0 z-[200] bg-[#140a07]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="case-study-dialog-title"
            className="relative flex h-full w-full flex-col overflow-hidden bg-[#140a07]"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
              <ModalBackdrop reduce={reduceModalMotion} />
            </div>
            <div className="relative z-[1] flex min-h-0 min-w-0 flex-1 flex-col">
              <span id="case-study-dialog-title" className="sr-only">
                {modalProject?.title}
              </span>
              <CaseStudyModalPage path={path} onClose={() => setModalProject(null)} />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )

  return (
    <section id="work" className="relative z-[2] bg-[#140a07]">
      {typeof document !== 'undefined' ? createPortal(modalLayer, document.body) : null}
      <WorkStage onOpen={setModalProject} />
    </section>
  )
}
