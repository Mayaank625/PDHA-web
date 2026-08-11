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
  getMatches,
  createMatch,
  updateMatch,
  deleteMatch,
  MatchStatus,
} from "@/lib/actions/matches";
import { toast } from "sonner";
import {
  Plus,
  RefreshCw,
  Trash2,
  Edit2,
  Calendar,
  Trophy,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  MapPin,
  Flame,
} from "lucide-react";

interface MatchItem {
  _id: string;
  tournamentTitle: string;
  teamA: string;
  teamB: string;
  matchDate: string;
  venue: string;
  scoreA: number;
  scoreB: number;
  status: MatchStatus;
  stage: string;
}

export default function AdminMatchesPage() {
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const [statusFilter, setStatusFilter] = useState<"All" | MatchStatus>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Create / Edit Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState<MatchItem | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    tournamentTitle: "PDHA Winter Cup 2024",
    teamA: "",
    teamB: "",
    matchDate: "",
    venue: "Shiv Chhatrapati Sports Complex, Pune",
    stage: "Group Stage",
    scoreA: 0,
    scoreB: 0,
    status: "Scheduled" as MatchStatus,
  });

  async function loadData() {
    setIsLoading(true);
    try {
      const res = await getMatches();
      if (res.success && res.data) {
        setMatches(res.data);
      } else {
        toast.error("Failed to load matches", { description: res.message });
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
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    setFormData({
      tournamentTitle: "PDHA Winter Cup 2024",
      teamA: "",
      teamB: "",
      matchDate: today.toISOString().slice(0, 16),
      venue: "Shiv Chhatrapati Sports Complex, Pune",
      stage: "Group Stage",
      scoreA: 0,
      scoreB: 0,
      status: "Scheduled",
    });
    setIsCreateOpen(true);
  };

  const openEditModal = (match: MatchItem) => {
    setEditingMatch(match);
    const dateObj = new Date(match.matchDate);
    dateObj.setMinutes(dateObj.getMinutes() - dateObj.getTimezoneOffset());
    setFormData({
      tournamentTitle: match.tournamentTitle || "",
      teamA: match.teamA,
      teamB: match.teamB,
      matchDate: dateObj.toISOString().slice(0, 16),
      venue: match.venue,
      stage: match.stage,
      scoreA: match.scoreA,
      scoreB: match.scoreB,
      status: match.status,
    });
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.teamA.trim() || !formData.teamB.trim() || !formData.matchDate) {
      toast.error("Please fill in Team A, Team B, and the Match Date.");
      return;
    }

    startTransition(async () => {
      const res = await createMatch(formData);
      if (res.success) {
        toast.success(res.message);
        setIsCreateOpen(false);
        loadData();
      } else {
        toast.error("Failed to create match", { description: res.message });
      }
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMatch) return;

    startTransition(async () => {
      const res = await updateMatch(editingMatch._id, formData);
      if (res.success) {
        toast.success(res.message);
        setEditingMatch(null);
        loadData();
      } else {
        toast.error("Failed to update match", { description: res.message });
      }
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;

    startTransition(async () => {
      const res = await deleteMatch(deleteConfirm.id);
      if (res.success) {
        toast.success(res.message);
        setMatches((prev) => prev.filter((m) => m._id !== deleteConfirm.id));
      } else {
        toast.error("Failed to delete match", { description: res.message });
        loadData();
      }
      setDeleteConfirm(null);
    });
  };

  // KPI counts
  const totalMatches = matches.length;
  const scheduledCount = matches.filter((m) => m.status === "Scheduled").length;
  const completedCount = matches.filter((m) => m.status === "Completed").length;

  const filteredMatches = matches.filter((m) => {
    const matchesStatus = statusFilter === "All" ? true : m.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      m.teamA.toLowerCase().includes(q) ||
      m.teamB.toLowerCase().includes(q) ||
      m.tournamentTitle.toLowerCase().includes(q) ||
      m.venue.toLowerCase().includes(q) ||
      m.stage.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Matches & Fixtures Management
          </h2>
          <p className="text-slate-500">
            Schedule upcoming matches, log live scores, and publish tournament results.
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
            Add Match Fixture
          </Button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Fixtures
            </CardTitle>
            <Trophy className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{totalMatches}</div>
            <p className="text-xs text-slate-500 mt-1">Across all tournaments</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50/40 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
              Upcoming Scheduled
            </CardTitle>
            <Clock className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800">{scheduledCount}</div>
            <p className="text-xs text-blue-600 mt-1">Published on fixtures schedule</p>
          </CardContent>
        </Card>

        <Card className="border-emerald-200 bg-emerald-50/40 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
              Completed Results
            </CardTitle>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-800">{completedCount}</div>
            <p className="text-xs text-emerald-600 mt-1">Scores recorded & verified</p>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar: Search + Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search teams, tournament, venue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-slate-50 focus:bg-white text-sm"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg self-start sm:self-auto">
          {(["All", "Scheduled", "Completed", "Cancelled"] as const).map((st) => (
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

      {/* Matches Table */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/75">
            <TableRow>
              <TableHead className="w-[180px]">Date & Time</TableHead>
              <TableHead>Tournament / Stage</TableHead>
              <TableHead>Match Fixture</TableHead>
              <TableHead className="text-center">Score</TableHead>
              <TableHead>Venue</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-slate-500">
                  <div className="flex items-center justify-center gap-2">
                    <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
                    Loading matches...
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredMatches.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-36 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2 py-4">
                    <Trophy className="w-8 h-8 text-slate-300" />
                    <p className="text-sm font-medium text-slate-700">No matches found</p>
                    <p className="text-xs text-slate-400">
                      Create your first fixture with the &quot;Add Match Fixture&quot; button above.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredMatches.map((m) => (
                <TableRow key={m._id} className="hover:bg-slate-50/50">
                  <TableCell className="text-xs text-slate-700 whitespace-nowrap">
                    <div className="font-semibold text-slate-900">
                      {new Date(m.matchDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                    <div className="text-slate-500">
                      {new Date(m.matchDate).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs font-semibold text-blue-900">{m.tournamentTitle}</div>
                    <div className="text-xs text-slate-500">{m.stage}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-semibold text-slate-900">{m.teamA}</span>
                      <span className="text-xs text-slate-400 font-medium">vs</span>
                      <span className="font-semibold text-slate-900">{m.teamB}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {m.status === "Completed" ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 font-mono text-sm font-bold text-slate-900">
                        {m.scoreA} - {m.scoreB}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 font-mono">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-slate-600 max-w-[180px] truncate">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      {m.venue}
                    </span>
                  </TableCell>
                  <TableCell>
                    {m.status === "Completed" ? (
                      <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300">
                        Completed
                      </Badge>
                    ) : m.status === "Cancelled" ? (
                      <Badge className="bg-rose-100 text-rose-800 border-rose-300">
                        Cancelled
                      </Badge>
                    ) : (
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                        Scheduled
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditModal(m)}
                      title="Edit Match / Scores"
                      className="h-8 px-2 text-blue-600 hover:bg-blue-50 cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteConfirm({ id: m._id, name: `${m.teamA} vs ${m.teamB}` })}
                      title="Delete Match"
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
                Add Match Fixture
              </DialogTitle>
              <DialogDescription>
                Schedule a new match fixture for the public schedule.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-3 text-sm">
              <div className="space-y-1.5">
                <Label>Tournament / Event Title</Label>
                <Input
                  value={formData.tournamentTitle}
                  onChange={(e) => setFormData({ ...formData, tournamentTitle: e.target.value })}
                  placeholder="e.g. PDHA Winter Cup 2024"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Team A Name</Label>
                  <Input
                    value={formData.teamA}
                    onChange={(e) => setFormData({ ...formData, teamA: e.target.value })}
                    placeholder="e.g. Pune Panthers"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Team B Name</Label>
                  <Input
                    value={formData.teamB}
                    onChange={(e) => setFormData({ ...formData, teamB: e.target.value })}
                    placeholder="e.g. Deccan Warriors"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Date & Time</Label>
                  <Input
                    type="datetime-local"
                    value={formData.matchDate}
                    onChange={(e) => setFormData({ ...formData, matchDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Stage</Label>
                  <Input
                    value={formData.stage}
                    onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                    placeholder="e.g. Semi-Final, Group Stage"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Venue</Label>
                <Input
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  placeholder="e.g. Shiv Chhatrapati Sports Complex"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-lg border">
                <div className="space-y-1.5">
                  <Label className="text-xs">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(val) => {
                      if (val) setFormData({ ...formData, status: val as MatchStatus });
                    }}
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Scheduled">Scheduled</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Team A Score</Label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.scoreA}
                    onChange={(e) => setFormData({ ...formData, scoreA: parseInt(e.target.value) || 0 })}
                    className="bg-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Team B Score</Label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.scoreB}
                    onChange={(e) => setFormData({ ...formData, scoreB: parseInt(e.target.value) || 0 })}
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
                {isPending ? "Creating..." : "Save Match"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={!!editingMatch} onOpenChange={(open) => !open && setEditingMatch(null)}>
        <DialogContent className="sm:max-w-lg bg-white">
          <form onSubmit={handleEditSubmit}>
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-slate-900">
                Edit Match / Record Results
              </DialogTitle>
              <DialogDescription>
                Update live scores, venue, date, or status.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-3 text-sm">
              <div className="space-y-1.5">
                <Label>Tournament Title</Label>
                <Input
                  value={formData.tournamentTitle}
                  onChange={(e) => setFormData({ ...formData, tournamentTitle: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Team A</Label>
                  <Input
                    value={formData.teamA}
                    onChange={(e) => setFormData({ ...formData, teamA: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Team B</Label>
                  <Input
                    value={formData.teamB}
                    onChange={(e) => setFormData({ ...formData, teamB: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 space-y-3">
                <div className="font-semibold text-blue-950 text-xs uppercase tracking-wider">
                  Scorecard & Status
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(val) => {
                        if (val) setFormData({ ...formData, status: val as MatchStatus });
                      }}
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Scheduled">Scheduled</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">{formData.teamA || "Team A"} Score</Label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.scoreA}
                      onChange={(e) => setFormData({ ...formData, scoreA: parseInt(e.target.value) || 0 })}
                      className="bg-white text-base font-bold text-center"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">{formData.teamB || "Team B"} Score</Label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.scoreB}
                      onChange={(e) => setFormData({ ...formData, scoreB: parseInt(e.target.value) || 0 })}
                      className="bg-white text-base font-bold text-center"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Date & Time</Label>
                  <Input
                    type="datetime-local"
                    value={formData.matchDate}
                    onChange={(e) => setFormData({ ...formData, matchDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Stage</Label>
                  <Input
                    value={formData.stage}
                    onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Venue</Label>
                <Input
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  required
                />
              </div>
            </div>

            <DialogFooter className="flex gap-2 sm:justify-end border-t pt-3">
              <Button type="button" variant="outline" size="sm" onClick={() => setEditingMatch(null)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isPending} className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
                {isPending ? "Updating..." : "Update Match"}
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
              Confirm Delete Match
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the fixture for{" "}
              <span className="font-semibold text-slate-900">{deleteConfirm?.name}</span>? This will remove it from the public fixtures and results page.
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
