import Link from 'next/link';
import { getSiteSettings } from "@/lib/actions/settings";

export async function Header() {
  const { data: settings } = await getSiteSettings();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="font-bold text-xl text-blue-900 tracking-tight flex items-center gap-2">
            {settings?.logoUrl && <img src={settings.logoUrl} alt="Logo" className="h-8 w-auto" />}
            {!settings?.logoUrl && "PDHO"}
          </Link>
        </div>
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          <Link href="/" className="transition-colors hover:text-blue-600">Home</Link>
          <Link href="/about" className="transition-colors hover:text-blue-600">About Us</Link>
          <Link href="/tournaments" className="transition-colors hover:text-blue-600">Tournaments</Link>
          <Link href="/schedule" className="transition-colors hover:text-blue-600">Schedule & Results</Link>
          <Link href="/gallery" className="transition-colors hover:text-blue-600">Gallery</Link>
          <Link href="/announcements" className="transition-colors hover:text-blue-600">Announcements</Link>
          <Link href="/contact" className="transition-colors hover:text-blue-600">Contact</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/register/player" className="hidden md:inline-flex h-9 items-center justify-center rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-orange-500/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
            Register Now
          </Link>
        </div>
      </div>
    </header>
  );
}
