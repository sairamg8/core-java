import { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Copy, Check } from 'lucide-react'

export default function CodeBlock({ code, language = 'java', title }) {
  const [copied, setCopied] = useState(false)
  const dark = document.documentElement.classList.contains('dark')

  const copy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 mb-5 shadow-sm">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-400" />
          <span className="w-3 h-3 rounded-full bg-yellow-400" />
          <span className="w-3 h-3 rounded-full bg-green-400" />
          {title && <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 font-mono">{title}</span>}
        </div>
        <button
          onClick={copy}
          className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        >
          {copied ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={dark ? oneDark : oneLight}
        customStyle={{
          margin: 0,
          borderRadius: 0,
          fontSize: '0.82rem',
          lineHeight: '1.6',
          padding: '1.25rem',
          background: dark ? '#1a1d23' : '#fafafa',
        }}
        showLineNumbers
        lineNumberStyle={{ color: dark ? '#4b5563' : '#9ca3af', minWidth: '2.5em' }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}
