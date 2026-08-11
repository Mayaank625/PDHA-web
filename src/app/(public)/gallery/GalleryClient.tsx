"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Video, Layers, Eye, Calendar, Sparkles } from "lucide-react";

interface GalleryItem {
  _id: string;
  title: string;
  mediaUrl: string;
  mediaType: "Image" | "Video";
  category: string;
  uploadDate: string;
}

export default function GalleryClient({ initialItems }: { initialItems: any[] }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const categories = ["All", ...Array.from(new Set(initialItems.map((i) => i.category || "Highlights")))];

  const filteredItems = initialItems.filter((item) => {
    return selectedCategory === "All" || item.category === selectedCategory;
  });

  return (
    <div className="space-y-8">
      {/* Category Pills */}
      <div className="flex items-center justify-center gap-2 flex-wrap bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs max-w-xl mx-auto">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              selectedCategory === cat
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item._id}
            onClick={() => setActiveItem(item)}
            className="group relative rounded-2xl overflow-hidden shadow-xs hover:shadow-2xl transition-all duration-300 bg-slate-900 aspect-[4/3] cursor-pointer border border-slate-200/80"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.mediaUrl}
              alt={item.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800&auto=format&fit=crop";
              }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent opacity-60 group-hover:opacity-85 transition-opacity duration-300" />

            {/* Badges */}
            <div className="absolute top-3 left-3 z-10">
              <Badge className="bg-black/50 backdrop-blur-md text-white border-none text-[11px] font-medium">
                {item.category || "Highlights"}
              </Badge>
            </div>

            {item.mediaType === "Video" && (
              <div className="absolute top-3 right-3 z-10">
                <Badge className="bg-purple-600 text-white border-none text-[11px] gap-1">
                  <Video className="w-3 h-3" />
                  Video
                </Badge>
              </div>
            )}

            {/* Bottom Content */}
            <div className="absolute bottom-0 left-0 right-0 p-5 z-10 flex flex-col justify-end">
              <h3 className="text-white font-bold text-base leading-snug drop-shadow-sm group-hover:text-blue-200 transition-colors">
                {item.title}
              </h3>
              <div className="flex items-center justify-between text-xs text-slate-300 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span>
                  {new Date(item.uploadDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <span className="text-orange-400 font-semibold flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" /> View Photo
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <Dialog open={!!activeItem} onOpenChange={(open) => !open && setActiveItem(null)}>
        <DialogContent className="sm:max-w-2xl bg-slate-950 text-white border-slate-800 p-2 overflow-hidden">
          <DialogHeader className="sr-only">
            <DialogTitle>{activeItem?.title || "Media"}</DialogTitle>
            <DialogDescription>Media preview lightbox</DialogDescription>
          </DialogHeader>

          {activeItem && (
            <div className="space-y-3">
              <div className="relative aspect-video rounded-xl overflow-hidden bg-black flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeItem.mediaUrl}
                  alt={activeItem.title}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <div className="p-3 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-base text-slate-100">{activeItem.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Category: <span className="text-blue-400">{activeItem.category}</span> •{" "}
                    {new Date(activeItem.uploadDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <Badge className="bg-blue-600 text-white">
                  {activeItem.mediaType}
                </Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
