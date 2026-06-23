import { Sidebar } from "@/components/admin/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-slate-100/40 px-6">
          <div className="flex-1">
            <h1 className="font-semibold text-lg">Dashboard</h1>
          </div>
          {/* User Profile / Logout goes here */}
        </header>
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
