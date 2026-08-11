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
  getTournaments,
  createTournament,
  updateTournament,
  deleteTournament,
  TournamentStatus,
} from "@/lib/actions/tournaments";
import { toast } from "sonner";
import {
  Plus,
  RefreshCw,
  Trash2,
  Edit2,
  Calendar,
  Trophy,
  Users,
  Search,
  MapPin,
  Flame,
  CheckCircle2,
} from "lucide-react";

interface TournamentItem {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  venue: string;
  rules?: string;
  status: TournamentStatus;
  registrationOpen: boolean;
  teamsCount: number;
  bannerUrl?: string;
}

export default function AdminTournamentsPage() {
  const [tournaments, setTournaments] = useState<TournamentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const [statusFilter, setStatusFilter] = useState<"All" | TournamentStatus>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTournament, setEditingTournament] = useState<TournamentItem | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);

  // Form
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    venue: "Shiv Chhatrapati Sports Complex, Pune",
    rules: "Standard IHF Rules Apply.",
    status: "Upcoming" as TournamentStatus,
    registrationOpen: true,
    teamsCount: 16,
    bannerUrl: "",
  });

  async function loadData() {
    setIsLoading(true);
    try {
      const res = await getTournaments();
      if (res.success && res.data) {
        setTournaments(res.data);
      } else {
        toast.error("Failed to load tournaments", { description: res.message });
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
    const today = new Date().toISOString().slice(0, 10);
    const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);
    setFormData({
      title: "",
      description: "",
      startDate: today,
      endDate: nextWeek,
      venue: "Shiv Chhatrapati Sports Complex, Pune",
      rules: "Standard IHF Handball Rules Apply.",
      status: "Upcoming",
      registrationOpen: true,
      teamsCount: 16,
      bannerUrl: "",
    });
    setIsCreateOpen(true);
  };

  const openEditModal = (t: TournamentItem) => {
    setEditingTournament(t);
    setFormData({
      title: t.title,
      description: t.description,
      startDate: new Date(t.startDate).toISOString().slice(0, 10),
      endDate: new Date(t.endDate).toISOString().slice(0, 10),
      venue: t.venue,
      rules: t.rules || "",
      status: t.status,
      registrationOpen: t.registrationOpen ?? true,
      teamsCount: t.teamsCount || 0,
      bannerUrl: t.bannerUrl || "",
    });
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.startDate || !formData.endDate) {
      toast.error("Please fill in the tournament title and dates.");
      return;
    }

    startTransition(async () => {
      const res = await createTournament(formData);
      if (res.success) {
        toast.success(res.message);
        setIsCreateOpen(false);
        loadData();
      } else {
        toast.error("Failed to create tournament", { description: res.message });
      }
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTournament) return;

    startTransition(async () => {
      const res = await updateTournament(editingTournament._id, formData);
      if (res.success) {
        toast.success(res.message);
        setEditingTournament(null);
        loadData();
      } else {
        toast.error("Failed to update tournament", { description: res.message });
      }
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;

    startTransition(async () => {
      const res = await deleteTournament(deleteConfirm.id);
      if (res.success) {
        toast.success(res.message);
        setTournaments((prev) => prev.filter((t) => t._id !== deleteConfirm.id));
      } else {
        toast.error("Failed to delete tournament", { description: res.message });
        loadData();
      }
      setDeleteConfirm(null);
    });
  };

  // KPIs
  const totalTournaments = tournaments.length;
  const upcomingCount = tournaments.filter((t) => t.status === "Upcoming").length;
  const ongoingCount = tournaments.filter((t) => t.status === "Ongoing").length;
  const pastCount = tournaments.filter((t) => t.status === "Past").length;

  const filteredTournaments = tournaments.filter((t) => {
    const matchesStatus = statusFilter === "All" ? true : t.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      t.title.toLowerCase().includes(q) ||
      t.venue.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Tournaments Management
          </h2>
          <p className="text-slate-500">
            Create, schedule, and manage district handball tournaments.
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
            Create Tournament
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Tournaments
            </CardTitle>
            <Trophy className="w-4 h-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{totalTournaments}</div>
            <p className="text-xs text-slate-500 mt-1">All district events</p>
          </CardContent>
        </Card>

        <Card className="border-emerald-200 bg-emerald-50/40 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
              Upcoming
            </CardTitle>
            <Calendar className="w-4 h-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-800">{upcomingCount}</div>
            <p className="text-xs text-emerald-600 mt-1">Registrations open</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50/40 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-orange-700 uppercase tracking-wider">
              Ongoing Live
            </CardTitle>
            <Flame className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-800">{ongoingCount}</div>
            <p className="text-xs text-orange-600 mt-1">In progress currently</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-slate-50 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Past / Completed
            </CardTitle>
            <CheckCircle2 className="w-4 h-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{pastCount}</div>
            <p className="text-xs text-slate-500 mt-1">Archived tournaments</p>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar: Search + Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search tournaments by title, venue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-slate-50 focus:bg-white text-sm"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg self-start sm:self-auto">
          {(["All", "Upcoming", "Ongoing", "Past"] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
                statusFilter === st
                  ? "bg-white text-slate-900 shadow-xs font-semibold"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Tournaments Table */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/75">
            <TableRow>
              <TableHead>Tournament Title</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Venue</TableHead>
              <TableHead>Teams Limit</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-slate-500">
                  <div className="flex items-center justify-center gap-2">
                    <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
                    Loading tournaments...
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredTournaments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-36 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2 py-4">
                    <Trophy className="w-8 h-8 text-slate-300" />
                    <p className="text-sm font-medium text-slate-700">No tournaments found</p>
                    <p className="text-xs text-slate-400">
                      Create a tournament with the &quot;Create Tournament&quot; button above.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredTournaments.map((t) => (
                <TableRow key={t._id} className="hover:bg-slate-50/50">
                  <TableCell>
                    <div className="font-semibold text-slate-900">{t.title}</div>
                    <div className="text-xs text-slate-500 line-clamp-1">{t.description}</div>
                  </TableCell>
                  <TableCell className="text-xs text-slate-700 whitespace-nowrap">
                    {new Date(t.startDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}{" "}
                    -{" "}
                    {new Date(t.endDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-xs text-slate-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      {t.venue}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-slate-700">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-slate-400" />
                      {t.teamsCount} Teams
                    </span>
                  </TableCell>
                  <TableCell>
                    {t.status === "Ongoing" ? (
                      <Badge className="bg-orange-500 hover:bg-orange-600 text-white font-medium">
                        Ongoing
                      </Badge>
                    ) : t.status === "Upcoming" ? (
                      <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300">
                        Upcoming
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-slate-600 bg-slate-50">
                        Past
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditModal(t)}
                      title="Edit Tournament"
                      className="h-8 px-2 text-blue-600 hover:bg-blue-50 cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteConfirm({ id: t._id, name: t.title })}
                      title="Delete Tournament"
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
        <DialogContent className="sm:max-w-lg bg-white">
          <form onSubmit={handleCreateSubmit}>
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-slate-900">
                Create New Tournament
              </DialogTitle>
              <DialogDescription>
                Publish a new handball tournament on the PDHA public portal.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-3 text-sm">
              <div className="space-y-1.5">
                <Label>Tournament Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. PDHA Winter Cup 2024"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label>Short Description</Label>
                <Textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief overview of the tournament, age groups, and eligibility."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Venue</Label>
                  <Input
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    placeholder="e.g. Shiv Chhatrapati Sports Complex"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Teams Capacity</Label>
                  <Input
                    type="number"
                    min="2"
                    value={formData.teamsCount}
                    onChange={(e) => setFormData({ ...formData, teamsCount: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg border">
                <div className="space-y-1.5">
                  <Label className="text-xs">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(val: TournamentStatus) => setFormData({ ...formData, status: val })}
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Upcoming">Upcoming</SelectItem>
                      <SelectItem value="Ongoing">Ongoing</SelectItem>
                      <SelectItem value="Past">Past / Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Banner Image URL (Optional)</Label>
                  <Input
                    value={formData.bannerUrl}
                    onChange={(e) => setFormData({ ...formData, bannerUrl: e.target.value })}
                    placeholder="https://example.com/banner.jpg"
                    className="bg-white"
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="flex gap-2 sm:justify-end border-t pt-3">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isPending} className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
                {isPending ? "Creating..." : "Publish Tournament"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={!!editingTournament} onOpenChange={(open) => !open && setEditingTournament(null)}>
        <DialogContent className="sm:max-w-lg bg-white">
          <form onSubmit={handleEditSubmit}>
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-slate-900">
                Edit Tournament
              </DialogTitle>
              <DialogDescription>
                Update tournament details, venue, dates, or status.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-3 text-sm">
              <div className="space-y-1.5">
                <Label>Tournament Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label>Description</Label>
                <Textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Venue</Label>
                  <Input
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Teams Capacity</Label>
                  <Input
                    type="number"
                    min="2"
                    value={formData.teamsCount}
                    onChange={(e) => setFormData({ ...formData, teamsCount: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg border">
                <div className="space-y-1.5">
                  <Label className="text-xs">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(val: TournamentStatus) => setFormData({ ...formData, status: val })}
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Upcoming">Upcoming</SelectItem>
                      <SelectItem value="Ongoing">Ongoing</SelectItem>
                      <SelectItem value="Past">Past / Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Banner Image URL</Label>
                  <Input
                    value={formData.bannerUrl}
                    onChange={(e) => setFormData({ ...formData, bannerUrl: e.target.value })}
                    placeholder="https://example.com/banner.jpg"
                    className="bg-white"
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="flex gap-2 sm:justify-end border-t pt-3">
              <Button type="button" variant="outline" size="sm" onClick={() => setEditingTournament(null)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isPending} className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
                {isPending ? "Saving..." : "Update Tournament"}
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
              Confirm Delete Tournament
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <span className="font-semibold text-slate-900">{deleteConfirm?.name}</span>? This will remove it from the public tournaments list.
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
