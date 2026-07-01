import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { ChevronDown, ChevronRight, MessageSquare, CheckSquare, Square, Clock, Pause } from 'lucide-react'
import { STAGES } from '../data/roadmap'
import { getAllProgress, setStatus } from '../utils/progress'

const STAGE_BG = {
  blue: 'bg-blue-500', orange: 'bg-orange-500', emerald: 'bg-emerald-500', purple: 'bg-purple-500', red: 'bg-red-500', teal: 'bg-teal-500', yellow: 'bg-yellow-500', green: 'bg-green-500', indigo: 'bg-indigo-500',
  violet: 'bg-violet-500', sky: 'bg-sky-500', stone: 'bg-stone-500', amber: 'bg-amber-500', rose: 'bg-rose-500', cyan: 'bg-cyan-500',
}

const COLOR = {
  blue:    { text: 'text-blue-500',    activeText: 'text-blue-600 dark:text-blue-400',    activeBg: 'bg-blue-50 dark:bg-blue-950/40'    },
  orange:  { text: 'text-orange-500',  activeText: 'text-orange-600 dark:text-orange-400',  activeBg: 'bg-orange-50 dark:bg-orange-950/40'  },
  emerald: { text: 'text-emerald-500', activeText: 'text-emerald-600 dark:text-emerald-400', activeBg: 'bg-emerald-50 dark:bg-emerald-950/40' },
  purple:  { text: 'text-purple-500',  activeText: 'text-purple-600 dark:text-purple-400',  activeBg: 'bg-purple-50 dark:bg-purple-950/40'  },
  red:     { text: 'text-red-500',     activeText: 'text-red-600 dark:text-red-400',     activeBg: 'bg-red-50 dark:bg-red-950/40'     },
  teal:    { text: 'text-teal-500',    activeText: 'text-teal-600 dark:text-teal-400',    activeBg: 'bg-teal-50 dark:bg-teal-950/40'    },
  yellow:  { text: 'text-yellow-600',  activeText: 'text-yellow-700 dark:text-yellow-400',  activeBg: 'bg-yellow-50 dark:bg-yellow-950/40'  },
  green:   { text: 'text-green-600',   activeText: 'text-green-700 dark:text-green-400',   activeBg: 'bg-green-50 dark:bg-green-950/40'   },
  indigo:  { text: 'text-indigo-500',  activeText: 'text-indigo-600 dark:text-indigo-400',  activeBg: 'bg-indigo-50 dark:bg-indigo-950/40'  },
  violet:  { text: 'text-violet-500',  activeText: 'text-violet-600 dark:text-violet-400',  activeBg: 'bg-violet-50 dark:bg-violet-950/40'  },
  sky:     { text: 'text-sky-500',     activeText: 'text-sky-600 dark:text-sky-400',     activeBg: 'bg-sky-50 dark:bg-sky-950/40'     },
  stone:   { text: 'text-stone-500',   activeText: 'text-stone-600 dark:text-stone-400',   activeBg: 'bg-stone-50 dark:bg-stone-950/40'   },
  amber:   { text: 'text-amber-600',   activeText: 'text-amber-700 dark:text-amber-400',   activeBg: 'bg-amber-50 dark:bg-amber-950/40'   },
  rose:    { text: 'text-rose-500',    activeText: 'text-rose-600 dark:text-rose-400',    activeBg: 'bg-rose-50 dark:bg-rose-950/40'    },
  cyan:    { text: 'text-cyan-500',    activeText: 'text-cyan-600 dark:text-cyan-400',    activeBg: 'bg-cyan-50 dark:bg-cyan-950/40'    },
}

/**
 * Sidebar status checkbox/indicator:
 *  not-started → empty square (click to mark completed directly)
 *  in-progress → yellow clock icon (click to mark completed)
 *  paused      → blue pause icon  (click to mark completed)
 *  completed   → green checkmark  (click to go back to not-started)
 */
function StatusIcon({ status, stepNumber, small = false }) {
  const sz = small ? 13 : 15

  function handleClick(e) {
    e.preventDefault()
    e.stopPropagation()
    if (status === 'completed') {
      setStatus(stepNumber, 'not-started')
    } else {
      setStatus(stepNumber, 'completed')
    }
  }

  const wrapCls = 'flex-shrink-0 cursor-pointer transition-transform hover:scale-110'

  if (status === 'completed') {
    return (
      <span role="checkbox" aria-checked="true" title="Completed — click to unmark" onClick={handleClick} className={wrapCls}>
        <CheckSquare size={sz} className="text-green-500" />
      </span>
    )
  }
  if (status === 'in-progress') {
    return (
      <span role="checkbox" aria-checked="false" title="In Progress — click to mark completed" onClick={handleClick} className={wrapCls}>
        <Clock size={sz} className="text-yellow-500" />
      </span>
    )
  }
  if (status === 'paused') {
    return (
      <span role="checkbox" aria-checked="false" title="Paused — click to mark completed" onClick={handleClick} className={wrapCls}>
        <Pause size={sz} className="text-blue-500" />
      </span>
    )
  }
  // not-started
  return (
    <span role="checkbox" aria-checked="false" title="Not started — click to mark completed" onClick={handleClick} className={wrapCls}>
      <Square size={sz} className="text-gray-300 dark:text-gray-600 hover:text-green-400" />
    </span>
  )
}

function StageNav({ stage, onNavigate, progress }) {
  const location = useLocation()
  const c = COLOR[stage.color]
  const isAnyActive = stage.steps.some(s => location.pathname === `/step/${s.step}`)
  const [open, setOpen] = useState(isAnyActive || stage.number === 1)

  return (
    <div className="mb-1">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors mx-1 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/40"
      >
        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white ${STAGE_BG[stage.color]}`}>
          {stage.number}
        </span>
        <span className="flex-1 text-left">{stage.label}</span>
        {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
      </button>

      {open && (
        <div className="mt-0.5 mb-2 space-y-0.5">
          {stage.steps.map(step => {
            if (step.comingSoon) {
              return (
                <div
                  key={step.step}
                  className="flex items-center gap-2 pl-9 pr-3 py-1.5 mx-1 rounded-lg opacity-40 select-none cursor-default"
                >
                  <span className="text-[10px] font-mono text-gray-400 w-5">{step.step}</span>
                  <span className="text-xs text-gray-400 dark:text-gray-600 truncate">{step.title}</span>
                </div>
              )
            }
            const st = progress[step.step] || 'not-started'
            return (
              <NavLink
                key={step.step}
                to={`/step/${step.step}`}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `flex items-center gap-2 pl-4 pr-3 py-1.5 mx-1 rounded-lg text-xs transition-colors ${
                    isActive
                      ? `${c.activeBg} ${c.activeText} font-semibold`
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/40 hover:text-gray-900 dark:hover:text-white'
                  }`
                }
              >
                <StatusIcon status={st} stepNumber={step.step} small />
                <span className="font-mono text-[10px] text-gray-400 dark:text-gray-600 w-5 flex-shrink-0">{step.step}</span>
                <span className="truncate">{step.title}</span>
              </NavLink>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function Sidebar({ onNavigate }) {
  const [progress, setProgress] = useState(getAllProgress())

  useEffect(() => {
    const refresh = () => setProgress(getAllProgress())
    window.addEventListener('progress-changed', refresh)
    return () => window.removeEventListener('progress-changed', refresh)
  }, [])

  return (
    <nav className="py-3">
      {STAGES.map(stage => (
        <StageNav key={stage.number} stage={stage} onNavigate={onNavigate} progress={progress} />
      ))}

      {/* Interview Questions */}
      <div className="mt-2 mx-1 pt-3 border-t border-gray-100 dark:border-gray-800">
        <p className="px-2 py-1 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 flex items-center gap-2">
          <MessageSquare size={11} />
          Interview Q&amp;A
        </p>
        <NavLink
          to="/interview/core"
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-2 pl-6 pr-3 py-1.5 rounded-lg text-xs transition-colors mt-0.5 ${
              isActive
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/40 hover:text-gray-900 dark:hover:text-white'
            }`
          }
        >
          Core Java (100 Q&amp;A)
        </NavLink>
        <NavLink
          to="/interview/advanced"
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-2 pl-6 pr-3 py-1.5 rounded-lg text-xs transition-colors mt-0.5 ${
              isActive
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/40 hover:text-gray-900 dark:hover:text-white'
            }`
          }
        >
          Advanced Java (100 Q&amp;A)
        </NavLink>
      </div>
    </nav>
  )
}
