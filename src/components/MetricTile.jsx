// design.md: surface background, no border, 8px radius, 12px padding,
// 11px muted label on top, 20px mono number below.
export default function MetricTile({ label, value }) {
  return (
    <div className="flex flex-1 flex-col gap-2 rounded-lg bg-surface p-3">
      <span className="text-label text-muted">{label}</span>
      <span className="font-mono text-metric">{value}</span>
    </div>
  );
}
