import { Link } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import { Coffee, Lock, ChevronRight, CheckCircle2, Clock, Pause, PlayCircle, CheckSquare, Square, RotateCcw, X } from 'lucide-react'
import { STAGES, ALL_STEPS } from '../data/roadmap'
import { getAllProgress, getLastVisited, setStatus, clearAll } from '../utils/progress'
// ── React Bible entry ──────────────────────────────────────────────────────────
import ReactBibleEntryCard from '../react-bible/components/ReactBibleEntryCard'

function StatusDot({ status }) {
  if (status === 'completed')   return <CheckCircle2 size={12} className="text-green-500 flex-shrink-0" />
  if (status === 'in-progress') return <Clock size={12} className="text-yellow-500 flex-shrink-0" />
  if (status === 'paused')      return <Pause size={12} className="text-blue-400 flex-shrink-0" />
  return null
}

/**
 * 4-state card checkbox for the roadmap home view.
 * Clicking always toggles between completed ↔ not-started.
 * The visual icon reflects the true current state.
 */
function CardStatusIcon({ status, stepNumber }) {
  function handleClick(e) {
    e.preventDefault()
    e.stopPropagation()
    setStatus(stepNumber, status === 'completed' ? 'not-started' : 'completed')
  }

  const wrapCls = 'flex-shrink-0 cursor-pointer transition-transform hover:scale-110'

  if (status === 'completed') {
    return (
      <span role="checkbox" aria-checked="true" title="Completed — click to unmark" onClick={handleClick} className={wrapCls}>
        <CheckSquare size={18} className="text-green-500" />
      </span>
    )
  }
  if (status === 'in-progress') {
    return (
      <span role="checkbox" aria-checked="false" title="In Progress — click to mark completed" onClick={handleClick} className={wrapCls}>
        <Clock size={18} className="text-yellow-500" />
      </span>
    )
  }
  if (status === 'paused') {
    return (
      <span role="checkbox" aria-checked="false" title="Paused — click to mark completed" onClick={handleClick} className={wrapCls}>
        <Pause size={18} className="text-blue-400" />
      </span>
    )
  }
  return (
    <span role="checkbox" aria-checked="false" title="Not started — click to mark completed" onClick={handleClick} className={wrapCls}>
      <Square size={18} className="text-gray-300 dark:text-gray-600 hover:text-green-400 transition-colors" />
    </span>
  )
}

const COLOR = {
  blue:    { text: 'text-blue-500',    ring: 'ring-blue-500',    bg: 'bg-blue-500',    faint: 'bg-blue-50 dark:bg-blue-950/40',    border: 'border-blue-200 dark:border-blue-800',    label: 'text-blue-700 dark:text-blue-300'    },
  orange:  { text: 'text-orange-500',  ring: 'ring-orange-500',  bg: 'bg-orange-500',  faint: 'bg-orange-50 dark:bg-orange-950/40',  border: 'border-orange-200 dark:border-orange-800',  label: 'text-orange-700 dark:text-orange-300'  },
  emerald: { text: 'text-emerald-500', ring: 'ring-emerald-500', bg: 'bg-emerald-500', faint: 'bg-emerald-50 dark:bg-emerald-950/40', border: 'border-emerald-200 dark:border-emerald-800', label: 'text-emerald-700 dark:text-emerald-300' },
  purple:  { text: 'text-purple-500',  ring: 'ring-purple-500',  bg: 'bg-purple-500',  faint: 'bg-purple-50 dark:bg-purple-950/40',  border: 'border-purple-200 dark:border-purple-800',  label: 'text-purple-700 dark:text-purple-300'  },
  red:     { text: 'text-red-500',     ring: 'ring-red-500',     bg: 'bg-red-500',     faint: 'bg-red-50 dark:bg-red-950/40',     border: 'border-red-200 dark:border-red-800',     label: 'text-red-700 dark:text-red-300'     },
  teal:    { text: 'text-teal-500',    ring: 'ring-teal-500',    bg: 'bg-teal-500',    faint: 'bg-teal-50 dark:bg-teal-950/40',    border: 'border-teal-200 dark:border-teal-800',    label: 'text-teal-700 dark:text-teal-300'    },
  yellow:  { text: 'text-yellow-600',  ring: 'ring-yellow-500',  bg: 'bg-yellow-500',  faint: 'bg-yellow-50 dark:bg-yellow-950/40',  border: 'border-yellow-200 dark:border-yellow-800',  label: 'text-yellow-700 dark:text-yellow-300'  },
  green:   { text: 'text-green-600',   ring: 'ring-green-500',   bg: 'bg-green-500',   faint: 'bg-green-50 dark:bg-green-950/40',   border: 'border-green-200 dark:border-green-800',   label: 'text-green-700 dark:text-green-300'   },
  indigo:  { text: 'text-indigo-500',  ring: 'ring-indigo-500',  bg: 'bg-indigo-500',  faint: 'bg-indigo-50 dark:bg-indigo-950/40',  border: 'border-indigo-200 dark:border-indigo-800',  label: 'text-indigo-700 dark:text-indigo-300'  },
  violet:  { text: 'text-violet-500',  ring: 'ring-violet-500',  bg: 'bg-violet-500',  faint: 'bg-violet-50 dark:bg-violet-950/40',  border: 'border-violet-200 dark:border-violet-800',  label: 'text-violet-700 dark:text-violet-300'  },
  sky:     { text: 'text-sky-500',     ring: 'ring-sky-500',     bg: 'bg-sky-500',     faint: 'bg-sky-50 dark:bg-sky-950/40',     border: 'border-sky-200 dark:border-sky-800',     label: 'text-sky-700 dark:text-sky-300'     },
  stone:   { text: 'text-stone-500',   ring: 'ring-stone-500',   bg: 'bg-stone-500',   faint: 'bg-stone-50 dark:bg-stone-950/40',   border: 'border-stone-200 dark:border-stone-800',   label: 'text-stone-700 dark:text-stone-300'   },
  amber:   { text: 'text-amber-600',   ring: 'ring-amber-500',   bg: 'bg-amber-500',   faint: 'bg-amber-50 dark:bg-amber-950/40',   border: 'border-amber-200 dark:border-amber-800',   label: 'text-amber-700 dark:text-amber-300'   },
  rose:    { text: 'text-rose-500',    ring: 'ring-rose-500',    bg: 'bg-rose-500',    faint: 'bg-rose-50 dark:bg-rose-950/40',    border: 'border-rose-200 dark:border-rose-800',    label: 'text-rose-700 dark:text-rose-300'    },
  cyan:    { text: 'text-cyan-500',    ring: 'ring-cyan-500',    bg: 'bg-cyan-500',    faint: 'bg-cyan-50 dark:bg-cyan-950/40',    border: 'border-cyan-200 dark:border-cyan-800',    label: 'text-cyan-700 dark:text-cyan-300'    },
}

function StageSection({ stage, isLast, progress }) {
  const c = COLOR[stage.color]
  const ready = stage.steps.filter(s => !s.comingSoon).length
  const done = stage.steps.filter(s => progress[s.step] === 'completed').length

  return (
    <div className="relative flex gap-5">
      {/* Timeline spine */}
      <div className="flex flex-col items-center flex-shrink-0" style={{ width: 32 }}>
        {/* Stage circle */}
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${c.bg} text-white text-xs font-bold shadow-md z-10`}>
          {stage.number}
        </div>
        {/* Line down */}
        {!isLast && <div className="flex-1 w-px bg-gray-200 dark:bg-gray-800 mt-1" />}
      </div>

      {/* Stage content */}
      <div className="flex-1 pb-10">
        {/* Stage header */}
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-1 ${c.faint} ${c.label}`}>
          Stage {stage.number} · {stage.label}
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-600 mb-4">
          {stage.description} &nbsp;
          <span className={`font-medium ${done === stage.steps.length ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-500'}`}>
            {done}/{stage.steps.length} completed
          </span>
        </p>

        {/* Steps */}
        <div className="space-y-2">
          {stage.steps.map((step, i) => {
            const isLast = i === stage.steps.length - 1
            if (step.comingSoon) {
              return (
                <div key={step.step} className="flex items-start gap-3 opacity-50 select-none">
                  <div className="flex flex-col items-center flex-shrink-0 pt-0.5" style={{ width: 20 }}>
                    <div className="w-3 h-3 rounded-full border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900" />
                    {!isLast && <div className="w-px flex-1 bg-gray-200 dark:bg-gray-800 mt-0.5" style={{ minHeight: 16 }} />}
                  </div>
                  <div className="pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-gray-400">Step {step.step}</span>
                      <Lock size={10} className="text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-400 dark:text-gray-600">{step.title}</p>
                  </div>
                </div>
              )
            }
            return (
              <Link key={step.step} to={`/step/${step.step}`} className="flex items-start gap-3 group">
                <div className="flex flex-col items-center flex-shrink-0 pt-0.5" style={{ width: 20 }}>
                  <div className={`w-3 h-3 rounded-full ${c.bg} ring-2 ring-white dark:ring-gray-950 group-hover:scale-125 transition-transform`} />
                  {!isLast && <div className="w-px flex-1 bg-gray-200 dark:bg-gray-800 mt-0.5" style={{ minHeight: 16 }} />}
                </div>
                <div className={`flex-1 rounded-xl border p-3 mb-2 transition-all group-hover:border-${stage.color}-300 dark:group-hover:border-${stage.color}-700 group-hover:shadow-sm bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800`}>
                  <div className="flex items-center justify-between gap-2">
                    <CardStatusIcon status={progress[step.step] || 'not-started'} stepNumber={step.step} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-mono ${c.text} font-semibold`}>Step {step.step}</span>
                        <StatusDot status={progress[step.step]} />
                      </div>
                      <p className="text-sm font-semibold text-gray-800 dark:text-white group-hover:text-gray-900 dark:group-hover:text-white">{step.title}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 leading-snug">{step.subtitle}</p>
                    </div>
                    <ChevronRight size={14} className="text-gray-300 dark:text-gray-600 group-hover:text-gray-500 dark:group-hover:text-gray-400 flex-shrink-0" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── Reset Confirmation Modal ──────────────────────────────────────────────────
function ResetModal({ isOpen, onConfirm, onCancel, stats }) {
  const overlayRef = useRef(null)
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === overlayRef.current) onCancel() }}
    >
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 w-full max-w-sm p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/40">
            <RotateCcw size={18} className="text-red-500" />
          </div>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
            <X size={18} />
          </button>
        </div>
        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">Reset all progress?</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
          This will permanently clear your entire learning history — including
          completed, in-progress, and paused topics.
        </p>
        {/* Stats summary */}
        <div className="flex gap-3 mb-5 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 text-xs">
          <span className="flex items-center gap-1.5 text-green-700 dark:text-green-400">
            <CheckCircle2 size={12} /> {stats.completed} completed
          </span>
          <span className="flex items-center gap-1.5 text-yellow-700 dark:text-yellow-400">
            <Clock size={12} /> {stats.inProgress} in progress
          </span>
          <span className="flex items-center gap-1.5 text-blue-700 dark:text-blue-400">
            <Pause size={12} /> {stats.paused} paused
          </span>
        </div>
        <p className="text-xs text-red-500 dark:text-red-400 mb-4 font-medium">⚠ This cannot be undone.</p>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors"
          >
            Reset All Progress
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const [progress, setProgress] = useState({})
  const [lastVisited, setLastVisited] = useState(0)
  const [showResetModal, setShowResetModal] = useState(false)

  useEffect(() => {
    function refresh() {
      setProgress(getAllProgress())
      setLastVisited(getLastVisited())
    }
    refresh()
    window.addEventListener('progress-changed', refresh)
    return () => window.removeEventListener('progress-changed', refresh)
  }, [])

  const completed  = Object.values(progress).filter(s => s === 'completed').length
  const inProgress = Object.values(progress).filter(s => s === 'in-progress').length
  const paused     = Object.values(progress).filter(s => s === 'paused').length
  const hasAnyProgress = completed + inProgress + paused > 0
  const lastStep   = lastVisited ? ALL_STEPS.find(s => s.step === lastVisited) : null

  return (
    <div>
      {/* Reset Modal */}
      <ResetModal
        isOpen={showResetModal}
        stats={{ completed, inProgress, paused }}
        onConfirm={() => { clearAll(); setShowResetModal(false) }}
        onCancel={() => setShowResetModal(false)}
      />

      {/* Hero */}
      <div className="text-center py-8 mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white mb-4 shadow-lg shadow-orange-200 dark:shadow-orange-900/30">
          <Coffee size={24} />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
          Java Bible
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto text-sm leading-relaxed">
          A step-by-step Java roadmap — from JVM to Microservices.
          Follow the path in order, or jump to any step.
        </p>
        <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-500 dark:text-gray-500">
          <span><strong className="text-green-600 dark:text-green-400">{completed}</strong> completed</span>
          <span>·</span>
          <span><strong className="text-yellow-600 dark:text-yellow-400">{inProgress}</strong> in progress</span>
          <span>·</span>
          <span><strong className="text-blue-500 dark:text-blue-400">{paused}</strong> paused</span>
          <span>·</span>
          <span><strong className="text-gray-700 dark:text-gray-300">{ALL_STEPS.length}</strong> total steps</span>
          <span>·</span>
          <span><strong className="text-gray-700 dark:text-gray-300">{STAGES.length}</strong> stages</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-6 max-w-2xl">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
          <span>Overall progress</span>
          <div className="flex items-center gap-3">
            {hasAnyProgress && (
              <button
                onClick={() => setShowResetModal(true)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-red-200 dark:border-red-900 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-[11px] font-medium"
              >
                <RotateCcw size={10} /> Reset Progress
              </button>
            )}
            <span>{Math.round((completed / ALL_STEPS.length) * 100)}%</span>
          </div>
        </div>
        <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${(completed / ALL_STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Resume banner */}
      {lastStep && (
        <Link
          to={`/step/${lastStep.step}`}
          className="flex items-center gap-3 mb-8 p-4 rounded-xl border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/30 hover:shadow-sm transition-all max-w-2xl"
        >
          <PlayCircle size={20} className="text-orange-500 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-orange-600 dark:text-orange-400 font-semibold mb-0.5">Resume where you left off</p>
            <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">Step {lastStep.step} · {lastStep.title}</p>
          </div>
          <ChevronRight size={16} className="text-orange-400 flex-shrink-0" />
        </Link>
      )}

      {/* React Bible entry card — above the Java roadmap */}
      <ReactBibleEntryCard />

      {/* Vertical Timeline */}
      <div className="max-w-2xl">
        {STAGES.map((stage, i) => (
          <StageSection key={stage.number} stage={stage} isLast={i === STAGES.length - 1} progress={progress} />
        ))}
      </div>
    </div>
  )
}
