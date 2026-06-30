import { Lightbulb, AlertTriangle, Info, Star, MessageSquare, Coffee } from 'lucide-react'

const TYPES = {
  analogy: {
    icon: Coffee,
    label: 'In Plain English',
    bg: 'bg-teal-50 dark:bg-teal-950/30',
    border: 'border-teal-200 dark:border-teal-800',
    icon_color: 'text-teal-500',
    label_color: 'text-teal-700 dark:text-teal-400',
    text_color: 'text-teal-900 dark:text-teal-200',
  },
  interview: {
    icon: MessageSquare,
    label: 'Interview Tip',
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    border: 'border-blue-200 dark:border-blue-800',
    icon_color: 'text-blue-500',
    label_color: 'text-blue-700 dark:text-blue-400',
    text_color: 'text-blue-900 dark:text-blue-200',
  },
  note: {
    icon: Info,
    label: 'Notable Point',
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    border: 'border-emerald-200 dark:border-emerald-800',
    icon_color: 'text-emerald-500',
    label_color: 'text-emerald-700 dark:text-emerald-400',
    text_color: 'text-emerald-900 dark:text-emerald-200',
  },
  gotcha: {
    icon: AlertTriangle,
    label: 'Gotcha / Pitfall',
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    border: 'border-amber-200 dark:border-amber-800',
    icon_color: 'text-amber-500',
    label_color: 'text-amber-700 dark:text-amber-400',
    text_color: 'text-amber-900 dark:text-amber-200',
  },
  tip: {
    icon: Lightbulb,
    label: 'Pro Tip',
    bg: 'bg-purple-50 dark:bg-purple-950/30',
    border: 'border-purple-200 dark:border-purple-800',
    icon_color: 'text-purple-500',
    label_color: 'text-purple-700 dark:text-purple-400',
    text_color: 'text-purple-900 dark:text-purple-200',
  },
  important: {
    icon: Star,
    label: 'Important',
    bg: 'bg-red-50 dark:bg-red-950/30',
    border: 'border-red-200 dark:border-red-800',
    icon_color: 'text-red-500',
    label_color: 'text-red-700 dark:text-red-400',
    text_color: 'text-red-900 dark:text-red-200',
  },
}

export default function Callout({ type = 'note', children }) {
  const t = TYPES[type] || TYPES.note
  const Icon = t.icon

  return (
    <div className={`${t.bg} ${t.border} border rounded-xl p-4 mb-5`}>
      <div className={`flex items-center gap-2 font-semibold text-sm mb-1.5 ${t.label_color}`}>
        <Icon size={15} className={t.icon_color} />
        {t.label}
      </div>
      <div className={`text-sm leading-relaxed ${t.text_color}`}>{children}</div>
    </div>
  )
}
