import { ALL_STEPS } from '../data/roadmap'

function strip(text) {
  if (!text) return ''
  return text
    .replace(/\*\*/g, '')
    .replace(/`[^`]*`/g, m => m.slice(1, -1))
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
}

function excerpt(text, query, maxLen = 80) {
  if (!text) return ''
  const lower = text.toLowerCase()
  const idx = lower.indexOf(query.toLowerCase())
  if (idx === -1) return text.slice(0, maxLen).trimEnd() + (text.length > maxLen ? '…' : '')
  const start = Math.max(0, idx - 30)
  const end = Math.min(text.length, idx + query.length + 50)
  return (start > 0 ? '…' : '') + text.slice(start, end).trimStart() + (end < text.length ? '…' : '')
}

function buildIndex() {
  const items = []
  for (const step of ALL_STEPS) {
    for (const section of (step.sections || [])) {
      const plainExplanation = strip(section.explanation || '')
      const plainPoints = (section.points || []).map(strip).join(' ')
      const plainCallouts = (section.callouts || []).map(c => strip(c.content)).join(' ')
      const body = [plainExplanation, plainPoints, plainCallouts].join(' ')

      items.push({
        stepNumber: step.step,
        stepTitle: step.title,
        stageColor: step.stageColor,
        stageLabel: step.stageLabel,
        sectionId: section.id,
        sectionTitle: section.title || '',
        body,
        searchText: [
          step.title,
          step.subtitle || '',
          section.title || '',
          body,
        ].join(' ').toLowerCase(),
      })
    }
  }
  return items
}

const INDEX = buildIndex()

export function searchSections(query) {
  const q = query.trim()
  if (q.length < 2) return []
  const tokens = q.toLowerCase().split(/\s+/)

  return INDEX
    .filter(item => tokens.every(t => item.searchText.includes(t)))
    .map(item => {
      let score = 0
      const ql = q.toLowerCase()
      if (item.sectionTitle.toLowerCase().includes(ql)) score += 4
      if (item.stepTitle.toLowerCase().includes(ql)) score += 3
      for (const t of tokens) {
        if (item.sectionTitle.toLowerCase().includes(t)) score += 1
        if (item.stepTitle.toLowerCase().includes(t)) score += 0.5
      }
      const snippetSource = item.sectionTitle.toLowerCase().includes(ql)
        ? item.sectionTitle
        : item.body
      return { ...item, score, snippet: excerpt(snippetSource, q) }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
}
