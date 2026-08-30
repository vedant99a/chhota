// The role is chosen once, at signup, and decides which home screen the user
// lands on afterwards. Two options, no default surprise: student is preselected.
const ROLES = [
  { value: 'student', label: 'Student' },
  { value: 'vendor', label: 'Vendor' },
];

export default function RolePicker({ value, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-label text-muted">Role</span>
      <div className="flex gap-2">
        {ROLES.map((role) => {
          const selected = value === role.value;
          return (
            <button
              key={role.value}
              type="button"
              onClick={() => onChange(role.value)}
              aria-pressed={selected}
              className={[
                'h-11 flex-1 rounded-lg border text-body transition-colors',
                selected
                  ? 'border-accent bg-surface text-accent'
                  : 'border-border bg-transparent text-muted hover:border-muted',
              ].join(' ')}
            >
              {role.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
