import { motion } from 'framer-motion'
import type { FC, ReactNode } from 'react'
import { studioPieceByPath } from '../../data/studio'
import { MaineCoonBrandPage } from '../../pages/MaineCoonBrandPage'
import { StudioPiecePage } from '../../pages/StudioPiecePage'

type BackdropProps = { reduce: boolean | null }

/** 全站专题：与首页同一暖色轴 */
function WarmCaseStudyBackdrop({ reduce }: BackdropProps) {
  return (
    <>
      <div className="absolute inset-0 bg-[#140a07]" />
      {!reduce ? (
        <>
          <motion.div
            className="absolute -left-[18%] -top-[22%] h-[min(90%,420px)] w-[min(80%,380px)] rounded-full bg-[#fd2601]/20 blur-[100px]"
            animate={{ x: [0, 24, -8, 0], y: [0, 16, 4, 0], opacity: [0.45, 0.7, 0.5, 0.45] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute -bottom-[18%] -right-[10%] h-[min(80%,380px)] w-[min(70%,340px)] rounded-full bg-[#f37e1c]/18 blur-[100px]"
            animate={{ x: [0, -18, 10, 0], y: [0, -12, 6, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          />
        </>
      ) : null}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_-8%,rgba(253,38,1,0.16),transparent_58%)]" />
    </>
  )
}

export const CASE_STUDY_MODAL_PATHS = ['/work/maine-coon-brand'] as const

export type CaseStudyModalPath = (typeof CASE_STUDY_MODAL_PATHS)[number]

export type ModalBackdropProps = { reduce: boolean | null }

export function isCaseStudyModalPath(p: string | undefined): p is CaseStudyModalPath {
  return !!p && ((CASE_STUDY_MODAL_PATHS as readonly string[]).includes(p) || !!studioPieceByPath(p))
}

export type CaseStudyModalShell = {
  border: string
  shadow: string
  baseTint: string
  Backdrop: FC<ModalBackdropProps>
}

const shells: Record<CaseStudyModalPath, CaseStudyModalShell> = {
  '/work/maine-coon-brand': {
    border: 'border-transparent',
    shadow: 'shadow-none',
    baseTint: 'bg-[#140a07]',
    Backdrop: WarmCaseStudyBackdrop,
  },
}

const studioShell: CaseStudyModalShell = {
  border: 'border-transparent',
  shadow: 'shadow-none',
  baseTint: 'bg-[#140a07]',
  Backdrop: WarmCaseStudyBackdrop,
}

export function caseStudyModalShellFor(path: string): CaseStudyModalShell {
  if (path in shells) return shells[path as CaseStudyModalPath]
  return studioShell
}

export function CaseStudyModalPage({
  path,
  onClose,
}: {
  path: string
  onClose: () => void
}): ReactNode {
  if (path === '/work/maine-coon-brand') {
    return <MaineCoonBrandPage embedded onClose={onClose} />
  }
  const piece = studioPieceByPath(path)
  if (piece) return <StudioPiecePage piece={piece} embedded onClose={onClose} />
  return null
}
