import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle({ dark, setDark }) {
  return (
    <button
      onClick={() => setDark(d => !d)}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      title="Toggle theme"
    >
      {dark ? <Sun size={15} /> : <Moon size={15} />}
      <span>{dark ? 'Light' : 'Dark'}</span>
    </button>
  )
}
