import { useParams, Link } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import { ChevronRight, ChevronLeft, Home, Lock, CheckCircle2, Circle, Clock, Pause, Play, RotateCcw, X } from 'lucide-react'
import { getStep, ALL_STEPS } from '../data/roadmap'
import CodeBlock from '../components/CodeBlock'
import Callout from '../components/Callout'
import { renderExplanation, renderInline } from '../utils/renderText'
import { getStatus, setStatus, setLastVisited } from '../utils/progress'

const COLOR = {
  blue:    { text: 'text-blue-500',    faint: 'bg-blue-50 dark:bg-blue-950/30',    label: 'text-blue-700 dark:text-blue-300'    },
  orange:  { text: 'text-orange-500',  faint: 'bg-orange-50 dark:bg-orange-950/30',  label: 'text-orange-700 dark:text-orange-300'  },
  emerald: { text: 'text-emerald-500', faint: 'bg-emerald-50 dark:bg-emerald-950/30', label: 'text-emerald-700 dark:text-emerald-300' },
  purple:  { text: 'text-purple-500',  faint: 'bg-purple-50 dark:bg-purple-950/30',  label: 'text-purple-700 dark:text-purple-300'  },
  red:     { text: 'text-red-500',     faint: 'bg-red-50 dark:bg-red-950/30',     label: 'text-red-700 dark:text-red-300'     },
  teal:    { text: 'text-teal-500',    faint: 'bg-teal-50 dark:bg-teal-950/30',    label: 'text-teal-700 dark:text-teal-300'    },
  yellow:  { text: 'text-yellow-600',  faint: 'bg-yellow-50 dark:bg-yellow-950/30',  label: 'text-yellow-700 dark:text-yellow-300'  },
  green:   { text: 'text-green-600',   faint: 'bg-green-50 dark:bg-green-950/30',   label: 'text-green-700 dark:text-green-300'   },
  indigo:  { text: 'text-indigo-500',  faint: 'bg-indigo-50 dark:bg-indigo-950/30',  label: 'text-indigo-700 dark:text-indigo-300'  },
  sky:     { text: 'text-sky-500',     faint: 'bg-sky-50 dark:bg-sky-950/30',     label: 'text-sky-700 dark:text-sky-300'     },
  stone:   { text: 'text-stone-500',   faint: 'bg-stone-50 dark:bg-stone-800/40',   label: 'text-stone-700 dark:text-stone-300'   },
  violet:  { text: 'text-violet-500',  faint: 'bg-violet-50 dark:bg-violet-950/30',  label: 'text-violet-700 dark:text-violet-300'  },
}

// ── Confirmation Modal ────────────────────────────────────────────────────────
function ConfirmModal({ isOpen, onConfirm, onCancel, stepTitle }) {
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={(e) => { if (e.target === overlayRef.current) onCancel() }}
    >
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 w-full max-w-sm p-6 animate-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-950/40">
            <RotateCcw size={18} className="text-orange-500" />
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">Restart this topic?</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 leading-relaxed">
          <span className="font-medium text-gray-700 dark:text-gray-300">"{stepTitle}"</span> is marked as completed.
          Restarting will reset it back to <span className="font-medium">Not Started</span>.
        </p>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Keep Completed
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition-colors"
          >
            Yes, Restart
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Status Badge (read-only display) ─────────────────────────────────────────
function StatusBadge({ status }) {
  const cfg = {
    'not-started': { Icon: Circle,       label: 'Not Started', cls: 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500',             iconCls: 'text-gray-400' },
    'in-progress':  { Icon: Clock,        label: 'In Progress', cls: 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400', iconCls: 'text-yellow-500' },
    'paused':       { Icon: Pause,        label: 'Paused',      cls: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400',             iconCls: 'text-blue-500'   },
    'completed':    { Icon: CheckCircle2, label: 'Completed',   cls: 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400',       iconCls: 'text-green-500'  },
  }
  const { Icon, label, cls, iconCls } = cfg[status] || cfg['not-started']
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cls}`}>
      <Icon size={11} className={iconCls} />
      {label}
    </span>
  )
}

// ── Flow Action Button(s) ─────────────────────────────────────────────────────
function FlowButtons({ status, stepTitle, onStart, onComplete, onPause, onResume, onRequestRestart }) {
  if (status === 'not-started') {
    return (
      <button
        onClick={onStart}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-orange-500 hover:bg-orange-600 text-white transition-all hover:shadow-md hover:shadow-orange-200 dark:hover:shadow-orange-900/30 active:scale-95"
      >
        <Play size={11} />
        Start Learning
      </button>
    )
  }

  if (status === 'in-progress') {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={onComplete}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-green-500 hover:bg-green-600 text-white transition-all hover:shadow-md hover:shadow-green-200 dark:hover:shadow-green-900/30 active:scale-95"
        >
          <CheckCircle2 size={11} />
          Mark Complete
        </button>
        <button
          onClick={onPause}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-950/60 transition-all active:scale-95"
        >
          <Pause size={11} />
          Pause
        </button>
      </div>
    )
  }

  if (status === 'paused') {
    return (
      <button
        onClick={onResume}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-500 hover:bg-blue-600 text-white transition-all hover:shadow-md hover:shadow-blue-200 dark:hover:shadow-blue-900/30 active:scale-95"
      >
        <Play size={11} />
        Resume
      </button>
    )
  }

  if (status === 'completed') {
    return (
      <button
        onClick={onRequestRestart}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-950/60 transition-all active:scale-95"
      >
        <RotateCcw size={11} />
        Restart
      </button>
    )
  }

  return null
}

// ── Section View ──────────────────────────────────────────────────────────────
function SectionView({ section }) {
  return (
    <div className="mb-12">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 pb-3 border-b border-gray-200 dark:border-gray-800">
        {section.title}
      </h2>

      {section.explanation && (
        <div className="space-y-1.5 mb-5">
          {renderExplanation(section.explanation)}
        </div>
      )}

      {section.table && (
        <div className="overflow-x-auto mb-5 rounded-xl border border-gray-200 dark:border-gray-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/60">
                {section.table.headers.map((h, i) => (
                  <th key={i} className="text-left px-4 py-2.5 font-semibold text-gray-700 dark:text-gray-300 text-xs uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.table.rows.map((row, ri) => (
                <tr key={ri} className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30">
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-4 py-2.5 text-gray-600 dark:text-gray-400 align-top">
                      {renderInline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {section.code && <CodeBlock code={section.code} title={section.codeTitle} />}

      {section.points && section.points.length > 0 && (
        <ul className="space-y-2 mb-5">
          {section.points.map((pt, i) => (
            <li key={i} className="flex gap-3 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
              <span>{renderInline(pt)}</span>
            </li>
          ))}
        </ul>
      )}

      {section.callouts && section.callouts.map((c, i) => (
        <Callout key={i} type={c.type}>
          {c.content.split('\n').map((line, j, arr) => (
            <span key={j}>{renderInline(line)}{j < arr.length - 1 && <br />}</span>
          ))}
        </Callout>
      ))}
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function StepPage() {
  const { number } = useParams()
  const n = parseInt(number, 10)
  const step = getStep(n)
  const prev = getStep(n - 1)
  const next = getStep(n + 1)

  const [status, setStatusState] = useState(() => getStatus(n))
  const [showRestartModal, setShowRestartModal] = useState(false)

  // On step change: just sync local state, NEVER auto-set status
  useEffect(() => {
    document.getElementById('main-content')?.scrollTo(0, 0)
    setLastVisited(n)
    setStatusState(getStatus(n))
    setShowRestartModal(false)
  }, [n])

  // Listen for external progress changes (e.g. sidebar checkbox)
  useEffect(() => {
    const sync = () => setStatusState(getStatus(n))
    window.addEventListener('progress-changed', sync)
    return () => window.removeEventListener('progress-changed', sync)
  }, [n])

  function applyStatus(newStatus) {
    setStatus(n, newStatus)
    setStatusState(newStatus)
  }

  if (!step) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 dark:text-gray-600 text-lg mb-4">Step {number} not found.</p>
        <Link to="/" className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 text-sm font-medium">
          <Home size={14} /> Back to Roadmap
        </Link>
      </div>
    )
  }

  const c = COLOR[step.stageColor] || COLOR.blue

  return (
    <div>
      {/* Restart Confirmation Modal */}
      <ConfirmModal
        isOpen={showRestartModal}
        stepTitle={step.title}
        onConfirm={() => { applyStatus('not-started'); setShowRestartModal(false) }}
        onCancel={() => setShowRestartModal(false)}
      />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-600 mb-6">
        <Link to="/" className="hover:text-gray-600 dark:hover:text-gray-400 transition-colors">Roadmap</Link>
        <ChevronRight size={11} />
        <span className={c.text}>Stage {step.stageNumber} · {step.stageLabel}</span>
        <ChevronRight size={11} />
        <span className="text-gray-600 dark:text-gray-400">Step {step.step}</span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${c.faint} ${c.label}`}>
            Stage {step.stageNumber} · Step {step.step} of {ALL_STEPS.length}
          </div>
          {/* Status badge (read-only) */}
          <StatusBadge status={status} />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
          {step.title}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm">{step.subtitle}</p>

        {/* Flow action buttons */}
        <div className="mt-4 flex items-center gap-3 flex-wrap">
          <FlowButtons
            status={status}
            stepTitle={step.title}
            onStart={() => applyStatus('in-progress')}
            onComplete={() => applyStatus('completed')}
            onPause={() => applyStatus('paused')}
            onResume={() => applyStatus('in-progress')}
            onRequestRestart={() => setShowRestartModal(true)}
          />
        </div>

        {/* Section jump links */}
        {step.sections && step.sections.length > 1 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {step.sections.map(s => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="text-xs px-2.5 py-1 rounded-full border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-orange-300 dark:hover:border-orange-700 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
              >
                {s.title}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Coming Soon */}
      {step.comingSoon && (
        <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 p-12 text-center">
          <Lock size={28} className="text-gray-300 dark:text-gray-700 mx-auto mb-3" />
          <p className="font-semibold text-gray-500 dark:text-gray-400 mb-1">Coming Soon</p>
          <p className="text-sm text-gray-400 dark:text-gray-600">
            This step is being written. Content for <strong>{step.title}</strong> will be added shortly.
          </p>
        </div>
      )}

      {/* Sections */}
      {step.sections && step.sections.map(section => (
        <div key={section.id} id={section.id}>
          <SectionView section={section} />
        </div>
      ))}

      {/* Bottom Flow Button (sticky-feel at end of content) */}
      {!step.comingSoon && (
        <div className="mt-6 mb-2 flex items-center gap-3">
          <FlowButtons
            status={status}
            stepTitle={step.title}
            onStart={() => applyStatus('in-progress')}
            onComplete={() => applyStatus('completed')}
            onPause={() => applyStatus('paused')}
            onResume={() => applyStatus('in-progress')}
            onRequestRestart={() => setShowRestartModal(true)}
          />
          {status === 'not-started' && (
            <span className="text-xs text-gray-400 dark:text-gray-600">Click to start tracking your progress</span>
          )}
          {status === 'paused' && (
            <span className="text-xs text-gray-400 dark:text-gray-600">Paused — resume when you're ready</span>
          )}
          {status === 'completed' && (
            <span className="text-xs text-green-600 dark:text-green-400 font-medium">✓ Well done! This step is completed.</span>
          )}
        </div>
      )}

      {/* Prev / Next */}
      <div className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between gap-4">
        {prev ? (
          <Link
            to={`/step/${prev.step}`}
            className="flex items-center gap-2 group text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            <div>
              <div className="text-xs text-gray-400 dark:text-gray-600 mb-0.5">Previous · Step {prev.step}</div>
              <div className="font-medium">{prev.title}</div>
            </div>
          </Link>
        ) : (
          <Link to="/" className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-600 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
            <Home size={14} />
            Back to Roadmap
          </Link>
        )}

        {next ? (
          <Link
            to={`/step/${next.step}`}
            className="flex items-center gap-2 group text-sm text-right text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
          >
            <div>
              <div className="text-xs text-gray-400 dark:text-gray-600 mb-0.5">Next · Step {next.step}</div>
              <div className="font-medium">{next.title}</div>
            </div>
            <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  )
}
