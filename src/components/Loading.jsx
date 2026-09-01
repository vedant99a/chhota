import { useEffect, useState } from 'react';

// design.md bans spinners. While auth is resolving we show one muted line.
//
// If it is still going after a few seconds something is wrong — almost always
// a content blocker sitting on firestore.googleapis.com, or no connection. Say
// so, rather than leaving a blank screen that reads as a broken app.
export default function Loading() {
  const [stalled, setStalled] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStalled(true), 6000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center">
      <span className="text-label text-muted">Loading</span>
      {stalled && (
        <p className="max-w-[300px] text-body text-muted">
          Still loading. A content blocker or ad blocker can block this app from
          reaching its database. Turn it off for this site and reload.
        </p>
      )}
    </div>
  );
}
