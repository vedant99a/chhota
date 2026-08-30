// design.md bans spinners. While auth is resolving we show one muted line.
export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <span className="text-label text-muted">Loading</span>
    </div>
  );
}
