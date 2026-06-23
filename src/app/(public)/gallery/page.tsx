import Image from "next/image";

export default function GalleryPage() {
  const images = [
    { id: 1, url: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800&auto=format&fit=crop", title: "State Championship Finals" },
    { id: 2, url: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800&auto=format&fit=crop", title: "U-17 District Trials" },
    { id: 3, url: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800&auto=format&fit=crop", title: "Winning Team Celebrations" },
    { id: 4, url: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800&auto=format&fit=crop", title: "Goalkeeper in Action" },
    { id: 5, url: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800&auto=format&fit=crop", title: "Award Ceremony" },
    { id: 6, url: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800&auto=format&fit=crop", title: "Practice Session" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <section className="bg-white py-12 border-b">
        <div className="container px-4 md:px-6">
          <h1 className="text-3xl font-bold text-slate-900">Media Gallery</h1>
          <p className="text-slate-600 mt-2">Explore photos and videos from our recent tournaments and events.</p>
        </div>
      </section>

      <section className="py-12 flex-1">
        <div className="container px-4 md:px-6 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {images.map((image) => (
              <div key={image.id} className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 bg-slate-200 aspect-video">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-500 group-hover:scale-110"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                  <h3 className="text-white font-medium text-lg">{image.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
