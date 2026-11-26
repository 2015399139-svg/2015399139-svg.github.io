import { Link } from 'react-router-dom'
import { ShowcaseFilm } from '../components/bits/ShowcaseFilm'
import type { StudioFrame, StudioPiece } from '../data/studio'

function Frame({ frame, kicker }: { frame: StudioFrame; kicker: string }) {
  return (
    <figure>
      {frame.video ? (
        <video
          src={frame.video}
          poster={frame.src}
          controls
          playsInline
          preload="metadata"
          className="aspect-[16/10] w-full bg-black object-contain"
        />
      ) : (
        <img src={frame.src} alt="" className="w-full bg-[#1a0d09] object-cover" />
      )}
      <figcaption className="mt-4 max-w-2xl">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#ffb089]">{kicker}</p>
        <h2 className="mt-2 font-display text-2xl font-semibold text-[#fff6ef]">{frame.title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-[#d7c2b4]">{frame.body}</p>
      </figcaption>
    </figure>
  )
}

export function StudioPiecePage({
  piece,
  embedded = false,
  onClose,
}: {
  piece: StudioPiece
  embedded?: boolean
  onClose?: () => void
}) {
  return (
    <article className="h-full overflow-y-auto bg-[#140a07] text-[#fff6ef]">
      <header className="sticky top-0 z-20 flex items-center justify-between gap-4 bg-[#140a07]/80 px-5 py-4 backdrop-blur-xl md:px-10">
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#ffb089]">
          {piece.discipline}
          <span className="ml-3 text-white/50">{piece.year}</span>
        </p>
        {embedded && onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/15 px-4 py-1.5 text-[12px] tracking-[0.16em] text-white transition-colors hover:bg-white hover:text-[#fd2601]"
          >
            关闭
          </button>
        ) : (
          <Link
            to="/"
            className="rounded-full border border-white/15 px-4 py-1.5 text-[12px] tracking-[0.16em] text-white transition-colors hover:bg-white hover:text-[#fd2601]"
          >
            返回
          </Link>
        )}
      </header>

      <div className="mx-auto max-w-[68rem] px-5 pb-24 md:px-10">
        <p className="text-[11px] uppercase tracking-[0.28em] text-white/50">{piece.role}</p>
        <h1 className="mt-3 font-display text-[2.35rem] font-semibold tracking-[-0.04em] sm:text-5xl md:text-7xl">
          {piece.title}
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#d7c2b4] sm:mt-6 sm:text-lg">
          {piece.summary}
        </p>

        <dl className="mt-8 grid gap-px border border-white/10 bg-white/10 sm:grid-cols-3">
          {[
            ['年份', piece.year],
            ['角色', piece.role],
            ['媒介', piece.medium],
          ].map(([label, value]) => (
            <div key={label} className="bg-[#140a07] px-5 py-4">
              <dt className="text-[11px] uppercase tracking-[0.22em] text-white/45">{label}</dt>
              <dd className="mt-2 text-sm text-[#fff6ef]">{value}</dd>
            </div>
          ))}
        </dl>

        {piece.film ? (
          <div className="mt-12">
            <ShowcaseFilm
              src={piece.film.src}
              poster={piece.film.poster}
              kicker={piece.film.kicker}
              title={piece.film.title}
              body={piece.film.body}
              autoPlay
            />
          </div>
        ) : piece.filmOnly ? (
          <div className="mt-12">
            {(piece.outcome ?? []).map((plate) => (
              <Frame key={plate.src} frame={plate} kicker={piece.outcomeKicker ?? '成片'} />
            ))}
          </div>
        ) : (
          <>
            {piece.inspiration ? (
              <div className="mt-16">
                <Frame frame={piece.inspiration} kicker="灵感" />
              </div>
            ) : null}

            <ol className="mt-16 flex flex-col gap-14">
              {(piece.process ?? []).map((step, index) => (
                <li key={step.src}>
                  <Frame
                    frame={step}
                    kicker={
                      piece.processKicker
                        ? (piece.process?.length ?? 0) > 1
                          ? `${piece.processKicker} 0${index + 1}`
                          : piece.processKicker
                        : `过程 0${index + 1}`
                    }
                  />
                </li>
              ))}
            </ol>

            <div className="mt-16 flex flex-col gap-14">
              {(piece.outcome ?? []).map((plate) => (
                <Frame key={plate.src} frame={plate} kicker={piece.outcomeKicker ?? '完成'} />
              ))}
            </div>
          </>
        )}
      </div>
    </article>
  )
}
