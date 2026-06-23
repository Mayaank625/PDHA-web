import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function ScheduleResultsPage() {
  const matches = [
    { id: 1, date: "2023-11-10 10:00 AM", tournament: "Winter Cup 2023", teamA: "Pune Panthers", teamB: "Deccan Warriors", status: "Scheduled", scoreA: null, scoreB: null, stage: "Group Stage" },
    { id: 2, date: "2023-11-10 11:30 AM", tournament: "Winter Cup 2023", teamA: "Shivaji Lions", teamB: "Balewadi Bulls", status: "Scheduled", scoreA: null, scoreB: null, stage: "Group Stage" },
    { id: 3, date: "2023-10-25 04:00 PM", tournament: "State Selection", teamA: "Pune City", teamB: "PCMC Stars", status: "Completed", scoreA: 24, scoreB: 21, stage: "Final" },
    { id: 4, date: "2023-10-24 02:00 PM", tournament: "State Selection", teamA: "Pune City", teamB: "Kothrud Kings", status: "Completed", scoreA: 18, scoreB: 15, stage: "Semi-Final" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <section className="bg-white py-12 border-b">
        <div className="container px-4 md:px-6">
          <h1 className="text-3xl font-bold text-slate-900">Match Schedule & Results</h1>
          <p className="text-slate-600 mt-2">Track fixtures, live scores, and tournament results.</p>
        </div>
      </section>

      <section className="py-12 flex-1">
        <div className="container px-4 md:px-6 max-w-6xl mx-auto">
          <Tabs defaultValue="schedule" className="w-full bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <TabsList>
                <TabsTrigger value="schedule">Upcoming Matches</TabsTrigger>
                <TabsTrigger value="results">Results</TabsTrigger>
              </TabsList>
              {/* Future Filter Controls (Tournament, Date) can go here */}
            </div>
            
            <TabsContent value="schedule">
              <div className="rounded-md border">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Tournament</TableHead>
                      <TableHead>Stage</TableHead>
                      <TableHead>Match</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {matches.filter(m => m.status === "Scheduled").map((match) => (
                      <TableRow key={match.id}>
                        <TableCell className="font-medium whitespace-nowrap">{match.date}</TableCell>
                        <TableCell>{match.tournament}</TableCell>
                        <TableCell>{match.stage}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-900">{match.teamA}</span>
                            <span className="text-slate-400 text-xs">vs</span>
                            <span className="font-semibold text-slate-900">{match.teamB}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Scheduled</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="results">
              <div className="rounded-md border">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Tournament</TableHead>
                      <TableHead>Stage</TableHead>
                      <TableHead>Match Result</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {matches.filter(m => m.status === "Completed").map((match) => {
                      const teamAWon = match.scoreA! > match.scoreB!;
                      const teamBWon = match.scoreB! > match.scoreA!;
                      
                      return (
                        <TableRow key={match.id}>
                          <TableCell className="font-medium whitespace-nowrap">{match.date.split(' ')[0]}</TableCell>
                          <TableCell>{match.tournament}</TableCell>
                          <TableCell>{match.stage}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <span className={`font-semibold ${teamAWon ? 'text-blue-700' : 'text-slate-600'}`}>{match.teamA}</span>
                              <Badge variant="secondary" className="font-mono text-sm px-2">
                                {match.scoreA} - {match.scoreB}
                              </Badge>
                              <span className={`font-semibold ${teamBWon ? 'text-blue-700' : 'text-slate-600'}`}>{match.teamB}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-none">Completed</Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
