import { Link } from 'react-router-dom'
import { BookOpen, CheckCircle2, Clock, Circle, ChevronRight, Zap } from 'lucide-react'
import { PARTS } from '../data/parts'
import { CHAPTERS, TOTAL_QA_COUNT } from '../data/chapters'
import { useReactBibleProgress } from '../hooks/useReactBibleProgress'

// ─── Color map: part color → Tailwind classes ────────────────────────────────
// Kept in component file because it's view-layer concern, not data-layer.
const PART_COLORS = {
  blue:    { dot: 'bg-blue-500',   label: 'text-blue-700 dark:text-blue-300',   faint: 'bg-blue-50 dark:bg-blue-950/40',   border: 'border-blue-200 dark:border-blue-800'   },
  violet:  { dot: 'bg-violet-500', label: 'text-violet-700 dark:text-violet-300', faint: 'bg-violet-50 dark:bg-violet-950/40', border: 'border-violet-200 dark:border-violet-800' },
  emerald: { dot: 'bg-emerald-500',label: 'text-emerald-700 dark:text-emerald-300',faint: 'bg-emerald-50 dark:bg-emerald-950/40',border: 'border-emerald-200 dark:border-emerald-800'},
  orange:  { dot: 'bg-orange-500', label: 'text-orange-700 dark:text-orange-300', faint: 'bg-orange-50 dark:bg-orange-950/40', border: 'border-orange-200 dark:border-orange-800' },
  rose:    { dot: 'bg-rose-500',   label: 'text-rose-700 dark:text-rose-300',   faint: 'bg-rose-50 dark:bg-rose-950/40',   border: 'border-rose-200 dark:border-rose-800'   },
  teal:    { dot: 'bg-teal-500',   label: 'text-teal-700 dark:text-teal-300',   faint: 'bg-teal-50 dark:bg-teal-950/40',   border: 'border-teal-200 dark:border-teal-800'   },
  amber:   { dot: 'bg-amber-500',  label: 'text-amber-700 dark:text-amber-300',  faint: 'bg-amber-50 dark:bg-amber-950/40',  border: 'border-amber-200 dark:border-amber-800'  },
  indigo:  { dot: 'bg-indigo-500', label: 'text-indigo-700 dark:text-indigo-300', faint: 'bg-indigo-50 dark:bg-indigo-950/40', border: 'border-indigo-200 dark:border-indigo-800' },
  cyan:    { dot: 'bg-cyan-500',   label: 'text-cyan-700 dark:text-cyan-300',   faint: 'bg-cyan-50 dark:bg-cyan-950/40',   border: 'border-cyan-200 dark:border-cyan-800'   },
  purple:  { dot: 'bg-purple-500', label: 'text-purple-700 dark:text-purple-300', faint: 'bg-purple-50 dark:bg-purple-950/40', border: 'border-purple-200 dark:border-purple-800' },
  green:   { dot: 'bg-green-500',  label: 'text-green-700 dark:text-green-300',  faint: 'bg-green-50 dark:bg-green-950/40',  border: 'border-green-200 dark:border-green-800'  },
  sky:     { dot: 'bg-sky-500',    label: 'text-sky-700 dark:text-sky-300',    faint: 'bg-sky-50 dark:bg-sky-950/40',    border: 'border-sky-200 dark:border-sky-800'    },
  stone:   { dot: 'bg-stone-500',  label: 'text-stone-700 dark:text-stone-300',  faint: 'bg-stone-50 dark:bg-stone-950/40',  border: 'border-stone-200 dark:border-stone-800'  },
}

function StatusIcon({ status, size = 13 }) {
  if (status === 'completed') return <CheckCircle2 size={size} className="text-green-500 flex-shrink-0" />
  if (status === 'reading')   return <Clock size={size} className="text-cyan-500 flex-shrink-0" />
  return <Circle size={size} className="text-gray-300 dark:text-gray-600 flex-shrink-0" />
}

function ChapterRow({ chapter, status }) {
  const isPlanned = chapter.status === 'planned'

  if (isPlanned) {
    return (
      <div className="flex items-center gap-2.5 px-3 py-2 opacity-50 select-none">
        <Circle size={13} className="text-gray-300 dark:text-gray-600 flex-shrink-0" />
        <span className="text-[10px] font-mono text-gray-400 w-5 flex-shrink-0">{chapter.number}</span>
        <span className="text-sm text-gray-500 dark:text-gray-500 truncate">{chapter.title}</span>
        <span className="ml-auto text-[10px] text-gray-400 flex-shrink-0">planned</span>
      </div>
    )
  }

  return (
    <Link
      to={`/react-bible/chapter/${chapter.id}`}
      className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white dark:hover:bg-gray-800/60 transition-colors group"
    >
      <StatusIcon status={status} />
      <span className="text-[10px] font-mono text-gray-400 w-5 flex-shrink-0">{chapter.number}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 dark:text-gray-100 group-hover:text-gray-900 dark:group-hover:text-white truncate">
          {chapter.title}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{chapter.subtitle}</p>
      </div>
      {chapter.qaCount > 0 && (
        <span className="flex-shrink-0 text-[10px] text-gray-400 dark:text-gray-500">
          {chapter.qaCount} Q&A
        </span>
      )}
      <ChevronRight size={13} className="text-gray-300 group-hover:text-gray-400 flex-shrink-0" />
    </Link>
  )
}

function PartSection({ part, progress }) {
  const c = PART_COLORS[part.color] || PART_COLORS.blue
  const chapters = CHAPTERS.filter(ch => ch.partId === part.id)
  const completed = chapters.filter(ch => progress[ch.id] === 'completed').length
  const available = chapters.filter(ch => ch.status !== 'planned').length

  return (
    <div className="mb-6">
      {/* Part header */}
      <div className={`flex items-center gap-2 px-3 py-2 rounded-xl mb-1 ${c.faint} border ${c.border}`}>
        <span className={`w-5 h-5 rounded-full ${c.dot} flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0`}>
          {part.number}
        </span>
        <span className={`text-xs font-bold uppercase tracking-wider ${c.label}`}>
          {part.icon} {part.label}
        </span>
        {available > 0 && (
          <span className="ml-auto text-[10px] text-gray-400">
            {completed}/{available} done
          </span>
        )}
      </div>

      {/* Chapters */}
      <div className="ml-2 space-y-0.5">
        {chapters.map(ch => (
          <ChapterRow
            key={ch.id}
            chapter={ch}
            status={progress[ch.id] || 'not-started'}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function ReactBibleHomePage() {
  const { stats, lastChapterData, progress } = useReactBibleProgress()

  return (
    <div>
      {/* Hero */}
      <div className="text-center py-6 mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white mb-4 shadow-lg shadow-cyan-200 dark:shadow-cyan-900/30">
          <BookOpen size={24} />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
          React Bible
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto text-sm leading-relaxed">
          The gold-standard reference for React 19+ — as of June 2026.
          Every concept with depth: explanation, examples, gotchas, and interview Q&A.
        </p>

        {/* Stats */}
        <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-500 dark:text-gray-500">
          <span><strong className="text-gray-700 dark:text-gray-300">{CHAPTERS.length}</strong> chapters</span>
          <span>·</span>
          <span><strong className="text-gray-700 dark:text-gray-300">13</strong> parts</span>
          <span>·</span>
          <span><strong className="text-gray-700 dark:text-gray-300">{TOTAL_QA_COUNT}+</strong> interview Q&A</span>
          <span>·</span>
          <span><strong className="text-green-600 dark:text-green-400">{stats.completed}</strong> completed</span>
        </div>
      </div>

      {/* Progress bar */}
      {stats.completed > 0 && (
        <div className="mb-6 max-w-2xl">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>Overall reading progress</span>
            <span>{stats.pct}%</span>
          </div>
          <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${stats.pct}%` }}
            />
          </div>
        </div>
      )}

      {/* Resume banner */}
      {lastChapterData && (
        <Link
          to={`/react-bible/chapter/${lastChapterData.id}`}
          className="flex items-center gap-3 mb-6 p-4 rounded-xl border border-cyan-200 dark:border-cyan-800 bg-cyan-50 dark:bg-cyan-950/30 hover:shadow-sm transition-all max-w-2xl"
        >
          <Zap size={18} className="text-cyan-500 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-cyan-600 dark:text-cyan-400 font-semibold mb-0.5">Resume where you left off</p>
            <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">
              Ch {lastChapterData.number} · {lastChapterData.title}
            </p>
          </div>
          <ChevronRight size={16} className="text-cyan-400 flex-shrink-0" />
        </Link>
      )}

      {/* Parts & Chapters */}
      <div className="max-w-2xl">
        {PARTS.map(part => (
          <PartSection key={part.id} part={part} progress={progress} />
        ))}
      </div>
    </div>
  )
}
