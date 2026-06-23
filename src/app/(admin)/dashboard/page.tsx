import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboardPage() {
  const stats = [
    { title: "Total Tournaments", value: "12", icon: "🏆", trend: "+2 from last month" },
    { title: "Active Registrations", value: "148", icon: "📝", trend: "+24 this week" },
    { title: "Registered Teams", value: "32", icon: "🛡️", trend: "+5 this month" },
    { title: "Total Players", value: "450+", icon: "🏃", trend: "Steady growth" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard Overview</h2>
        <p className="text-slate-500">Welcome back. Here is what is happening across the organisation today.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i} className="border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                {stat.title}
              </CardTitle>
              <div className="text-xl">{stat.icon}</div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
              <p className="text-xs text-slate-500 mt-1">{stat.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center">
                  <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                    P{i}
                  </div>
                  <div className="ml-4 space-y-1 flex-1">
                    <p className="text-sm font-medium leading-none">New Player Registration</p>
                    <p className="text-sm text-slate-500">
                      John Doe submitted registration for U-17 Boys
                    </p>
                  </div>
                  <div className="ml-auto font-medium text-xs text-slate-400">
                    {i * 15}m ago
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Upcoming Matches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col space-y-2 pb-4 border-b last:border-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">Tomorrow</Badge>
                    <span className="text-xs font-semibold text-orange-500">Winter Cup</span>
                  </div>
                  <div className="flex items-center justify-between font-medium text-sm">
                    <span>Pune Panthers</span>
                    <span className="text-slate-400 text-xs">vs</span>
                    <span>Deccan Warriors</span>
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
