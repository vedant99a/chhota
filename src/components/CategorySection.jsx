// design.md: a category gets a 4px vertical amber bar at 40% opacity on the
// left of its heading. That is the entire visual treatment — no icons.
export default function CategorySection({ label, children }) {
  return (
    <section className="flex flex-col">
      <div className="mb-2 flex items-center gap-3">
        <span className="h-4 w-1 bg-accent/40" />
        <h2 className="text-label text-muted">{label}</h2>
      </div>
      {children}
    </section>
  );
}
