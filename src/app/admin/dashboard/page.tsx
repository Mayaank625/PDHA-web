import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getRegistrationStats, getRegistrations } from "@/lib/actions/register";
import { Users, Shield, Clock, CheckCircle2, ArrowRight } from "lucide-react";

export default async function AdminDashboardPage() {
  const [statsRes, regRes] = await Promise.all([
    getRegistrationStats(),
    getRegistrations(),
  ]);

  const stats = statsRes.success && statsRes.data ? statsRes.data : {
    players: { total: 0, pending: 0, approved: 0, rejected: 0 },
    teams: { total: 0, pending: 0, approved: 0, rejected: 0 },
    totalCombined: 0,
    pendingCombined: 0,
    approvedCombined: 0,
    rejectedCombined: 0,
  };

  const recentPlayers = regRes.success && regRes.data ? regRes.data.players.slice(0, 3) : [];
  const recentTeams = regRes.success && regRes.data ? regRes.data.teams.slice(0, 2) : [];

  const activityList = [
    ...recentPlayers.map((p: any) => ({
      id: p._id,
      title: "Player Registration",
      subtitle: `${p.fullName} (${p.position}, ${p.district})`,
      status: p.registrationStatus,
      date: p.createdAt,
      type: "player",
    })),
    ...recentTeams.map((t: any) => ({
      id: t._id,
      title: "Team Registration",
      subtitle: `${t.name} (${t.category}) • Mgr: ${t.managerName}`,
      status: t.status,
      date: t.createdAt,
      type: "team",
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard Overview</h2>
          <p className="text-slate-500">Welcome back. Here is what is happening across the association today.</p>
        </div>
        <Button render={<Link href="/admin/dashboard/registrations" />} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
          Manage Registrations
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Total Players
            </CardTitle>
            <Users className="w-5 h-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{stats.players.total}</div>
            <p className="text-xs text-slate-500 mt-1">
              {stats.players.approved} approved • {stats.players.pending} pending
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Registered Teams
            </CardTitle>
            <Shield className="w-5 h-5 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{stats.teams.total}</div>
            <p className="text-xs text-slate-500 mt-1">
              {stats.teams.approved} approved • {stats.teams.pending} pending
            </p>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50/40 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-amber-800">
              Pending Approvals
            </CardTitle>
            <Clock className="w-5 h-5 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-900">{stats.pendingCombined}</div>
            <p className="text-xs text-amber-700 mt-1">
              {stats.players.pending} players, {stats.teams.pending} teams awaiting review
            </p>
          </CardContent>
        </Card>

        <Card className="border-emerald-200 bg-emerald-50/40 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-emerald-800">
              Approved Entries
            </CardTitle>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-900">{stats.approvedCombined}</div>
            <p className="text-xs text-emerald-700 mt-1">
              Eligible for tournament brackets
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Registration Activity</CardTitle>
            <Link href="/admin/dashboard/registrations" className="text-xs font-semibold text-blue-600 hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activityList.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-sm">
                  No registrations recorded yet.
                </div>
              ) : (
                activityList.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                        item.type === "player" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                      }`}>
                        {item.type === "player" ? "PL" : "TM"}
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-sm font-semibold text-slate-900 leading-none">{item.title}</p>
                        <p className="text-xs text-slate-500">{item.subtitle}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={`text-xs ${
                        item.status === "Approved"
                          ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                          : item.status === "Rejected"
                          ? "bg-rose-100 text-rose-800 border-rose-300"
                          : "bg-amber-100 text-amber-800 border-amber-300"
                      }`}>
                        {item.status}
                      </Badge>
                      <span className="text-xs text-slate-400 hidden sm:inline">
                        {new Date(item.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Upcoming Matches</CardTitle>
            <Link href="/admin/dashboard/matches" className="text-xs font-semibold text-blue-600 hover:underline">
              Manage
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { time: "Tomorrow, 10:00 AM", event: "PDHO Winter Cup", teamA: "Pune Panthers", teamB: "Deccan Warriors" },
                { time: "Nov 15, 2:30 PM", event: "U-17 District Cup", teamA: "Shivaji Lions", teamB: "Balewadi Handball Club" },
                { time: "Nov 16, 4:00 PM", event: "PDHO Winter Cup", teamA: "Khadki Strikers", teamB: "Pune Panthers" },
              ].map((m, i) => (
                <div key={i} className="flex flex-col space-y-2 p-3 bg-slate-50/60 rounded-lg border border-slate-100">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-[10px]">{m.time}</Badge>
                    <span className="text-xs font-semibold text-orange-600">{m.event}</span>
                  </div>
                  <div className="flex items-center justify-between font-semibold text-xs text-slate-800">
                    <span>{m.teamA}</span>
                    <span className="text-slate-400 font-normal">vs</span>
                    <span>{m.teamB}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
