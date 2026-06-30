import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { searchSections } from '../utils/search'

const STAGE_COLOR = {
  blue:    'bg-blue-500',
  orange:  'bg-orange-500',
  emerald: 'bg-emerald-500',
  purple:  'bg-purple-500',
  red:     'bg-red-500',
  teal:    'bg-teal-500',
  yellow:  'bg-yellow-500',
  green:   'bg-green-500',
  indigo:  'bg-indigo-500',
}

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [active, setActive] = useState(0)
  const [open, setOpen] = useState(false)
  const inputRef = useRef(null)
  const containerRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const results = searchSections(query)
    setResults(results)
    setActive(0)
    setOpen(query.trim().length >= 2)
  }, [query])

  useEffect(() => {
    function onClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  // Ctrl+K / Cmd+K global shortcut
  useEffect(() => {
    function onKey(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
        inputRef.current?.select()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const navigate_to = useCallback((result) => {
    navigate(`/step/${result.stepNumber}`)
    setQuery('')
    setOpen(false)
    inputRef.current?.blur()
  }, [navigate])

  function onKeyDown(e) {
    if (!open) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive(a => Math.min(a + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive(a => Math.max(a - 1, 0))
    } else if (e.key === 'Enter' && results[active]) {
      navigate_to(results[active])
    } else if (e.key === 'Escape') {
      setOpen(false)
      inputRef.current?.blur()
    }
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-sm">
      <div className="relative flex items-center">
        <Search size={14} className="absolute left-3 text-gray-400 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => query.trim().length >= 2 && setOpen(true)}
          placeholder="Search concepts… (Ctrl K)"
          className="w-full pl-8 pr-8 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-orange-400 dark:focus:border-orange-500 focus:ring-1 focus:ring-orange-400/30 transition-colors"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setOpen(false); inputRef.current?.focus() }}
            className="absolute right-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-full mt-1.5 left-0 right-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden z-50">
          {results.map((r, i) => (
            <button
              key={`${r.stepNumber}-${r.sectionId}`}
              onClick={() => navigate_to(r)}
              onMouseEnter={() => setActive(i)}
              className={`w-full text-left px-3 py-2.5 flex items-start gap-3 transition-colors ${
                i === active
                  ? 'bg-orange-50 dark:bg-orange-950/30'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
              } ${i > 0 ? 'border-t border-gray-100 dark:border-gray-800' : ''}`}
            >
              <span className={`mt-0.5 flex-shrink-0 w-2 h-2 rounded-full ${STAGE_COLOR[r.stageColor]}`} />
              <div className="min-w-0">
                <div className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                  {r.sectionTitle || r.stepTitle}
                </div>
                <div className="text-[11px] text-gray-400 dark:text-gray-500 truncate">
                  Step {r.stepNumber} · {r.stepTitle}
                </div>
                {r.snippet && r.snippet !== r.sectionTitle && (
                  <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                    {r.snippet}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {open && query.trim().length >= 2 && results.length === 0 && (
        <div className="absolute top-full mt-1.5 left-0 right-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg px-4 py-3 z-50">
          <p className="text-sm text-gray-400 dark:text-gray-500">No results for "<span className="text-gray-600 dark:text-gray-300">{query}</span>"</p>
        </div>
      )}
    </div>
  )
}
