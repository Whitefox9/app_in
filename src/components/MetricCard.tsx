interface MetricCardProps {
  label: string
  value: string | number
  tone?: 'blue' | 'green' | 'amber' | 'red'
}

export function MetricCard({ label, value, tone = 'blue' }: MetricCardProps) {
  return (
    <article className={`metric-card ${tone}`}>
      <strong>{value}</strong>
      <span>{label}</span>
    </article>
  )
}
