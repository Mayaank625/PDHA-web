import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AnnouncementsPage() {
  const announcements = [
    {
      id: 1,
      title: "Upcoming Selection Trials for U-17",
      date: "Oct 15, 2023",
      type: "Notice",
      content: "The Pune District Handball Organisation is pleased to announce the selection trials for the upcoming State Level U-17 Championship. All interested players must report to the Shiv Chhatrapati Sports Complex at 8:00 AM sharp with their original age proof documents."
    },
    {
      id: 2,
      title: "PDHO Winter Cup 2023 Registrations Open",
      date: "Oct 10, 2023",
      type: "Event",
      content: "Registrations for the highly anticipated PDHO Winter Cup 2023 are now officially open. Teams from across the district can register online through this portal. The last date for team registration is Nov 1st."
    },
    {
      id: 3,
      title: "New Coaching Certification Program",
      date: "Oct 5, 2023",
      type: "News",
      content: "In collaboration with the State Association, PDHO is hosting a Level-1 Coaching Certification program next month. Limited seats available. Contact the office for more details."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <section className="bg-white py-12 border-b">
        <div className="container px-4 md:px-6">
          <h1 className="text-3xl font-bold text-slate-900">Announcements & Notices</h1>
          <p className="text-slate-600 mt-2">Latest updates from the Pune District Handball Organisation.</p>
        </div>
      </section>

      <section className="py-12 flex-1">
        <div className="container px-4 md:px-6 max-w-4xl mx-auto space-y-6">
          {announcements.map((item) => (
            <Card key={item.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center mb-2">
                  <Badge variant={item.type === 'Notice' ? 'destructive' : item.type === 'Event' ? 'default' : 'secondary'} 
                         className={item.type === 'Event' ? 'bg-orange-500' : ''}>
                    {item.type}
                  </Badge>
                  <span className="text-sm text-slate-500 font-medium">{item.date}</span>
                </div>
                <CardTitle className="text-xl text-blue-900">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 leading-relaxed">{item.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
