import { Link } from 'react-router-dom'
import { BookOpen, ChevronRight, CheckCircle2, BookMarked, Zap } from 'lucide-react'
import { useReactBibleProgress } from '../hooks/useReactBibleProgress'
import { CHAPTERS } from '../data/chapters'

/**
 * ReactBibleEntryCard
 *
 * The entry point shown on the Java Bible Home page.
 * It is a self-contained card — it imports its own data and hooks.
 * The Home page just renders <ReactBibleEntryCard /> — no props needed.
 *
 * Design principles:
 * • Visually distinct from the Java Bible sections — uses a cool blue/cyan gradient
 *   so the user immediately understands this is a different resource.
 * • Shows progress stats at a glance.
 * • Shows "resume" if the user has been reading.
 * • Lists the 3 most recently-worked-on chapters for quick re-entry.
 */
export default function ReactBibleEntryCard() {
  const { stats, lastChapterData, progress } = useReactBibleProgress()

  const inProgressChapters = CHAPTERS.filter(
    c => progress[c.id] === 'reading'
  ).slice(0, 3)

  const isVirgin = stats.completed === 0 && stats.reading === 0

  return (
    <div className="mb-8 max-w-2xl">
      {/* Card */}
      <div className="relative overflow-hidden rounded-2xl border border-cyan-200 dark:border-cyan-900 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/40 dark:to-blue-950/40 shadow-sm">

        {/* Decorative background glyph */}
        <div className="absolute -right-4 -top-4 text-cyan-100 dark:text-cyan-900/40 select-none pointer-events-none text-[100px] leading-none font-black">
          ⚛
        </div>

        <div className="relative p-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-200 dark:shadow-cyan-900/40 flex-shrink-0">
                <BookOpen size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-gray-900 dark:text-white text-base leading-tight">
                    React Bible
                  </h2>
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
                    React 19+
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Gold standard reference · June 2026
                </p>
              </div>
            </div>

            <Link
              to="/react-bible"
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold transition-colors shadow-sm"
            >
              {isVirgin ? 'Start Reading' : 'Continue'}
              <ChevronRight size={13} />
            </Link>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-4 mb-3 text-xs text-gray-500 dark:text-gray-400">
            <span>
              <strong className="text-gray-700 dark:text-gray-200">{CHAPTERS.length}</strong> chapters
            </span>
            <span>·</span>
            <span>
              <strong className="text-gray-700 dark:text-gray-200">43</strong> topics
            </span>
            <span>·</span>
            <span>
              <strong className="text-green-600 dark:text-green-400">{stats.completed}</strong> completed
            </span>
            {stats.reading > 0 && (
              <>
                <span>·</span>
                <span>
                  <strong className="text-cyan-600 dark:text-cyan-400">{stats.reading}</strong> in progress
                </span>
              </>
            )}
          </div>

          {/* Progress bar */}
          {!isVirgin && (
            <div className="mb-3">
              <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1">
                <span>Reading progress</span>
                <span>{stats.pct}%</span>
              </div>
              <div className="h-1.5 bg-cyan-100 dark:bg-cyan-950 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-700"
                  style={{ width: `${stats.pct}%` }}
                />
              </div>
            </div>
          )}

          {/* Resume banner */}
          {lastChapterData && (
            <Link
              to={`/react-bible/chapter/${lastChapterData.id}`}
              className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/60 dark:bg-gray-900/40 border border-cyan-100 dark:border-cyan-900/50 hover:bg-white/80 dark:hover:bg-gray-900/60 transition-colors mb-3"
            >
              <BookMarked size={14} className="text-cyan-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-cyan-600 dark:text-cyan-400 font-semibold">Resume</p>
                <p className="text-xs font-medium text-gray-700 dark:text-gray-200 truncate">
                  Ch {lastChapterData.number} · {lastChapterData.title}
                </p>
              </div>
              <ChevronRight size={12} className="text-cyan-400 flex-shrink-0" />
            </Link>
          )}

          {/* Featured highlights (shown only when not started) */}
          {isVirgin && (
            <div className="flex flex-wrap gap-2">
              {[
                { icon: Zap, label: '20 Industry Custom Hooks' },
                { icon: CheckCircle2, label: '~210 Interview Q&A' },
                { icon: BookOpen, label: 'React 19.2 coverage' },
              ].map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/60 dark:bg-gray-900/40 border border-cyan-100 dark:border-cyan-900/50 text-[11px] text-gray-600 dark:text-gray-300"
                >
                  <Icon size={11} className="text-cyan-500" />
                  {label}
                </span>
              ))}
            </div>
          )}

          {/* In-progress chapters */}
          {inProgressChapters.length > 0 && (
            <div className="space-y-1">
              {inProgressChapters.map(c => (
                <Link
                  key={c.id}
                  to={`/react-bible/chapter/${c.id}`}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/60 dark:hover:bg-gray-900/30 transition-colors"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0" />
                  <span className="text-xs text-gray-600 dark:text-gray-300 truncate">
                    Ch {c.number} · {c.title}
                  </span>
                  <ChevronRight size={11} className="ml-auto text-gray-400 flex-shrink-0" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
