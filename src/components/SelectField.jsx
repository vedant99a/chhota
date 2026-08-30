// Same box as TextField, so the form reads as one set of controls.
export default function SelectField({ id, label, options, ...rest }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-label text-muted">
        {label}
      </label>
      <select
        id={id}
        className="h-11 rounded-lg border border-border bg-surface px-3 text-body text-text transition-colors focus:border-accent focus:outline-none"
        {...rest}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
