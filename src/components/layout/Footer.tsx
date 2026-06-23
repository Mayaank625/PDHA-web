import Link from 'next/link';
import { getSiteSettings } from "@/lib/actions/settings";

export async function Footer() {
  const { data: settings } = await getSiteSettings();

  return (
    <footer className="w-full border-t bg-slate-50 py-12">
      <div className="container grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-blue-900">{settings?.siteName || "PDHO"}</h3>
          <p className="text-sm text-slate-500">
            {settings?.heroSubtitle || "Promoting and developing handball."}
          </p>
        </div>
        <div className="space-y-4">
          <h4 className="font-semibold">Quick Links</h4>
          <ul className="space-y-2 text-sm text-slate-500">
            <li><Link href="/about" className="hover:text-blue-600 hover:underline">About Us</Link></li>
            <li><Link href="/tournaments" className="hover:text-blue-600 hover:underline">Tournaments</Link></li>
            <li><Link href="/register/player" className="hover:text-blue-600 hover:underline">Player Registration</Link></li>
            <li><Link href="/register/team" className="hover:text-blue-600 hover:underline">Team Registration</Link></li>
          </ul>
        </div>
        <div className="space-y-4">
          <h4 className="font-semibold">Legal</h4>
          <ul className="space-y-2 text-sm text-slate-500">
            <li><Link href="#" className="hover:text-blue-600 hover:underline">Privacy Policy</Link></li>
            <li><Link href="#" className="hover:text-blue-600 hover:underline">Terms of Service</Link></li>
            <li><Link href="#" className="hover:text-blue-600 hover:underline">Rules & Regulations</Link></li>
          </ul>
        </div>
        <div className="space-y-4">
          <h4 className="font-semibold">Contact</h4>
          <ul className="space-y-2 text-sm text-slate-500">
            <li>Email: {settings?.contactEmail}</li>
            <li>Phone: {settings?.contactPhone}</li>
            <li>{settings?.contactAddress}</li>
          </ul>
        </div>
      </div>
      <div className="container mt-12 pt-8 border-t text-center text-sm text-slate-500">
        <p>&copy; {new Date().getFullYear()} {settings?.siteName || "Pune District Handball Organisation"}. All rights reserved.</p>
      </div>
    </footer>
  );
}
