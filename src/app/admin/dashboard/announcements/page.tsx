"use client";

import { useEffect, useState, useTransition } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
} from "@/lib/actions/announcements";
import { toast } from "sonner";
import {
  Plus,
  RefreshCw,
  Trash2,
  Megaphone,
  Search,
  Calendar,
} from "lucide-react";

interface AnnouncementItem {
  _id: string;
  title: string;
  content: string;
  type: "News" | "Notice" | "Event";
  isPublished: boolean;
  publishDate: string;
}

export default function AdminAnnouncementsPage() {
  const [items, setItems] = useState<AnnouncementItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; title: string } | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "Notice" as "News" | "Notice" | "Event",
  });

  async function loadData() {
    setIsLoading(true);
    try {
      const res = await getAnnouncements();
      if (res.success && res.data) {
        setItems(res.data);
      } else {
        toast.error("Failed to load announcements", { description: res.message });
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
      content: "",
      type: "Notice",
    });
    setIsCreateOpen(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error("Please enter a title and announcement content.");
      return;
    }

    startTransition(async () => {
      const res = await createAnnouncement({
        title: formData.title,
        content: formData.content,
        type: formData.type,
      });

      if (res.success) {
        toast.success(res.message);
        setIsCreateOpen(false);
        loadData();
      } else {
        toast.error("Failed to publish announcement", { description: res.message });
      }
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;

    startTransition(async () => {
      const res = await deleteAnnouncement(deleteConfirm.id);
      if (res.success) {
        toast.success(res.message);
        setItems((prev) => prev.filter((i) => i._id !== deleteConfirm.id));
      } else {
        toast.error("Failed to delete", { description: res.message });
        loadData();
      }
      setDeleteConfirm(null);
    });
  };

  const filteredItems = items.filter((i) => {
    const matchesType = typeFilter === "All" ? true : i.type === typeFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || i.title.toLowerCase().includes(q) || i.content.toLowerCase().includes(q);
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Announcements & Notices Management
          </h2>
          <p className="text-slate-500">
            Broadcast official district notices, trials info, and tournament news.
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
            Post Announcement
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search announcements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-slate-50 focus:bg-white text-sm"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          {(["All", "Notice", "Event", "News"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
                typeFilter === t
                  ? "bg-white text-slate-900 shadow-xs font-semibold"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/75">
            <TableRow>
              <TableHead className="w-[140px]">Date</TableHead>
              <TableHead className="w-[100px]">Type</TableHead>
              <TableHead>Title & Content</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-slate-500">
                  <div className="flex items-center justify-center gap-2">
                    <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
                    Loading announcements...
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-36 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2 py-4">
                    <Megaphone className="w-8 h-8 text-slate-300" />
                    <p className="text-sm font-medium text-slate-700">No announcements published</p>
                    <p className="text-xs text-slate-400">Post announcements to broadcast notices to the public.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.map((item) => (
                <TableRow key={item._id} className="hover:bg-slate-50/50">
                  <TableCell className="text-xs text-slate-600 whitespace-nowrap">
                    {new Date(item.publishDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.type === "Notice" ? "destructive" : item.type === "Event" ? "default" : "secondary"}>
                      {item.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold text-slate-900 text-sm">{item.title}</div>
                    <div className="text-xs text-slate-500 mt-1 line-clamp-2">{item.content}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteConfirm({ id: item._id, title: item.title })}
                      className="h-8 px-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create Modal */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-md bg-white">
          <form onSubmit={handleCreateSubmit}>
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-slate-900">
                Post New Announcement
              </DialogTitle>
              <DialogDescription>
                Publish a new notice or news item to the public portal.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-3 text-sm">
              <div className="space-y-1.5">
                <Label>Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Selection Trials for U-17 Championship"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label>Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(val) => {
                    if (val) setFormData({ ...formData, type: val as "News" | "Notice" | "Event" });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Notice">Notice</SelectItem>
                    <SelectItem value="Event">Event</SelectItem>
                    <SelectItem value="News">News</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Content / Details</Label>
                <Textarea
                  rows={4}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Full announcement details, timings, instructions for athletes..."
                  required
                />
              </div>
            </div>

            <DialogFooter className="flex gap-2 sm:justify-end border-t pt-3">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isPending} className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
                {isPending ? "Publishing..." : "Publish Announcement"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold text-rose-600">
              Confirm Delete Announcement
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <span className="font-semibold text-slate-900">{deleteConfirm?.title}</span>?
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
              {isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
