// design.md: surface background, 1px border, 44px tall, muted placeholder,
// border turns amber on focus, and no focus glow.
export default function TextField({ id, label, ...rest }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-label text-muted">
        {label}
      </label>
      <input
        id={id}
        className="h-11 rounded-lg border border-border bg-surface px-3 text-body text-text placeholder:text-muted transition-colors focus:border-accent focus:outline-none"
        {...rest}
      />
    </div>
  );
}
