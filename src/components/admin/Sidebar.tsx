"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Trophy,
  Calendar,
  ClipboardList,
  Megaphone,
  Images,
  Settings,
  ShieldCheck,
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Tournaments", href: "/admin/dashboard/tournaments", icon: Trophy },
    { label: "Matches & Results", href: "/admin/dashboard/matches", icon: Calendar },
    { label: "Registrations", href: "/admin/dashboard/registrations", icon: ClipboardList },
    { label: "Announcements", href: "/admin/dashboard/announcements", icon: Megaphone },
    { label: "Gallery", href: "/admin/dashboard/gallery", icon: Images },
    { label: "Site Settings", href: "/admin/dashboard/settings", icon: Settings, divider: true },
  ];

  return (
    <aside className="hidden border-r bg-slate-50 lg:block lg:w-64 min-h-screen">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-16 items-center gap-3 border-b px-6 bg-white">
          <div className="w-8 h-8 rounded-lg bg-blue-900 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            PD
          </div>
          <div>
            <Link href="/admin/dashboard" className="font-bold text-slate-900 text-base">
              PDHA Admin
            </Link>
            <div className="text-[10px] text-slate-400 font-medium">Management Portal</div>
          </div>
        </div>

        <div className="flex-1 overflow-auto py-4">
          <nav className="grid items-start px-3 text-sm font-medium gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <div key={item.href}>
                  {item.divider && <div className="my-2 border-t border-slate-200" />}
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 rounded-lg px-3.5 py-2.5 transition-all ${
                      isActive
                        ? "bg-blue-600 text-white font-semibold shadow-xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                    {item.label}
                  </Link>
                </div>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-200 bg-white m-3 rounded-xl shadow-2xs">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-medium">Administrator Session</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
