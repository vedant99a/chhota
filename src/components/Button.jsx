// design.md: 44px tall, 8px radius, one primary button per screen maximum.
// Primary is amber with canvas-coloured text; secondary and danger are outlines.
const VARIANTS = {
  primary: 'bg-accent text-canvas border border-accent hover:bg-[#E09B33]',
  secondary: 'bg-transparent text-text border border-border hover:border-muted',
  danger: 'bg-transparent text-danger border border-danger hover:bg-danger/10',
};

export default function Button({
  variant = 'primary',
  type = 'button',
  fullWidth = false,
  disabled = false,
  children,
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={[
        'h-11 rounded-lg px-4 text-body transition-colors',
        VARIANTS[variant],
        fullWidth ? 'w-full' : '',
        disabled ? 'opacity-50' : '',
      ].join(' ')}
      {...rest}
    >
      {children}
    </button>
  );
}
