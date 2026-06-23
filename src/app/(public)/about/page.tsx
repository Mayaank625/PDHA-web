import { Card, CardContent } from "@/components/ui/card";
import { getSiteSettings } from "@/lib/actions/settings";

export default async function AboutPage() {
  const { data: settings } = await getSiteSettings();

  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-blue-950 py-16 md:py-24 text-center">
        <div className="container px-4 md:px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">About Us</h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            {settings?.heroSubtitle || "Dedicated to the growth and development of Handball."}
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white">
        <div className="container px-4 md:px-6 max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-slate-900">Our History</h2>
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                {settings?.aboutHistory || "The Pune District Handball Organisation was founded with a single goal: to promote the sport of handball at the grassroots level."}
              </p>
            </div>
            <div className="h-80 bg-slate-100 rounded-2xl border flex items-center justify-center relative overflow-hidden">
                <span className="text-slate-400 font-medium">Historical Photo Placeholder</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-24">
            <Card className="border-none shadow-lg bg-blue-50">
              <CardContent className="p-8 space-y-4">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold">V</div>
                <h3 className="text-2xl font-bold text-slate-900">Our Vision</h3>
                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {settings?.aboutVision || "To make Pune the premier hub for handball talent in India by providing world-class coaching, infrastructure, and competitive opportunities."}
                </p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-lg bg-orange-50">
              <CardContent className="p-8 space-y-4">
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center text-white text-2xl font-bold">M</div>
                <h3 className="text-2xl font-bold text-slate-900">Our Mission</h3>
                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {settings?.aboutMission || "To discover, nurture, and empower young athletes through structured training programs and transparent, high-quality tournaments."}
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center space-y-12">
            <h2 className="text-3xl font-bold text-slate-900">Executive Committee</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { name: "Mr. XYZ", role: "President" },
                { name: "Mr. ABC", role: "Secretary" },
                { name: "Mrs. PQR", role: "Treasurer" },
                { name: "Mr. LMN", role: "Joint Secretary" },
              ].map((member, i) => (
                <div key={i} className="flex flex-col items-center space-y-4">
                  <div className="w-32 h-32 rounded-full bg-slate-200 overflow-hidden border-4 border-white shadow-lg"></div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">{member.name}</h4>
                    <p className="text-orange-500 font-medium text-sm">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
