import Link from 'next/link';

export function Sidebar() {
  return (
    <div className="hidden border-r bg-slate-100/40 lg:block lg:w-64 min-h-screen">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-6">
          <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold text-blue-900">
            PDHO Admin
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-4 text-sm font-medium">
            <Link href="/admin/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-900 transition-all hover:text-slate-900 hover:bg-slate-200">
              Overview
            </Link>
            <Link href="/admin/dashboard/tournaments" className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-500 transition-all hover:text-slate-900 hover:bg-slate-200">
              Tournaments
            </Link>
            <Link href="/admin/dashboard/matches" className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-500 transition-all hover:text-slate-900 hover:bg-slate-200">
              Matches & Results
            </Link>
            <Link href="/admin/dashboard/registrations" className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-500 transition-all hover:text-slate-900 hover:bg-slate-200">
              Registrations
            </Link>
            <Link href="/admin/dashboard/announcements" className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-500 transition-all hover:text-slate-900 hover:bg-slate-200">
              Announcements
            </Link>
            <Link href="/admin/dashboard/gallery" className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-500 transition-all hover:text-slate-900 hover:bg-slate-200">
              Gallery
            </Link>
            <Link href="/admin/dashboard/settings" className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-500 transition-all hover:text-slate-900 hover:bg-slate-200 mt-4 border-t pt-4">
              Site Settings
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}
