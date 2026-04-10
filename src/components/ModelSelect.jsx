import { MODELS } from '../constants'

export default function ModelSelect({ value, onChange, className = '' }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`bg-[var(--cc-card)] border border-[var(--cc-border)] rounded-lg px-3 py-2 text-sm text-[var(--cc-tx1)] focus:outline-none focus:border-[var(--cc-focus)] transition-colors ${className}`}
    >
      {Object.entries(MODELS).map(([, data]) => (
        <optgroup key={data.label} label={data.label}>
          {data.models.map((m) => (
            <option key={m.id} value={m.id}>{m.label}</option>
          ))}
        </optgroup>
      ))}
    </select>
  )
}
