import Link from "next/link";
import { getSiteSettings } from "@/lib/actions/settings";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export async function Footer() {
  const { data: settings } = await getSiteSettings();

  const quickLinks = settings?.quickLinks?.length
    ? settings.quickLinks
    : [
        { label: "About Us", url: "/about" },
        { label: "Tournaments", url: "/tournaments" },
        { label: "Schedule & Results", url: "/schedule" },
        { label: "Player Registration", url: "/register/player" },
        { label: "Team Registration", url: "/register/team" },
        { label: "Media Gallery", url: "/gallery" },
      ];

  const legalLinks = settings?.legalLinks?.length
    ? settings.legalLinks
    : [
        { label: "Privacy Policy", url: "#" },
        { label: "Terms of Service", url: "#" },
        { label: "Rules & Regulations", url: "#" },
        { label: "Code of Conduct", url: "#" },
      ];

  return (
    <footer className="w-full border-t bg-slate-900 text-slate-300 pt-16 pb-12">
      <div className="container px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Brand & Mission */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            {settings?.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={settings.logoUrl} alt="Logo" className="w-9 h-9 object-contain rounded" />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-sm flex items-center justify-center">
                PD
              </div>
            )}
            <h3 className="font-bold text-lg text-white">
              {settings?.siteName || "Pune District Handball Association"}
            </h3>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            {settings?.heroSubtitle || "Promoting, governing, and advancing handball across Pune district."}
          </p>
          
          {/* Social Links */}
          <div className="flex items-center gap-3 pt-2">
            {settings?.socialFacebook && (
              <a
                href={settings.socialFacebook}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white flex items-center justify-center text-xs transition-colors"
                title="Facebook"
              >
                FB
              </a>
            )}
            {settings?.socialInstagram && (
              <a
                href={settings.socialInstagram}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-pink-600 text-slate-300 hover:text-white flex items-center justify-center text-xs transition-colors"
                title="Instagram"
              >
                IG
              </a>
            )}
            {settings?.socialTwitter && (
              <a
                href={settings.socialTwitter}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-sky-500 text-slate-300 hover:text-white flex items-center justify-center text-xs transition-colors"
                title="Twitter / X"
              >
                X
              </a>
            )}
            {settings?.socialYoutube && (
              <a
                href={settings.socialYoutube}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white flex items-center justify-center text-xs transition-colors"
                title="YouTube"
              >
                YT
              </a>
            )}
          </div>
        </div>

        {/* Dynamic Quick Links */}
        <div className="space-y-4">
          <h4 className="font-semibold text-white tracking-wider text-sm uppercase">
            Quick Links
          </h4>
          <ul className="space-y-2.5 text-sm">
            {quickLinks.map((link: any, index: number) => (
              <li key={index}>
                <Link
                  href={link.url || "#"}
                  className="text-slate-400 hover:text-orange-400 transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Dynamic Legal Links */}
        <div className="space-y-4">
          <h4 className="font-semibold text-white tracking-wider text-sm uppercase">
            Legal & Governance
          </h4>
          <ul className="space-y-2.5 text-sm">
            {legalLinks.map((link: any, index: number) => (
              <li key={index}>
                <Link
                  href={link.url || "#"}
                  className="text-slate-400 hover:text-orange-400 transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Dynamic Contact Section */}
        <div className="space-y-4">
          <h4 className="font-semibold text-white tracking-wider text-sm uppercase">
            Contact Office
          </h4>
          <ul className="space-y-3 text-sm text-slate-400">
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
              <span className="leading-snug">
                {settings?.contactAddress || "Shiv Chhatrapati Sports Complex, Mahalunge, Balewadi, Pune, Maharashtra 411045"}
              </span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-orange-400 shrink-0" />
              <a href={`tel:${settings?.contactPhone}`} className="hover:text-white transition-colors">
                {settings?.contactPhone || "+91 98765 43210"}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-orange-400 shrink-0" />
              <a href={`mailto:${settings?.contactEmail}`} className="hover:text-white transition-colors">
                {settings?.contactEmail || "info@pdho.org"}
              </a>
            </li>
            {settings?.contactWorkingHours && (
              <li className="flex items-center gap-2.5 text-xs text-slate-500 pt-1">
                <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>{settings.contactWorkingHours}</span>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="container px-4 md:px-6 mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>
          &copy; {new Date().getFullYear()} {settings?.siteName || "Pune District Handball Association"}. All rights reserved.
        </p>
        <p>Official District Sports Body • Affiliated with State Handball Association</p>
      </div>
    </footer>
  );
}
