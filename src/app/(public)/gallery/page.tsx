import { Badge } from "@/components/ui/badge";
import { getGalleryItems } from "@/lib/actions/gallery";
import { Image as ImageIcon, Video, Layers } from "lucide-react";
import GalleryClient from "./GalleryClient";

export default async function GalleryPage() {
  const res = await getGalleryItems();

  const initialItems = res.success && res.data && res.data.length > 0
    ? res.data
    : [
        {
          _id: "g1",
          url: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800&auto=format&fit=crop",
          mediaUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800&auto=format&fit=crop",
          title: "State Championship Finals Action",
          category: "Matches",
          mediaType: "Image",
          uploadDate: new Date().toISOString(),
        },
        {
          _id: "g2",
          url: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop",
          mediaUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop",
          title: "U-17 District Selection Trials",
          category: "Highlights",
          mediaType: "Image",
          uploadDate: new Date(Date.now() - 5 * 86400000).toISOString(),
        },
        {
          _id: "g3",
          url: "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?q=80&w=800&auto=format&fit=crop",
          mediaUrl: "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?q=80&w=800&auto=format&fit=crop",
          title: "Winning Trophy Presentation",
          category: "Awards",
          mediaType: "Image",
          uploadDate: new Date(Date.now() - 10 * 86400000).toISOString(),
        },
        {
          _id: "g4",
          url: "https://images.unsplash.com/photo-1526676037777-05a232554f77?q=80&w=800&auto=format&fit=crop",
          mediaUrl: "https://images.unsplash.com/photo-1526676037777-05a232554f77?q=80&w=800&auto=format&fit=crop",
          title: "Goalkeeper Defense Stance",
          category: "Training",
          mediaType: "Image",
          uploadDate: new Date(Date.now() - 15 * 86400000).toISOString(),
        },
        {
          _id: "g5",
          url: "https://images.unsplash.com/photo-1547347298-4074fc3086f0?q=80&w=800&auto=format&fit=crop",
          mediaUrl: "https://images.unsplash.com/photo-1547347298-4074fc3086f0?q=80&w=800&auto=format&fit=crop",
          title: "Opening Ceremony & Athlete Oath",
          category: "Ceremony",
          mediaType: "Image",
          uploadDate: new Date(Date.now() - 20 * 86400000).toISOString(),
        },
        {
          _id: "g6",
          url: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=800&auto=format&fit=crop",
          mediaUrl: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=800&auto=format&fit=crop",
          title: "Coaching & Tactical Practice Clinic",
          category: "Training",
          mediaType: "Image",
          uploadDate: new Date(Date.now() - 25 * 86400000).toISOString(),
        },
      ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <section className="bg-blue-950 py-12 border-b text-white">
        <div className="container px-4 md:px-6">
          <Badge className="bg-orange-500 text-white font-medium mb-2">Media & Visuals</Badge>
          <h1 className="text-3xl md:text-4xl font-bold">Photo & Video Gallery</h1>
          <p className="text-blue-200 mt-2 max-w-2xl">
            Relive key moments, championship victories, training clinics, and highlights from Pune district handball events.
          </p>
        </div>
      </section>

      <section className="py-12 flex-1">
        <div className="container px-4 md:px-6 max-w-6xl mx-auto">
          <GalleryClient initialItems={initialItems} />
        </div>
      </section>
    </div>
  );
}
