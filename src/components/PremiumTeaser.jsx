import { Crown } from 'lucide-react'

/**
 * Placeholder for features reserved for a future paid tier (no payment UI).
 *
 * @param {object} props
 * @param {string} props.title
 * @param {string} props.description
 * @param {string} [props.className]
 */
export default function PremiumTeaser({ title, description, className = '' }) {
  return (
    <div
      className={`rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-5 text-left shadow-sm ${className}`}
    >
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
          <Crown className="h-5 w-5" aria-hidden />
        </span>
        <div className="min-w-0 space-y-1">
          <p className="font-semibold text-amber-950">{title}</p>
          <p className="text-sm text-amber-900/85">{description}</p>
          <p className="text-xs text-amber-800/70">Modalità Premium: pagamenti e abbonamenti saranno introdotti in un secondo momento.</p>
        </div>
      </div>
    </div>
  )
}
