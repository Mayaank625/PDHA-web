import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function AdminTournamentsPage() {
  const tournaments = [
    { id: "T1", title: "PDHO Winter Cup 2023", status: "Upcoming", teams: 16, date: "Nov 10, 2023" },
    { id: "T2", title: "State Selection Championship", status: "Ongoing", teams: 8, date: "Oct 20, 2023" },
    { id: "T3", title: "Summer Slam 2023", status: "Past", teams: 24, date: "May 15, 2023" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Tournaments Management</h2>
          <p className="text-slate-500">Create and manage handball tournaments.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          + Create Tournament
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>Teams Registered</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tournaments.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium">{t.id}</TableCell>
                <TableCell className="font-semibold">{t.title}</TableCell>
                <TableCell>{t.date}</TableCell>
                <TableCell>{t.teams}</TableCell>
                <TableCell>
                  <Badge variant={t.status === 'Ongoing' ? 'default' : t.status === 'Upcoming' ? 'secondary' : 'outline'}
                         className={t.status === 'Ongoing' ? 'bg-orange-500 hover:bg-orange-600' : ''}>
                    {t.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">Edit</Button>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50">Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
