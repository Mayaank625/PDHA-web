import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAnnouncements } from "@/lib/actions/announcements";
import { Megaphone, Calendar } from "lucide-react";

export default async function AnnouncementsPage() {
  const res = await getAnnouncements();

  const announcements = res.success && res.data && res.data.length > 0
    ? res.data
    : [
        {
          _id: "1",
          title: "Selection Trials for U-17 State Championship",
          publishDate: new Date(Date.now() - 2 * 86400000).toISOString(),
          type: "Notice",
          content: "The Pune District Handball Association is pleased to announce the selection trials for the upcoming State Level U-17 Championship. All interested players must report to the Shiv Chhatrapati Sports Complex at 8:00 AM sharp with their original age proof documents.",
        },
        {
          _id: "2",
          title: "PDHA Winter Cup 2024 Registrations Open",
          publishDate: new Date(Date.now() - 5 * 86400000).toISOString(),
          type: "Event",
          content: "Registrations for the highly anticipated PDHA Winter Cup are now officially open. Teams from across the district can register online through this portal. The last date for team registration is Nov 1st.",
        },
        {
          _id: "3",
          title: "Level-1 Coaching & Referee Certification Clinic",
          publishDate: new Date(Date.now() - 10 * 86400000).toISOString(),
          type: "News",
          content: "In collaboration with the State Association, PDHA is hosting a Level-1 Coaching and Referee Certification program next month. Limited seats available. Contact the office for registration details.",
        },
      ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <section className="bg-blue-950 py-12 border-b text-white">
        <div className="container px-4 md:px-6">
          <Badge className="bg-orange-500 text-white font-medium mb-2">Notices & News</Badge>
          <h1 className="text-3xl md:text-4xl font-bold">Announcements & Notices</h1>
          <p className="text-blue-200 mt-2 max-w-2xl">
            Latest official notices, trial schedules, rule changes, and district events from the Pune District Handball Association.
          </p>
        </div>
      </section>

      <section className="py-12 flex-1">
        <div className="container px-4 md:px-6 max-w-4xl mx-auto space-y-6">
          {announcements.map((item: any) => (
            <Card key={item._id} className="border border-slate-200 shadow-xs hover:shadow-md transition-shadow bg-white rounded-2xl overflow-hidden">
              <CardHeader className="pb-3 border-b bg-slate-50/50">
                <div className="flex justify-between items-center mb-1">
                  <Badge variant={item.type === "Notice" ? "destructive" : item.type === "Event" ? "default" : "secondary"}>
                    {item.type}
                  </Badge>
                  <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {new Date(item.publishDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <CardTitle className="text-xl font-bold text-slate-900">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-slate-700 leading-relaxed text-sm whitespace-pre-wrap">{item.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
