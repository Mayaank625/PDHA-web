import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getSiteSettings } from "@/lib/actions/settings";
import { getTournaments } from "@/lib/actions/tournaments";
import { getMatches } from "@/lib/actions/matches";
import { Calendar, MapPin, Trophy, ArrowRight, Clock, CheckCircle2 } from "lucide-react";

export default async function Home() {
  const [settingsRes, tournamentsRes, matchesRes] = await Promise.all([
    getSiteSettings(),
    getTournaments(),
    getMatches(),
  ]);

  const settings = settingsRes?.data;
  
  // Default fallback tournaments if DB is brand new
  const tournaments = tournamentsRes.success && tournamentsRes.data && tournamentsRes.data.length > 0
    ? tournamentsRes.data.slice(0, 3)
    : [
        {
          _id: "default-1",
          title: "PDHA Winter Cup 2024",
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 5 * 86400000).toISOString(),
          venue: "Shiv Chhatrapati Sports Complex, Balewadi",
          status: "Upcoming",
          teamsCount: 16,
          description: "Annual district-level handball championship featuring elite teams from Pune.",
        },
        {
          _id: "default-2",
          title: "State Selection Trials Championship",
          startDate: new Date(Date.now() + 10 * 86400000).toISOString(),
          endDate: new Date(Date.now() + 15 * 86400000).toISOString(),
          venue: "Balewadi Stadium, Mahalunge",
          status: "Upcoming",
          teamsCount: 8,
          description: "Official selection tournament for the Maharashtra State handball championship.",
        },
        {
          _id: "default-3",
          title: "Junior District Summer League",
          startDate: new Date(Date.now() - 30 * 86400000).toISOString(),
          endDate: new Date(Date.now() - 25 * 86400000).toISOString(),
          venue: "Deccan Gymkhana, Pune",
          status: "Past",
          teamsCount: 24,
          description: "Grassroots youth tournament promoting young talent across schools and academies.",
        },
      ];

  // Recent matches for live scoreboard ticker
  const matches = matchesRes.success && matchesRes.data && matchesRes.data.length > 0
    ? matchesRes.data.slice(0, 4)
    : [
        {
          _id: "m-1",
          teamA: "Pune Panthers",
          teamB: "Deccan Warriors",
          matchDate: new Date(Date.now() + 86400000).toISOString(),
          venue: "Shiv Chhatrapati Sports Complex",
          stage: "Group Stage",
          scoreA: 0,
          scoreB: 0,
          status: "Scheduled",
          tournamentTitle: "Winter Cup 2024",
        },
        {
          _id: "m-2",
          teamA: "Shivaji Lions",
          teamB: "Balewadi Bulls",
          matchDate: new Date(Date.now() - 86400000).toISOString(),
          venue: "Balewadi Stadium",
          stage: "Final",
          scoreA: 28,
          scoreB: 24,
          status: "Completed",
          tournamentTitle: "State Selection",
        },
      ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full py-24 md:py-32 lg:py-44 overflow-hidden bg-blue-950">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-blue-950/70 to-transparent" />
        <div className="container relative z-10 text-center px-4 md:px-6">
          <div className="mx-auto max-w-3xl space-y-6">
            <Badge className="bg-orange-500 hover:bg-orange-600 text-white px-3.5 py-1 text-xs font-semibold tracking-wider uppercase rounded-full shadow-md">
              Official Portal
            </Badge>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
              {settings?.heroTitle || "Pune District Handball Association"}
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto font-light leading-relaxed">
              {settings?.heroSubtitle || "Fostering excellence, teamwork, and passion for handball across the Pune district."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button render={<Link href="/register/player" />} size="lg" className="bg-orange-500 hover:bg-orange-600 text-white border-none text-base h-12 px-8 rounded-full shadow-lg shadow-orange-500/30 transition-all hover:scale-105 cursor-pointer">
                Register as Player
              </Button>
              <Button render={<Link href="/tournaments" />} size="lg" variant="outline" className="bg-white/10 text-white hover:bg-white/20 border-white/20 text-base h-12 px-8 rounded-full backdrop-blur-sm transition-all hover:scale-105 cursor-pointer">
                View Tournaments
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Match Fixtures & Results Spotlight */}
      <section className="w-full bg-slate-900 border-y border-slate-800 py-6 text-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
              <h3 className="font-bold text-sm tracking-wider uppercase text-slate-200">
                Live Fixtures & Recent Match Results
              </h3>
            </div>
            <Link href="/schedule" className="text-xs text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1">
              Full Schedule & Results <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {matches.map((m: any) => (
              <div key={m._id} className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 flex flex-col justify-between space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-semibold text-slate-300 truncate max-w-[140px]">{m.tournamentTitle}</span>
                  {m.status === "Completed" ? (
                    <Badge className="bg-emerald-950 text-emerald-300 border-emerald-800 text-[10px] px-1.5 py-0">
                      Final Result
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-blue-300 border-blue-800 text-[10px] px-1.5 py-0">
                      {new Date(m.matchDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </Badge>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm font-semibold">
                    <span className="truncate max-w-[120px] text-slate-100">{m.teamA}</span>
                    {m.status === "Completed" && <span className="font-mono text-orange-400">{m.scoreA}</span>}
                  </div>
                  <div className="flex items-center justify-between text-sm font-semibold">
                    <span className="truncate max-w-[120px] text-slate-100">{m.teamB}</span>
                    {m.status === "Completed" && <span className="font-mono text-orange-400">{m.scoreB}</span>}
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-700/60">
                  <span className="truncate">{m.venue}</span>
                  <span className="text-slate-500">{m.stage}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tournaments Section */}
      <section className="w-full py-16 md:py-24 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <Badge variant="outline" className="text-blue-900 border-blue-200">
              District Competitions
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
              Featured Tournaments
            </h2>
            <div className="h-1 w-20 bg-orange-500 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {tournaments.map((t: any) => (
              <div key={t._id} className="flex flex-col rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-xs hover:shadow-xl transition-all duration-300">
                <div className="h-44 bg-gradient-to-tr from-blue-950 to-blue-800 relative overflow-hidden flex items-end p-6">
                  {t.bannerUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={t.bannerUrl}
                      alt={t.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-30"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center opacity-25" />
                  )}
                  <div className="absolute top-4 right-4">
                    <Badge className={
                      t.status === "Ongoing"
                        ? "bg-orange-500 text-white font-medium"
                        : t.status === "Upcoming"
                        ? "bg-emerald-500 text-white font-medium"
                        : "bg-slate-600 text-white font-medium"
                    }>
                      {t.status}
                    </Badge>
                  </div>
                  <h3 className="relative z-10 text-xl font-bold text-white leading-snug drop-shadow-xs">
                    {t.title}
                  </h3>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-3 mb-6">
                    <p className="text-slate-600 text-sm line-clamp-2">{t.description}</p>
                    
                    <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          {new Date(t.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} - {new Date(t.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate">{t.venue}</span>
                      </div>
                    </div>
                  </div>

                  <Button render={<Link href="/tournaments" />} className="w-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer transition-colors">
                    View Tournament Details
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button render={<Link href="/tournaments" />} variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50 font-medium">
              Browse All Tournaments →
            </Button>
          </div>
        </div>
      </section>

      {/* Latest Announcements */}
      <section className="w-full py-16 md:py-24 bg-slate-50 border-t">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">Latest Announcements</h2>
            <p className="text-slate-500 md:text-lg max-w-2xl">Stay updated with the latest news, notices, and events from PDHA.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                title: "Selection Trials for State Level U-17 Championship",
                type: "Notice",
                date: "Oct 15, 2024",
                desc: "The Pune District Handball Association announces selection trials for the State Championship. Reporting at Shiv Chhatrapati Sports Complex at 8:00 AM.",
              },
              {
                title: "PDHA Winter Cup 2024 Registrations Open",
                type: "Event",
                date: "Oct 10, 2024",
                desc: "Registrations for the highly anticipated PDHA Winter Cup are officially open. Teams and individual players can register online.",
              },
              {
                title: "Coaching & Referee Certification Clinic",
                type: "News",
                date: "Oct 05, 2024",
                desc: "Level-1 coaching and referee certification workshop will be conducted next month in coordination with the State Association.",
              },
            ].map((item, i) => (
              <Card key={i} className="group border-none shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant={item.type === "Notice" ? "destructive" : "secondary"}>
                      {item.type}
                    </Badge>
                    <span className="text-xs text-slate-400 font-medium">{item.date}</span>
                  </div>
                  <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 text-sm line-clamp-3">{item.desc}</p>
                  <Link href="/announcements" className="inline-flex items-center mt-4 text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors">
                    Read More <span className="ml-1">→</span>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button render={<Link href="/announcements" />} variant="ghost" className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 font-medium">
              View All Announcements
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
