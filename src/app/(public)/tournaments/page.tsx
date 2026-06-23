import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

export default function TournamentsPage() {
  const tournaments = [
    {
      id: 1,
      title: "PDHO Winter Cup 2023",
      status: "Upcoming",
      date: "10 Nov - 15 Nov, 2023",
      venue: "Shiv Chhatrapati Sports Complex",
      teams: 16
    },
    {
      id: 2,
      title: "State Selection Championship",
      status: "Ongoing",
      date: "20 Oct - 25 Oct, 2023",
      venue: "Balewadi Stadium",
      teams: 8
    },
    {
      id: 3,
      title: "Summer Slam 2023",
      status: "Past",
      date: "15 May - 20 May, 2023",
      venue: "Deccan Gymkhana",
      teams: 24
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <section className="bg-white py-12 border-b">
        <div className="container px-4 md:px-6">
          <h1 className="text-3xl font-bold text-slate-900">Tournaments</h1>
          <p className="text-slate-600 mt-2">Browse upcoming, ongoing, and past handball tournaments in Pune District.</p>
        </div>
      </section>

      <section className="py-12 flex-1">
        <div className="container px-4 md:px-6 max-w-6xl mx-auto">
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
              <TabsTrigger value="upcoming">Upcoming & Ongoing</TabsTrigger>
              <TabsTrigger value="past">Past Tournaments</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tournaments.filter(t => t.status !== "Past").map((t) => (
                  <TournamentCard key={t.id} tournament={t} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="past" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tournaments.filter(t => t.status === "Past").map((t) => (
                  <TournamentCard key={t.id} tournament={t} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}

function TournamentCard({ tournament }: { tournament: any }) {
  return (
    <div className="flex flex-col rounded-2xl overflow-hidden border bg-white shadow-sm hover:shadow-lg transition-shadow">
      <div className="h-48 bg-slate-200 relative">
        <div className="absolute inset-0 bg-blue-900/10 mix-blend-multiply"></div>
        <div className="absolute top-4 right-4">
          <Badge className={
            tournament.status === 'Upcoming' ? 'bg-green-500 hover:bg-green-600 text-white font-medium' :
            tournament.status === 'Ongoing' ? 'bg-orange-500 hover:bg-orange-600 text-white font-medium' :
            'bg-slate-500 hover:bg-slate-600 text-white font-medium'
          }>
            {tournament.status}
          </Badge>
        </div>
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-slate-900 mb-2">{tournament.title}</h3>
        <div className="space-y-2 mb-6">
          <div className="flex items-center text-sm text-slate-600">
            <span className="w-5 h-5 mr-2 rounded-full bg-slate-100 flex items-center justify-center text-xs">📅</span>
            {tournament.date}
          </div>
          <div className="flex items-center text-sm text-slate-600">
            <span className="w-5 h-5 mr-2 rounded-full bg-slate-100 flex items-center justify-center text-xs">📍</span>
            {tournament.venue}
          </div>
          <div className="flex items-center text-sm text-slate-600">
            <span className="w-5 h-5 mr-2 rounded-full bg-slate-100 flex items-center justify-center text-xs">👥</span>
            {tournament.teams} Teams
          </div>
        </div>
        <div className="mt-auto">
          <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors">
            <Link href={`/tournaments/${tournament.id}`}>View Details</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
