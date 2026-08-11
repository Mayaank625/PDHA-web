import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getTournaments } from "@/lib/actions/tournaments";
import Link from "next/link";
import { Calendar, MapPin, Users, Trophy } from "lucide-react";

export default async function TournamentsPage() {
  const res = await getTournaments();
  
  // Fallbacks if database has no tournaments yet
  const allTournaments = res.success && res.data && res.data.length > 0
    ? res.data
    : [
        {
          _id: "1",
          title: "PDHA Winter Cup 2024",
          status: "Upcoming",
          startDate: new Date(Date.now() + 5 * 86400000).toISOString(),
          endDate: new Date(Date.now() + 10 * 86400000).toISOString(),
          venue: "Shiv Chhatrapati Sports Complex",
          teamsCount: 16,
          description: "Annual district-level handball championship featuring elite teams from Pune.",
          registrationOpen: true,
        },
        {
          _id: "2",
          title: "State Selection Championship",
          status: "Ongoing",
          startDate: new Date(Date.now() - 2 * 86400000).toISOString(),
          endDate: new Date(Date.now() + 3 * 86400000).toISOString(),
          venue: "Balewadi Stadium",
          teamsCount: 8,
          description: "Official trials and selection tournament for the state team representation.",
          registrationOpen: false,
        },
        {
          _id: "3",
          title: "Summer Slam District Championship",
          status: "Past",
          startDate: new Date(Date.now() - 60 * 86400000).toISOString(),
          endDate: new Date(Date.now() - 55 * 86400000).toISOString(),
          venue: "Deccan Gymkhana",
          teamsCount: 24,
          description: "Grassroots summer handball championship for district clubs.",
          registrationOpen: false,
        },
      ];

  const upcomingAndOngoing = allTournaments.filter((t: any) => t.status !== "Past");
  const pastTournaments = allTournaments.filter((t: any) => t.status === "Past");

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <section className="bg-blue-950 py-12 border-b text-white">
        <div className="container px-4 md:px-6">
          <Badge className="bg-orange-500 text-white font-medium mb-2">District Tournaments</Badge>
          <h1 className="text-3xl md:text-4xl font-bold">Tournaments & Championships</h1>
          <p className="text-blue-200 mt-2 max-w-2xl">
            Browse upcoming, ongoing, and historic handball tournaments organized by the Pune District Handball Association.
          </p>
        </div>
      </section>

      <section className="py-12 flex-1">
        <div className="container px-4 md:px-6 max-w-6xl mx-auto">
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-8 bg-slate-200/80 p-1">
              <TabsTrigger value="upcoming" className="font-semibold">
                Upcoming & Ongoing ({upcomingAndOngoing.length})
              </TabsTrigger>
              <TabsTrigger value="past" className="font-semibold">
                Past Tournaments ({pastTournaments.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-6">
              {upcomingAndOngoing.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
                  <Trophy className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <h3 className="font-bold text-slate-800 text-lg">No Active Tournaments</h3>
                  <p className="text-slate-500 text-sm mt-1">Check back soon for announcements on upcoming tournaments.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingAndOngoing.map((t: any) => (
                    <TournamentCard key={t._id} tournament={t} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-6">
              {pastTournaments.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
                  <Trophy className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <h3 className="font-bold text-slate-800 text-lg">No Past Tournaments Recorded</h3>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pastTournaments.map((t: any) => (
                    <TournamentCard key={t._id} tournament={t} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}

function TournamentCard({ tournament }: { tournament: any }) {
  const isOngoing = tournament.status === "Ongoing";
  const isUpcoming = tournament.status === "Upcoming";

  return (
    <div className="flex flex-col rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-xs hover:shadow-xl transition-all duration-300">
      <div className="h-44 bg-gradient-to-tr from-blue-950 to-blue-800 relative overflow-hidden flex items-end p-5">
        {tournament.bannerUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={tournament.bannerUrl}
            alt={tournament.title}
            className="absolute inset-0 w-full h-full object-cover opacity-35"
          />
        ) : (
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center opacity-25" />
        )}
        <div className="absolute top-4 right-4">
          <Badge className={
            isOngoing
              ? "bg-orange-500 text-white font-medium shadow-xs"
              : isUpcoming
              ? "bg-emerald-500 text-white font-medium shadow-xs"
              : "bg-slate-600 text-white font-medium"
          }>
            {tournament.status}
          </Badge>
        </div>
        <h3 className="relative z-10 text-lg font-bold text-white leading-snug drop-shadow-xs">
          {tournament.title}
        </h3>
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between">
        <div className="space-y-4 mb-6">
          <p className="text-slate-600 text-sm line-clamp-2">
            {tournament.description || "Official tournament hosted by Pune District Handball Association."}
          </p>

          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>
                {new Date(tournament.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} - {new Date(tournament.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span className="truncate">{tournament.venue}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>{tournament.teamsCount || 16} Teams</span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
          {tournament.status !== "Past" && (
            <Button render={<Link href="/register/team" />} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-xs cursor-pointer">
              Register Team
            </Button>
          )}
          <Button render={<Link href="/schedule" />} variant="outline" className="flex-1 text-xs border-slate-300 hover:bg-slate-50 cursor-pointer">
            View Matches
          </Button>
        </div>
      </div>
    </div>
  );
}
