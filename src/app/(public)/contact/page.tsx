import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getSiteSettings } from "@/lib/actions/settings";

export default async function ContactPage() {
  const { data: settings } = await getSiteSettings();

  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-slate-50 py-16 text-center border-b">
        <div className="container px-4 md:px-6">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Contact Us</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Have questions about registrations, upcoming tournaments, or partnerships? Reach out to us!
          </p>
        </div>
      </section>

      <section className="py-16 bg-white flex-1">
        <div className="container px-4 md:px-6 max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-24">
            
            {/* Contact Details */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900">Get in Touch</h2>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">📍</div>
                  <div>
                    <h4 className="font-bold text-slate-900">Office Address</h4>
                    <p className="text-slate-600 whitespace-pre-wrap">{settings?.contactAddress}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">📞</div>
                  <div>
                    <h4 className="font-bold text-slate-900">Phone</h4>
                    <p className="text-slate-600">{settings?.contactPhone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">✉️</div>
                  <div>
                    <h4 className="font-bold text-slate-900">Email</h4>
                    <p className="text-slate-600">{settings?.contactEmail}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Send us a Message</h3>
              <form className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-slate-700">Full Name</label>
                  <Input id="name" placeholder="John Doe" className="h-12" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-slate-700">Email Address</label>
                  <Input id="email" type="email" placeholder="john@example.com" className="h-12" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-slate-700">Message</label>
                  <Textarea id="message" placeholder="How can we help you?" className="min-h-[120px] resize-none" />
                </div>
                <Button type="button" className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                  Send Message
                </Button>
              </form>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
