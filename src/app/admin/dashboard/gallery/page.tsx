"use client";

import { useEffect, useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getGalleryItems,
  createGalleryItem,
  deleteGalleryItem,
} from "@/lib/actions/gallery";
import { toast } from "sonner";
import {
  Plus,
  RefreshCw,
  Trash2,
  Image as ImageIcon,
  Video,
  Search,
  Calendar,
  ExternalLink,
  Layers,
} from "lucide-react";

interface GalleryItem {
  _id: string;
  title: string;
  mediaUrl: string;
  mediaType: "Image" | "Video";
  category: string;
  uploadDate: string;
}

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const [categoryFilter, setCategoryFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; title: string } | null>(null);

  // Form
  const [formData, setFormData] = useState({
    title: "",
    mediaUrl: "",
    mediaType: "Image" as "Image" | "Video",
    category: "Highlights",
  });

  async function loadData() {
    setIsLoading(true);
    try {
      const res = await getGalleryItems();
      if (res.success && res.data) {
        setItems(res.data);
      } else {
        toast.error("Failed to load gallery items", { description: res.message });
      }
    } catch (err: any) {
      toast.error("Error connecting to database", { description: err.message });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setFormData({
      title: "",
      mediaUrl: "",
      mediaType: "Image",
      category: "Highlights",
    });
    setIsCreateOpen(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.mediaUrl.trim()) {
      toast.error("Please enter a title and a valid image/media URL.");
      return;
    }

    startTransition(async () => {
      const res = await createGalleryItem(formData);
      if (res.success) {
        toast.success(res.message);
        setIsCreateOpen(false);
        loadData();
      } else {
        toast.error("Failed to add media item", { description: res.message });
      }
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;

    startTransition(async () => {
      const res = await deleteGalleryItem(deleteConfirm.id);
      if (res.success) {
        toast.success(res.message);
        setItems((prev) => prev.filter((it) => it._id !== deleteConfirm.id));
      } else {
        toast.error("Failed to delete media item", { description: res.message });
        loadData();
      }
      setDeleteConfirm(null);
    });
  };

  const categories = ["All", ...Array.from(new Set(items.map((i) => i.category || "Highlights")))];

  const filteredItems = items.filter((it) => {
    const matchesCat = categoryFilter === "All" ? true : it.category === categoryFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      it.title.toLowerCase().includes(q) ||
      it.category.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Media Gallery Management
          </h2>
          <p className="text-slate-500">
            Upload and manage photos and videos for the public PDHA Media Gallery.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => loadData()}
            variant="outline"
            size="sm"
            disabled={isLoading}
            className="gap-2 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-blue-600" : ""}`} />
            Refresh
          </Button>
          <Button
            onClick={openCreateModal}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Media
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Media Items
            </CardTitle>
            <ImageIcon className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{items.length}</div>
            <p className="text-xs text-slate-500 mt-1">Photos & videos live on portal</p>
          </CardContent>
        </Card>

        <Card className="border-indigo-200 bg-indigo-50/40 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-indigo-700 uppercase tracking-wider">
              Photos
            </CardTitle>
            <ImageIcon className="w-4 h-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-900">
              {items.filter((i) => i.mediaType !== "Video").length}
            </div>
            <p className="text-xs text-indigo-600 mt-1">Image highlights & events</p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50/40 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-purple-700 uppercase tracking-wider">
              Videos
            </CardTitle>
            <Video className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              {items.filter((i) => i.mediaType === "Video").length}
            </div>
            <p className="text-xs text-purple-600 mt-1">Video reels & matches</p>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search media by title or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-slate-50 focus:bg-white text-sm"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto bg-slate-100 p-1 rounded-lg">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap cursor-pointer ${
                categoryFilter === cat
                  ? "bg-white text-slate-900 shadow-xs font-semibold"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Media Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-48 bg-white rounded-xl border border-slate-200">
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
            Loading gallery media...
          </div>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-slate-200 text-center">
          <ImageIcon className="w-10 h-10 text-slate-300 mb-3" />
          <p className="font-semibold text-slate-800 text-base">No media items found</p>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            Add photos from tournaments or matches using the &quot;Add Media&quot; button.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item._id}
              className="group relative flex flex-col rounded-xl overflow-hidden border bg-white shadow-xs hover:shadow-md transition-all"
            >
              <div className="relative aspect-video bg-slate-100 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.mediaUrl}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback placeholder
                    (e.currentTarget as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800&auto=format&fit=crop";
                  }}
                />
                <div className="absolute top-2.5 left-2.5">
                  <Badge variant="secondary" className="bg-black/60 text-white backdrop-blur-xs text-[10px] border-none">
                    {item.category || "Highlights"}
                  </Badge>
                </div>
                {item.mediaType === "Video" && (
                  <div className="absolute top-2.5 right-2.5">
                    <Badge className="bg-purple-600 text-white text-[10px] gap-1 border-none">
                      <Video className="w-3 h-3" />
                      Video
                    </Badge>
                  </div>
                )}
              </div>

              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    {new Date(item.uploadDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100">
                  <a
                    href={item.mediaUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-medium text-slate-500 hover:text-blue-600 flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Open URL
                  </a>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteConfirm({ id: item._id, title: item.title })}
                    className="h-7 px-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-md bg-white">
          <form onSubmit={handleCreateSubmit}>
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-slate-900">
                Add Media to Gallery
              </DialogTitle>
              <DialogDescription>
                Provide an image or video URL to display in the public Media Gallery.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-3 text-sm">
              <div className="space-y-1.5">
                <Label>Media Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. State Championship Finals Celebration"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label>Media URL (Image / Video)</Label>
                <Input
                  value={formData.mediaUrl}
                  onChange={(e) => setFormData({ ...formData, mediaUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/... or https://..."
                  required
                />
              </div>

              {formData.mediaUrl && (
                <div className="relative aspect-video rounded-lg overflow-hidden border bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={formData.mediaUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800&auto=format&fit=crop";
                    }}
                  />
                  <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded">
                    Image Preview
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(val) => {
                      if (val) setFormData({ ...formData, category: val });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Highlights">Highlights</SelectItem>
                      <SelectItem value="Matches">Matches</SelectItem>
                      <SelectItem value="Awards">Awards</SelectItem>
                      <SelectItem value="Training">Training</SelectItem>
                      <SelectItem value="Ceremony">Ceremony</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label>Media Type</Label>
                  <Select
                    value={formData.mediaType}
                    onValueChange={(val) => {
                      if (val) setFormData({ ...formData, mediaType: val as "Image" | "Video" });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Image">Image</SelectItem>
                      <SelectItem value="Video">Video</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <DialogFooter className="flex gap-2 sm:justify-end border-t pt-3">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isPending} className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
                {isPending ? "Adding..." : "Add to Gallery"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold text-rose-600">
              Confirm Delete Media
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to remove <span className="font-semibold text-slate-900">{deleteConfirm?.title}</span> from the gallery?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-end border-t pt-3">
            <Button variant="outline" size="sm" onClick={() => setDeleteConfirm(null)} disabled={isPending}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteConfirm}
              disabled={isPending}
              className="cursor-pointer"
            >
              {isPending ? "Deleting..." : "Delete Permanently"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
