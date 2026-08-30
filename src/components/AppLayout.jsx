import { Outlet } from 'react-router-dom';
import Header from './Header';

// The frame every signed-in screen sits in: header on top, 420px column below.
export default function AppLayout() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-content px-4 py-[18px]">
        <Outlet />
      </main>
    </div>
  );
}
