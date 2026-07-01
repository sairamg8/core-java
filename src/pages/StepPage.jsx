import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ChevronRight, ChevronLeft, Home, Lock, CheckCircle2, Circle, Clock } from 'lucide-react'
import { getStep, ALL_STEPS } from '../data/roadmap'
import CodeBlock from '../components/CodeBlock'
import Callout from '../components/Callout'
import { renderExplanation, renderInline } from '../utils/renderText'
import { getStatus, setStatus, setLastVisited } from '../utils/progress'

const STATUS_CONFIG = {
  'not-started': { label: 'Not Started', icon: Circle,       cls: 'text-gray-400' },
  'in-progress':  { label: 'In Progress', icon: Clock,        cls: 'text-yellow-500' },
  'completed':    { label: 'Completed',   icon: CheckCircle2, cls: 'text-green-500' },
}

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

export default function StepPage() {
  const { number } = useParams()
  const n = parseInt(number, 10)
  const step = getStep(n)
  const prev = getStep(n - 1)
  const next = getStep(n + 1)

  const [status, setStatusState] = useState(() => getStatus(n))

  useEffect(() => {
    document.getElementById('main-content')?.scrollTo(0, 0)
    setLastVisited(n)
    const current = getStatus(n)
    if (current === 'not-started') {
      setStatus(n, 'in-progress')
      setStatusState('in-progress')
    } else {
      setStatusState(current)
    }
  }, [n])

  function cycleStatus() {
    const next = status === 'not-started' ? 'in-progress'
               : status === 'in-progress'  ? 'completed'
               : 'not-started'
    setStatus(n, next)
    setStatusState(next)
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
          <button
            onClick={cycleStatus}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors ${
              status === 'completed'   ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400' :
              status === 'in-progress' ? 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400' :
              'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500'
            }`}
          >
            {(() => { const S = STATUS_CONFIG[status]; return <S.icon size={12} className={S.cls} /> })()}
            {STATUS_CONFIG[status].label}
          </button>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
          {step.title}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm">{step.subtitle}</p>

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
