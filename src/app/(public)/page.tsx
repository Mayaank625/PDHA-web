import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getSiteSettings } from "@/lib/actions/settings";

export default async function Home() {
  const { data: settings } = await getSiteSettings();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full py-24 md:py-32 lg:py-48 overflow-hidden bg-blue-950">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-blue-950/60 to-transparent" />
        <div className="container relative z-10 text-center px-4 md:px-6">
          <div className="mx-auto max-w-3xl space-y-6">
            <Badge className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 text-sm font-semibold tracking-wider uppercase rounded-full">
              Official Portal
            </Badge>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight">
              {settings?.heroTitle || "Pune District Handball Organisation"}
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto font-light leading-relaxed">
              {settings?.heroSubtitle || "Fostering excellence, teamwork, and passion for handball across the Pune district."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button render={<Link href="/register/player" />} size="lg" className="bg-orange-500 hover:bg-orange-600 text-white border-none text-base h-12 px-8 rounded-full shadow-lg shadow-orange-500/30 transition-all hover:scale-105">
                Register as Player
              </Button>
              <Button render={<Link href="/tournaments" />} size="lg" variant="outline" className="bg-white/10 text-white hover:bg-white/20 border-white/20 text-base h-12 px-8 rounded-full backdrop-blur-sm transition-all hover:scale-105">
                View Tournaments
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Announcements */}
      <section className="w-full py-16 md:py-24 bg-slate-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">Latest Announcements</h2>
            <p className="text-slate-500 md:text-lg max-w-2xl">Stay updated with the latest news, notices, and events from PDHO.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="group border-none shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">Notice</Badge>
                    <span className="text-xs text-slate-400 font-medium">Oct 15, 2023</span>
                  </div>
                  <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">Upcoming Selection Trials for U-17</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 text-sm line-clamp-3">
                    The Pune District Handball Organisation is pleased to announce the selection trials for the upcoming State Level U-17 Championship. All interested players must report to...
                  </p>
                  <Link href={`/announcements/${i}`} className="inline-flex items-center mt-4 text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors">
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

      {/* Upcoming Tournaments */}
      <section className="w-full py-16 md:py-24 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">Featured Tournaments</h2>
            <div className="h-1 w-20 bg-orange-500 rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
             {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col rounded-2xl overflow-hidden border bg-white shadow-sm hover:shadow-lg transition-shadow">
                <div className="h-48 bg-slate-200 relative">
                  <div className="absolute inset-0 bg-blue-900/10 mix-blend-multiply"></div>
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-green-500 hover:bg-green-600 text-white font-medium">Upcoming</Badge>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">PDHO Winter Cup {2023 + i}</h3>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-sm text-slate-600">
                      <span className="w-5 h-5 mr-2 rounded-full bg-slate-100 flex items-center justify-center text-xs">📅</span>
                      10 Nov - 15 Nov, 2023
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <span className="w-5 h-5 mr-2 rounded-full bg-slate-100 flex items-center justify-center text-xs">📍</span>
                      Shiv Chhatrapati Sports Complex
                    </div>
                  </div>
                  <div className="mt-auto">
                    <Button render={<Link href={`/tournaments/${i}`} />} className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
