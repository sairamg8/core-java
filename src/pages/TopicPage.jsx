import { useParams, Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { getTopic } from '../data/registry'
import CodeBlock from '../components/CodeBlock'
import Callout from '../components/Callout'
import { renderExplanation, renderInline } from '../utils/renderText'

function SectionView({ section }) {
  return (
    <div className="mb-14">
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
                <tr key={ri} className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
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
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
              <span>{renderInline(pt)}</span>
            </li>
          ))}
        </ul>
      )}

      {section.callouts && section.callouts.map((c, i) => (
        <Callout key={i} type={c.type}>
          {c.content.split('\n').map((line, j) => (
            <span key={j}>{renderInline(line)}{j < c.content.split('\n').length - 1 && <br />}</span>
          ))}
        </Callout>
      ))}
    </div>
  )
}

export default function TopicPage() {
  const { section, id } = useParams()
  const topic = getTopic(section, id)

  if (!topic) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 dark:text-gray-600 text-lg mb-2">Topic not found</p>
        <p className="text-gray-400 dark:text-gray-600 text-sm mb-6">
          <span className="font-mono">/topic/{section}/{id}</span> hasn't been created yet.
        </p>
        <Link to="/" className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 text-sm font-medium">
          <Home size={15} /> Back to Home
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-600 mb-6">
        <Link to="/" className="hover:text-gray-600 dark:hover:text-gray-400 transition-colors">Home</Link>
        <ChevronRight size={12} />
        <span className="capitalize">{section}</span>
        <ChevronRight size={12} />
        <span className="text-gray-600 dark:text-gray-400">{topic.title}</span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
          {topic.title}
        </h1>
        {topic.subtitle && (
          <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{topic.subtitle}</p>
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          {topic.sections.map(s => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="text-xs px-2.5 py-1 rounded-full border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-orange-300 dark:hover:border-orange-700 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
            >
              {s.title}
            </a>
          ))}
        </div>
      </div>

      {/* Sections */}
      {topic.sections.map(section => (
        <div key={section.id} id={section.id}>
          <SectionView section={section} />
        </div>
      ))}
    </div>
  )
}
