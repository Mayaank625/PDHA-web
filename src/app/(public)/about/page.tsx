import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getSiteSettings } from "@/lib/actions/settings";
import { Mail, Phone, Shield, User } from "lucide-react";

export default async function AboutPage() {
  const { data: settings } = await getSiteSettings();

  const committee = settings?.executiveCommittee?.length
    ? settings.executiveCommittee
    : [
        { name: "Shri. Rajesh Patil", role: "President", photoUrl: "", phone: "+91 98220 12345", email: "president@pdho.org" },
        { name: "Mr. Anand Shinde", role: "General Secretary", photoUrl: "", phone: "+91 98221 23456", email: "secretary@pdho.org" },
        { name: "Mrs. Sneha Deshmukh", role: "Treasurer", photoUrl: "", phone: "+91 98222 34567", email: "treasurer@pdho.org" },
        { name: "Mr. Vikram Joshi", role: "Vice President", photoUrl: "", phone: "+91 98223 45678", email: "vp@pdho.org" },
        { name: "Mr. Sameer Kulkarni", role: "Joint Secretary", photoUrl: "", phone: "+91 98224 56789", email: "jointsec@pdho.org" },
        { name: "Coach Ramesh Jadhav", role: "Technical Director", photoUrl: "", phone: "+91 98225 67890", email: "technical@pdho.org" },
      ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Hero Header */}
      <section className="bg-blue-950 py-16 md:py-24 text-center text-white">
        <div className="container px-4 md:px-6">
          <Badge className="bg-orange-500 text-white font-medium mb-3">About PDHA</Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">About Our Association</h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto font-light leading-relaxed">
            {settings?.heroSubtitle || "Dedicated to the grassroots growth, governance, and development of Handball in Pune District."}
          </p>
        </div>
      </section>

      {/* History & Identity */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container px-4 md:px-6 max-w-5xl mx-auto space-y-20">
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-semibold">
                <Shield className="w-3.5 h-3.5" />
                Est. Pune District Body
              </div>
              <h2 className="text-3xl font-bold text-slate-900">Our History & Heritage</h2>
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap text-base">
                {settings?.aboutHistory || "The Pune District Handball Association was founded with a single goal: to promote the sport of handball at the grassroots level."}
              </p>
            </div>
            
            <div className="h-80 bg-gradient-to-tr from-blue-900 to-indigo-950 rounded-2xl border border-slate-200 flex flex-col items-center justify-center p-8 text-center text-white relative overflow-hidden shadow-md">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center opacity-25" />
              <div className="relative z-10 space-y-2">
                <div className="w-16 h-16 rounded-full bg-orange-500/90 text-white flex items-center justify-center text-2xl font-bold mx-auto shadow-lg">
                  PD
                </div>
                <h3 className="font-bold text-xl text-white">Pune District Handball</h3>
                <p className="text-xs text-blue-200 max-w-xs">Affiliated with Maharashtra State Handball Association & Olympic Association.</p>
              </div>
            </div>
          </div>

          {/* Vision & Mission Cards */}
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border border-blue-100 shadow-md bg-blue-50/70 rounded-2xl overflow-hidden">
              <CardContent className="p-8 space-y-4">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-md">
                  V
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Our Vision</h3>
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap text-sm">
                  {settings?.aboutVision || "To make Pune the premier hub for handball talent in India by providing world-class coaching, infrastructure, and competitive opportunities."}
                </p>
              </CardContent>
            </Card>

            <Card className="border border-orange-100 shadow-md bg-orange-50/70 rounded-2xl overflow-hidden">
              <CardContent className="p-8 space-y-4">
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-md">
                  M
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Our Mission</h3>
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap text-sm">
                  {settings?.aboutMission || "To discover, nurture, and empower young athletes through structured training programs and transparent, high-quality tournaments."}
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Executive Committee Section */}
          <div className="space-y-12 pt-8 border-t border-slate-100">
            <div className="text-center space-y-3">
              <Badge variant="outline" className="text-blue-900 border-blue-200">
                Leadership & Governance
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Executive Committee</h2>
              <p className="text-slate-500 max-w-xl mx-auto text-sm">
                Elected office bearers and managing committee members dedicated to driving handball across Pune district.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {committee.map((member: any, i: number) => (
                <div
                  key={i}
                  className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all hover:-translate-y-1"
                >
                  <div className="w-28 h-28 rounded-full bg-white overflow-hidden border-4 border-white shadow-md mb-4 flex items-center justify-center relative">
                    {member.photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={member.photoUrl}
                        alt={member.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-blue-900 to-indigo-700 text-white flex items-center justify-center text-2xl font-bold">
                        {member.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() || <User className="w-10 h-10" />}
                      </div>
                    )}
                  </div>

                  <h4 className="font-bold text-slate-900 text-lg">{member.name}</h4>
                  <Badge className="bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-100 font-semibold text-xs mt-1.5 mb-3">
                    {member.role}
                  </Badge>

                  {(member.email || member.phone) && (
                    <div className="text-xs text-slate-500 space-y-1 pt-2 border-t border-slate-200/60 w-full mt-auto">
                      {member.email && (
                        <div className="flex items-center justify-center gap-1.5 truncate">
                          <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{member.email}</span>
                        </div>
                      )}
                      {member.phone && (
                        <div className="flex items-center justify-center gap-1.5">
                          <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{member.phone}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
