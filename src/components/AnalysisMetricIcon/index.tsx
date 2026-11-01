type MetricIconKind = 'emissions' | 'categories' | 'records' | 'gases'
export default function AnalysisMetricIcon({ kind }: { kind: MetricIconKind }) {
  return <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    {kind === 'emissions' && <><path d="M3 20h18M6 16v-5m6 5V6m6 10V3" /><path d="m15 5 3-3 3 3" /></>}
    {kind === 'categories' && <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>}
    {kind === 'records' && <><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 7h8M8 12h8M8 17h5" /></>}
    {kind === 'gases' && <><path d="M9 3h6M10 3v6L4.5 18a2 2 0 0 0 1.7 3h11.6a2 2 0 0 0 1.7-3L14 9V3M8 14h8" /><path d="M10 17h.01M14 18h.01" /></>}
  </svg>
}
