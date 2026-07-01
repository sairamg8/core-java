// Valid statuses: 'not-started' | 'in-progress' | 'paused' | 'completed'
const KEY = 'java-bible-progress'

function load() {
  try { return JSON.parse(localStorage.getItem(KEY) || '{}') }
  catch { return {} }
}

function save(data) {
  localStorage.setItem(KEY, JSON.stringify(data))
}

export function getStatus(step) {
  return load()[step] || 'not-started'
}

export function setStatus(step, status) {
  const data = load()
  data[step] = status
  save(data)
  window.dispatchEvent(new CustomEvent('progress-changed'))
}

export function getAllProgress() {
  return load()
}

export function getLastVisited() {
  return parseInt(localStorage.getItem('java-bible-last') || '0', 10)
}

export function setLastVisited(step) {
  localStorage.setItem('java-bible-last', String(step))
}

export function clearAll() {
  localStorage.removeItem(KEY)
  localStorage.removeItem('java-bible-last')
  window.dispatchEvent(new CustomEvent('progress-changed'))
}
