import { useEffect, useState } from 'react'
import { CHAPTERS } from '../data/chapters'
import {
  getAllChapterProgress,
  getLastChapter,
  setChapterStatus,
  setLastChapter,
  computeProgressStats,
} from '../data/progress'

/**
 * useReactBibleProgress
 *
 * Single hook that manages all progress tracking for the React Bible.
 * Components subscribe to this hook — they never call the progress utilities directly.
 *
 * Separation of concern:
 *   data/progress.js  → pure storage utilities (no React)
 *   useReactBibleProgress → React layer over those utilities
 *   Components → consume this hook, never import from data/progress directly
 */
export function useReactBibleProgress() {
  const [progress, setProgress] = useState(getAllChapterProgress)
  const [lastChapter, setLastChapterState] = useState(getLastChapter)

  // Sync state when another component or another tab changes progress
  useEffect(() => {
    function refresh() {
      setProgress(getAllChapterProgress())
      setLastChapterState(getLastChapter())
    }
    window.addEventListener('react-bible-progress-changed', refresh)
    return () => window.removeEventListener('react-bible-progress-changed', refresh)
  }, [])

  function markReading(chapterId) {
    setChapterStatus(chapterId, 'reading')
    setLastChapter(chapterId)
  }

  function markCompleted(chapterId) {
    setChapterStatus(chapterId, 'completed')
  }

  function markNotStarted(chapterId) {
    setChapterStatus(chapterId, 'not-started')
  }

  const stats = computeProgressStats(progress, CHAPTERS.length)

  const lastChapterData = lastChapter
    ? CHAPTERS.find(c => c.id === lastChapter) || null
    : null

  return {
    progress,         // { [chapterId]: 'not-started' | 'reading' | 'completed' }
    stats,            // { completed, reading, total, pct }
    lastChapterData,  // Chapter object or null
    markReading,
    markCompleted,
    markNotStarted,
  }
}
