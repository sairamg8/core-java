/**
 * React Bible — progress tracking (separate from Java Bible progress)
 *
 * Tracks which chapters the user has read in the React Bible.
 * Stored under a different localStorage key to avoid any conflict
 * with the Java Bible's progress system.
 *
 * Statuses: 'not-started' | 'reading' | 'completed'
 */

const REACT_BIBLE_KEY = 'react-bible-progress'
const REACT_BIBLE_LAST_KEY = 'react-bible-last-chapter'

function load() {
  try { return JSON.parse(localStorage.getItem(REACT_BIBLE_KEY) || '{}') }
  catch { return {} }
}

function save(data) {
  try { localStorage.setItem(REACT_BIBLE_KEY, JSON.stringify(data)) }
  catch (err) {
    // QuotaExceededError or similar — progress tracking is non-critical,
    // so we silently fail rather than disrupting the reading experience.
    console.warn('[react-bible] Could not save progress:', err)
  }
}

export function getChapterStatus(chapterId) {
  return load()[chapterId] || 'not-started'
}

export function setChapterStatus(chapterId, status) {
  const data = load()
  data[chapterId] = status
  save(data)
  window.dispatchEvent(new CustomEvent('react-bible-progress-changed'))
}

export function getAllChapterProgress() {
  return load()
}

export function getLastChapter() {
  return localStorage.getItem(REACT_BIBLE_LAST_KEY) || null
}

export function setLastChapter(chapterId) {
  try { localStorage.setItem(REACT_BIBLE_LAST_KEY, chapterId) }
  catch { /* non-critical */ }
}

export function clearAllProgress() {
  localStorage.removeItem(REACT_BIBLE_KEY)
  localStorage.removeItem(REACT_BIBLE_LAST_KEY)
  window.dispatchEvent(new CustomEvent('react-bible-progress-changed'))
}

/** Compute summary stats from raw progress object */
export function computeProgressStats(progress, totalChapters) {
  const completed = Object.values(progress).filter(s => s === 'completed').length
  const reading   = Object.values(progress).filter(s => s === 'reading').length
  const pct = totalChapters > 0 ? Math.round((completed / totalChapters) * 100) : 0
  return { completed, reading, total: totalChapters, pct }
}
