import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AdminRegistrationsPage() {
  const players = [
    { id: "P001", name: "Rahul Sharma", age: 16, category: "U-17 Boys", district: "Pune", status: "Pending" },
    { id: "P002", name: "Anjali Deshmukh", age: 15, category: "U-17 Girls", district: "Pune", status: "Approved" },
    { id: "P003", name: "Suresh Patil", age: 22, category: "Senior Men", district: "Pimpri", status: "Pending" },
  ];

  const teams = [
    { id: "TM01", name: "Pune Panthers", manager: "Ravi Kumar", category: "Senior Men", status: "Approved" },
    { id: "TM02", name: "Shivaji Lions", manager: "Priya Singh", category: "U-17 Boys", status: "Pending" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Registrations Management</h2>
        <p className="text-slate-500">Review and approve player and team registrations.</p>
      </div>

      <Tabs defaultValue="players" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="players">Player Registrations</TabsTrigger>
          <TabsTrigger value="teams">Team Registrations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="players">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reg ID</TableHead>
                  <TableHead>Player Name</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>District</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {players.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.id}</TableCell>
                    <TableCell className="font-semibold">{p.name}</TableCell>
                    <TableCell>{p.age}</TableCell>
                    <TableCell>{p.category}</TableCell>
                    <TableCell>{p.district}</TableCell>
                    <TableCell>
                      <Badge variant={p.status === 'Approved' ? 'default' : 'secondary'} className={p.status === 'Approved' ? 'bg-green-500 hover:bg-green-600' : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'}>
                        {p.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {p.status === 'Pending' && (
                        <>
                          <Button variant="ghost" size="sm" className="text-green-600 hover:bg-green-50">Approve</Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50">Reject</Button>
                        </>
                      )}
                      <Button variant="ghost" size="sm">View</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="teams">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Team ID</TableHead>
                  <TableHead>Team Name</TableHead>
                  <TableHead>Manager</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teams.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium">{t.id}</TableCell>
                    <TableCell className="font-semibold">{t.name}</TableCell>
                    <TableCell>{t.manager}</TableCell>
                    <TableCell>{t.category}</TableCell>
                    <TableCell>
                      <Badge variant={t.status === 'Approved' ? 'default' : 'secondary'} className={t.status === 'Approved' ? 'bg-green-500 hover:bg-green-600' : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'}>
                        {t.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {t.status === 'Pending' && (
                        <>
                          <Button variant="ghost" size="sm" className="text-green-600 hover:bg-green-50">Approve</Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50">Reject</Button>
                        </>
                      )}
                      <Button variant="ghost" size="sm">View</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
