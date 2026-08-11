import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getMatches } from "@/lib/actions/matches";
import { Calendar, MapPin, Trophy, Clock, CheckCircle2 } from "lucide-react";

export default async function ScheduleResultsPage() {
  const res = await getMatches();

  const allMatches = res.success && res.data && res.data.length > 0
    ? res.data
    : [
        {
          _id: "1",
          matchDate: new Date(Date.now() + 86400000).toISOString(),
          tournamentTitle: "Winter Cup 2024",
          teamA: "Pune Panthers",
          teamB: "Deccan Warriors",
          venue: "Shiv Chhatrapati Sports Complex",
          status: "Scheduled",
          scoreA: 0,
          scoreB: 0,
          stage: "Group Stage",
        },
        {
          _id: "2",
          matchDate: new Date(Date.now() + 2 * 86400000).toISOString(),
          tournamentTitle: "Winter Cup 2024",
          teamA: "Shivaji Lions",
          teamB: "Balewadi Bulls",
          venue: "Shiv Chhatrapati Sports Complex",
          status: "Scheduled",
          scoreA: 0,
          scoreB: 0,
          stage: "Group Stage",
        },
        {
          _id: "3",
          matchDate: new Date(Date.now() - 3 * 86400000).toISOString(),
          tournamentTitle: "State Selection Trials",
          teamA: "Pune City",
          teamB: "PCMC Stars",
          venue: "Balewadi Stadium",
          status: "Completed",
          scoreA: 24,
          scoreB: 21,
          stage: "Final",
        },
        {
          _id: "4",
          matchDate: new Date(Date.now() - 4 * 86400000).toISOString(),
          tournamentTitle: "State Selection Trials",
          teamA: "Pune City",
          teamB: "Kothrud Kings",
          venue: "Balewadi Stadium",
          status: "Completed",
          scoreA: 18,
          scoreB: 15,
          stage: "Semi-Final",
        },
      ];

  const scheduledMatches = allMatches.filter((m: any) => m.status === "Scheduled");
  const completedMatches = allMatches.filter((m: any) => m.status === "Completed");

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <section className="bg-blue-950 py-12 border-b text-white">
        <div className="container px-4 md:px-6">
          <Badge className="bg-orange-500 text-white font-medium mb-2">Fixtures & Results</Badge>
          <h1 className="text-3xl md:text-4xl font-bold">Match Schedule & Live Results</h1>
          <p className="text-blue-200 mt-2 max-w-2xl">
            Track real-time handball fixtures, match venues, timings, and official match scorecards across Pune district.
          </p>
        </div>
      </section>

      <section className="py-12 flex-1">
        <div className="container px-4 md:px-6 max-w-6xl mx-auto">
          <Tabs defaultValue="schedule" className="w-full bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <TabsList className="bg-slate-100 p-1">
                <TabsTrigger value="schedule" className="font-semibold gap-2">
                  <Clock className="w-4 h-4" />
                  Upcoming Fixtures ({scheduledMatches.length})
                </TabsTrigger>
                <TabsTrigger value="results" className="font-semibold gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Completed Results ({completedMatches.length})
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Upcoming Matches Tab */}
            <TabsContent value="schedule" className="space-y-4 m-0">
              {scheduledMatches.length === 0 ? (
                <div className="text-center py-16">
                  <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <h3 className="font-bold text-slate-800 text-base">No upcoming matches scheduled</h3>
                  <p className="text-xs text-slate-500 mt-1">Fixtures will be published once tournament brackets are finalized.</p>
                </div>
              ) : (
                <div className="rounded-xl border border-slate-200 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-slate-50/75">
                      <TableRow>
                        <TableHead className="w-[180px]">Date & Time</TableHead>
                        <TableHead>Tournament</TableHead>
                        <TableHead>Stage</TableHead>
                        <TableHead>Match Fixture</TableHead>
                        <TableHead>Venue</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {scheduledMatches.map((match: any) => (
                        <TableRow key={match._id} className="hover:bg-slate-50/50">
                          <TableCell className="font-medium whitespace-nowrap text-xs text-slate-900">
                            <div className="font-semibold">
                              {new Date(match.matchDate).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </div>
                            <div className="text-slate-500 font-normal">
                              {new Date(match.matchDate).toLocaleTimeString("en-IN", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </TableCell>
                          <TableCell className="text-xs font-semibold text-blue-900">
                            {match.tournamentTitle}
                          </TableCell>
                          <TableCell className="text-xs text-slate-600 font-medium">
                            {match.stage}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                              <span>{match.teamA}</span>
                              <span className="text-xs text-slate-400 font-normal">vs</span>
                              <span>{match.teamB}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs text-slate-600">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                              {match.venue}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                              Scheduled
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>

            {/* Results Tab */}
            <TabsContent value="results" className="space-y-4 m-0">
              {completedMatches.length === 0 ? (
                <div className="text-center py-16">
                  <Trophy className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <h3 className="font-bold text-slate-800 text-base">No match results recorded yet</h3>
                </div>
              ) : (
                <div className="rounded-xl border border-slate-200 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-slate-50/75">
                      <TableRow>
                        <TableHead className="w-[140px]">Date</TableHead>
                        <TableHead>Tournament</TableHead>
                        <TableHead>Stage</TableHead>
                        <TableHead>Match Result Scorecard</TableHead>
                        <TableHead>Venue</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {completedMatches.map((match: any) => {
                        const teamAWon = match.scoreA > match.scoreB;
                        const teamBWon = match.scoreB > match.scoreA;

                        return (
                          <TableRow key={match._id} className="hover:bg-slate-50/50">
                            <TableCell className="font-medium whitespace-nowrap text-xs text-slate-700">
                              {new Date(match.matchDate).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </TableCell>
                            <TableCell className="text-xs font-semibold text-blue-900">
                              {match.tournamentTitle}
                            </TableCell>
                            <TableCell className="text-xs text-slate-600 font-medium">
                              {match.stage}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <span className={`text-sm font-bold ${teamAWon ? "text-blue-900" : "text-slate-600"}`}>
                                  {match.teamA}
                                </span>
                                <Badge className="font-mono text-xs px-2.5 py-0.5 bg-slate-900 text-white">
                                  {match.scoreA} - {match.scoreB}
                                </Badge>
                                <span className={`text-sm font-bold ${teamBWon ? "text-blue-900" : "text-slate-600"}`}>
                                  {match.teamB}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-xs text-slate-600">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                {match.venue}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 text-xs">
                                Completed
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
