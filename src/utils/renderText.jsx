// Converts **bold**, `code`, and newlines in explanation strings to React elements
export function renderInline(text) {
  if (!text) return null
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-gray-900 dark:text-white">{part.slice(2, -2)}</strong>
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i} className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-orange-600 dark:text-orange-400 rounded text-[0.82em] font-mono">{part.slice(1, -1)}</code>
    }
    return part
  })
}

export function renderExplanation(text) {
  if (!text) return null
  return text.split('\n').map((line, i) => {
    if (line === '') return <div key={i} className="h-2" />
    return <p key={i} className="text-gray-700 dark:text-gray-300 leading-relaxed">{renderInline(line)}</p>
  })
}
