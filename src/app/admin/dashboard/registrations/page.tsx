"use client";

import { useEffect, useState, useTransition } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
  getRegistrations,
  updatePlayerStatus,
  updateTeamStatus,
  deletePlayerRegistration,
  deleteTeamRegistration,
  RegistrationStatus,
} from "@/lib/actions/register";
import { toast } from "sonner";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  RefreshCw,
  Trash2,
  Eye,
  Users,
  Shield,
  Filter,
  Mail,
  Phone,
  MapPin,
  Calendar,
  AlertCircle,
} from "lucide-react";

interface PlayerData {
  _id: string;
  fullName: string;
  age: number;
  gender: string;
  mobileNumber: string;
  email: string;
  district: string;
  position: string;
  registrationStatus: RegistrationStatus;
  createdAt: string;
}

interface TeamData {
  _id: string;
  name: string;
  managerName: string;
  contactNumber: string;
  email: string;
  category: string;
  status: RegistrationStatus;
  createdAt: string;
}

export default function AdminRegistrationsPage() {
  const [players, setPlayers] = useState<PlayerData[]>([]);
  const [teams, setTeams] = useState<TeamData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const [activeTab, setActiveTab] = useState("players");
  const [statusFilter, setStatusFilter] = useState<"All" | RegistrationStatus>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerData | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<TeamData | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: "player" | "team";
    id: string;
    name: string;
  } | null>(null);

  // Load Data
  async function loadData() {
    setIsLoading(true);
    try {
      const res = await getRegistrations();
      if (res.success && res.data) {
        setPlayers(res.data.players || []);
        setTeams(res.data.teams || []);
      } else {
        toast.error("Failed to load registrations", {
          description: res.message || "Database connection error.",
        });
      }
    } catch (err: any) {
      toast.error("Error connecting to database", {
        description: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // Player Status Handler
  const handlePlayerStatusChange = (playerId: string, newStatus: RegistrationStatus) => {
    startTransition(async () => {
      // Optimistic update
      setPlayers((prev) =>
        prev.map((p) => (p._id === playerId ? { ...p, registrationStatus: newStatus } : p))
      );
      if (selectedPlayer && selectedPlayer._id === playerId) {
        setSelectedPlayer((prev) => (prev ? { ...prev, registrationStatus: newStatus } : null));
      }

      const res = await updatePlayerStatus(playerId, newStatus);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error("Status update failed", { description: res.message });
        loadData(); // revert
      }
    });
  };

  // Team Status Handler
  const handleTeamStatusChange = (teamId: string, newStatus: RegistrationStatus) => {
    startTransition(async () => {
      // Optimistic update
      setTeams((prev) =>
        prev.map((t) => (t._id === teamId ? { ...t, status: newStatus } : t))
      );
      if (selectedTeam && selectedTeam._id === teamId) {
        setSelectedTeam((prev) => (prev ? { ...prev, status: newStatus } : null));
      }

      const res = await updateTeamStatus(teamId, newStatus);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error("Status update failed", { description: res.message });
        loadData(); // revert
      }
    });
  };

  // Delete Handlers
  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;

    startTransition(async () => {
      if (deleteConfirm.type === "player") {
        setPlayers((prev) => prev.filter((p) => p._id !== deleteConfirm.id));
        if (selectedPlayer?._id === deleteConfirm.id) setSelectedPlayer(null);
        const res = await deletePlayerRegistration(deleteConfirm.id);
        if (res.success) toast.success(res.message);
        else {
          toast.error("Delete failed", { description: res.message });
          loadData();
        }
      } else {
        setTeams((prev) => prev.filter((t) => t._id !== deleteConfirm.id));
        if (selectedTeam?._id === deleteConfirm.id) setSelectedTeam(null);
        const res = await deleteTeamRegistration(deleteConfirm.id);
        if (res.success) toast.success(res.message);
        else {
          toast.error("Delete failed", { description: res.message });
          loadData();
        }
      }
      setDeleteConfirm(null);
    });
  };

  // Calculations & Filtering
  const allRegistrationsCount = players.length + teams.length;
  const pendingCount =
    players.filter((p) => p.registrationStatus === "Pending").length +
    teams.filter((t) => t.status === "Pending").length;
  const approvedCount =
    players.filter((p) => p.registrationStatus === "Approved").length +
    teams.filter((t) => t.status === "Approved").length;
  const rejectedCount =
    players.filter((p) => p.registrationStatus === "Rejected").length +
    teams.filter((t) => t.status === "Rejected").length;

  const filteredPlayers = players.filter((p) => {
    const matchesStatus =
      statusFilter === "All" ? true : p.registrationStatus === statusFilter;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !query ||
      p.fullName.toLowerCase().includes(query) ||
      p.email.toLowerCase().includes(query) ||
      p.mobileNumber.toLowerCase().includes(query) ||
      p.district.toLowerCase().includes(query) ||
      p.position.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  const filteredTeams = teams.filter((t) => {
    const matchesStatus =
      statusFilter === "All" ? true : t.status === statusFilter;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !query ||
      t.name.toLowerCase().includes(query) ||
      t.managerName.toLowerCase().includes(query) ||
      t.email.toLowerCase().includes(query) ||
      t.contactNumber.toLowerCase().includes(query) ||
      t.category.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: RegistrationStatus) => {
    switch (status) {
      case "Approved":
        return (
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200 gap-1 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Approved
          </Badge>
        );
      case "Rejected":
        return (
          <Badge className="bg-rose-100 text-rose-800 border-rose-300 hover:bg-rose-200 gap-1 font-medium">
            <XCircle className="w-3.5 h-3.5" />
            Rejected
          </Badge>
        );
      case "Pending":
      default:
        return (
          <Badge className="bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200 gap-1 font-medium">
            <Clock className="w-3.5 h-3.5" />
            Pending Review
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Registrations Management
          </h2>
          <p className="text-slate-500">
            Review, approve, or reject player and team applications in real time.
          </p>
        </div>
        <Button
          onClick={() => loadData()}
          variant="outline"
          size="sm"
          disabled={isLoading}
          className="gap-2 self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-blue-600" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Applications
            </CardTitle>
            <Users className="w-4 h-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{allRegistrationsCount}</div>
            <p className="text-xs text-slate-500 mt-1">
              {players.length} players, {teams.length} teams
            </p>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50/40 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
              Pending Approvals
            </CardTitle>
            <Clock className="w-4 h-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-800">{pendingCount}</div>
            <p className="text-xs text-amber-600 mt-1">Requires admin review</p>
          </CardContent>
        </Card>

        <Card className="border-emerald-200 bg-emerald-50/40 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
              Approved
            </CardTitle>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-800">{approvedCount}</div>
            <p className="text-xs text-emerald-600 mt-1">Active for tournaments</p>
          </CardContent>
        </Card>

        <Card className="border-rose-200 bg-rose-50/40 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-rose-700 uppercase tracking-wider">
              Rejected
            </CardTitle>
            <XCircle className="w-4 h-4 text-rose-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-800">{rejectedCount}</div>
            <p className="text-xs text-rose-600 mt-1">Declined applications</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs Container */}
      <Tabs
        defaultValue="players"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full space-y-4"
      >
        {/* Controls Toolbar: Tabs + Search + Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <TabsList className="bg-slate-100 p-1">
            <TabsTrigger value="players" className="gap-2 font-medium">
              <Users className="w-4 h-4" />
              Players
              <span className="ml-1.5 px-2 py-0.5 text-xs font-semibold bg-slate-200 text-slate-700 rounded-full">
                {players.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="teams" className="gap-2 font-medium">
              <Shield className="w-4 h-4" />
              Teams
              <span className="ml-1.5 px-2 py-0.5 text-xs font-semibold bg-slate-200 text-slate-700 rounded-full">
                {teams.length}
              </span>
            </TabsTrigger>
          </TabsList>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative min-w-[240px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder={activeTab === "players" ? "Search players by name, email, district..." : "Search teams by name, manager..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-slate-50 focus:bg-white text-sm"
              />
            </div>

            {/* Status Filter Buttons */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
              <Filter className="w-3.5 h-3.5 text-slate-400 mx-1.5 hidden sm:inline-block" />
              {(["All", "Pending", "Approved", "Rejected"] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
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
        </div>

        {/* Players Tab Content */}
        <TabsContent value="players" className="space-y-4 m-0">
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50/75">
                <TableRow>
                  <TableHead className="w-[120px]">Date</TableHead>
                  <TableHead>Player</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Age / Gender</TableHead>
                  <TableHead>Position & District</TableHead>
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
                        Loading player registrations...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredPlayers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-36 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center gap-2 py-4">
                        <AlertCircle className="w-8 h-8 text-slate-300" />
                        <p className="text-sm font-medium text-slate-700">No player registrations found</p>
                        <p className="text-xs text-slate-400">
                          {searchQuery || statusFilter !== "All"
                            ? "Try adjusting your search or status filter."
                            : "New player registrations submitted through the portal will appear here."}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPlayers.map((player) => (
                    <TableRow key={player._id} className="hover:bg-slate-50/50">
                      <TableCell className="text-xs text-slate-500">
                        {new Date(player.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-slate-900">{player.fullName}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs text-slate-700 flex flex-col gap-0.5">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-400" />
                            {player.email}
                          </span>
                          <span className="flex items-center gap-1 text-slate-500">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {player.mobileNumber}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-slate-700">
                          {player.age} yrs • <span className="text-slate-500">{player.gender}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <span className="font-medium text-blue-900">{player.position}</span>
                          <div className="text-xs text-slate-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {player.district}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(player.registrationStatus)}</TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedPlayer(player)}
                          title="View Details"
                          className="h-8 px-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>

                        {player.registrationStatus !== "Approved" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={isPending}
                            onClick={() => handlePlayerStatusChange(player._id, "Approved")}
                            title="Approve Player"
                            className="h-8 px-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 font-medium cursor-pointer"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="hidden sm:inline ml-1 text-xs">Approve</span>
                          </Button>
                        )}

                        {player.registrationStatus !== "Rejected" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={isPending}
                            onClick={() => handlePlayerStatusChange(player._id, "Rejected")}
                            title="Reject Player"
                            className="h-8 px-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 font-medium cursor-pointer"
                          >
                            <XCircle className="w-4 h-4" />
                            <span className="hidden sm:inline ml-1 text-xs">Reject</span>
                          </Button>
                        )}

                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={isPending}
                          onClick={() =>
                            setDeleteConfirm({
                              type: "player",
                              id: player._id,
                              name: player.fullName,
                            })
                          }
                          title="Delete Registration"
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
        </TabsContent>

        {/* Teams Tab Content */}
        <TabsContent value="teams" className="space-y-4 m-0">
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50/75">
                <TableRow>
                  <TableHead className="w-[120px]">Date</TableHead>
                  <TableHead>Team Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Manager & Contact</TableHead>
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
                        Loading team registrations...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredTeams.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-36 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center gap-2 py-4">
                        <AlertCircle className="w-8 h-8 text-slate-300" />
                        <p className="text-sm font-medium text-slate-700">No team registrations found</p>
                        <p className="text-xs text-slate-400">
                          {searchQuery || statusFilter !== "All"
                            ? "Try adjusting your search or status filter."
                            : "New team registrations submitted through the portal will appear here."}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTeams.map((team) => (
                    <TableRow key={team._id} className="hover:bg-slate-50/50">
                      <TableCell className="text-xs text-slate-500">
                        {new Date(team.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-slate-900">{team.name}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-medium bg-slate-50">
                          {team.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium text-slate-800">{team.managerName}</div>
                          <div className="text-xs text-slate-500 flex flex-col gap-0.5 mt-0.5">
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3 text-slate-400" />
                              {team.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-slate-400" />
                              {team.contactNumber}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(team.status)}</TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedTeam(team)}
                          title="View Details"
                          className="h-8 px-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>

                        {team.status !== "Approved" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={isPending}
                            onClick={() => handleTeamStatusChange(team._id, "Approved")}
                            title="Approve Team"
                            className="h-8 px-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 font-medium cursor-pointer"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="hidden sm:inline ml-1 text-xs">Approve</span>
                          </Button>
                        )}

                        {team.status !== "Rejected" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={isPending}
                            onClick={() => handleTeamStatusChange(team._id, "Rejected")}
                            title="Reject Team"
                            className="h-8 px-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 font-medium cursor-pointer"
                          >
                            <XCircle className="w-4 h-4" />
                            <span className="hidden sm:inline ml-1 text-xs">Reject</span>
                          </Button>
                        )}

                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={isPending}
                          onClick={() =>
                            setDeleteConfirm({
                              type: "team",
                              id: team._id,
                              name: team.name,
                            })
                          }
                          title="Delete Team"
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
        </TabsContent>
      </Tabs>

      {/* Player Detail Modal */}
      <Dialog
        open={!!selectedPlayer}
        onOpenChange={(open) => !open && setSelectedPlayer(null)}
      >
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <div className="flex items-center justify-between pr-4">
              <DialogTitle className="text-lg font-bold text-slate-900">
                Player Registration Details
              </DialogTitle>
            </div>
            <DialogDescription>
              Submitted on{" "}
              {selectedPlayer &&
                new Date(selectedPlayer.createdAt).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
            </DialogDescription>
          </DialogHeader>

          {selectedPlayer && (
            <div className="space-y-4 py-2 text-sm">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border">
                <span className="text-slate-500 font-medium">Status</span>
                <div>{getStatusBadge(selectedPlayer.registrationStatus)}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg border">
                  <div className="text-xs text-slate-500 font-medium">Full Name</div>
                  <div className="font-semibold text-slate-900 mt-1">{selectedPlayer.fullName}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border">
                  <div className="text-xs text-slate-500 font-medium">Position</div>
                  <div className="font-semibold text-blue-900 mt-1">{selectedPlayer.position}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg border">
                  <div className="text-xs text-slate-500 font-medium">Age & Gender</div>
                  <div className="font-medium text-slate-800 mt-1">
                    {selectedPlayer.age} years • {selectedPlayer.gender}
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border">
                  <div className="text-xs text-slate-500 font-medium">District</div>
                  <div className="font-medium text-slate-800 mt-1">{selectedPlayer.district}</div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border space-y-2">
                <div className="text-xs text-slate-500 font-medium">Contact Credentials</div>
                <div className="flex items-center gap-2 text-slate-800">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <a href={`mailto:${selectedPlayer.email}`} className="text-blue-600 hover:underline">
                    {selectedPlayer.email}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-slate-800">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <a href={`tel:${selectedPlayer.mobileNumber}`} className="hover:underline">
                    {selectedPlayer.mobileNumber}
                  </a>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2 sm:justify-between items-center border-t pt-3">
            <div className="flex gap-2">
              {selectedPlayer?.registrationStatus !== "Approved" && (
                <Button
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                  onClick={() => {
                    if (selectedPlayer) handlePlayerStatusChange(selectedPlayer._id, "Approved");
                  }}
                  disabled={isPending}
                >
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  Approve
                </Button>
              )}
              {selectedPlayer?.registrationStatus !== "Rejected" && (
                <Button
                  size="sm"
                  variant="destructive"
                  className="cursor-pointer"
                  onClick={() => {
                    if (selectedPlayer) handlePlayerStatusChange(selectedPlayer._id, "Rejected");
                  }}
                  disabled={isPending}
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  Reject
                </Button>
              )}
            </div>
            <Button variant="outline" size="sm" onClick={() => setSelectedPlayer(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Team Detail Modal */}
      <Dialog
        open={!!selectedTeam}
        onOpenChange={(open) => !open && setSelectedTeam(null)}
      >
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <div className="flex items-center justify-between pr-4">
              <DialogTitle className="text-lg font-bold text-slate-900">
                Team Registration Details
              </DialogTitle>
            </div>
            <DialogDescription>
              Submitted on{" "}
              {selectedTeam &&
                new Date(selectedTeam.createdAt).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
            </DialogDescription>
          </DialogHeader>

          {selectedTeam && (
            <div className="space-y-4 py-2 text-sm">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border">
                <span className="text-slate-500 font-medium">Status</span>
                <div>{getStatusBadge(selectedTeam.status)}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg border">
                  <div className="text-xs text-slate-500 font-medium">Team Name</div>
                  <div className="font-semibold text-slate-900 mt-1">{selectedTeam.name}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border">
                  <div className="text-xs text-slate-500 font-medium">Category</div>
                  <div className="font-semibold text-blue-900 mt-1">{selectedTeam.category}</div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border space-y-2">
                <div className="text-xs text-slate-500 font-medium">Manager & Contact Information</div>
                <div className="font-medium text-slate-900">{selectedTeam.managerName}</div>
                <div className="flex items-center gap-2 text-slate-800">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <a href={`mailto:${selectedTeam.email}`} className="text-blue-600 hover:underline">
                    {selectedTeam.email}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-slate-800">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <a href={`tel:${selectedTeam.contactNumber}`} className="hover:underline">
                    {selectedTeam.contactNumber}
                  </a>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2 sm:justify-between items-center border-t pt-3">
            <div className="flex gap-2">
              {selectedTeam?.status !== "Approved" && (
                <Button
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                  onClick={() => {
                    if (selectedTeam) handleTeamStatusChange(selectedTeam._id, "Approved");
                  }}
                  disabled={isPending}
                >
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  Approve
                </Button>
              )}
              {selectedTeam?.status !== "Rejected" && (
                <Button
                  size="sm"
                  variant="destructive"
                  className="cursor-pointer"
                  onClick={() => {
                    if (selectedTeam) handleTeamStatusChange(selectedTeam._id, "Rejected");
                  }}
                  disabled={isPending}
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  Reject
                </Button>
              )}
            </div>
            <Button variant="outline" size="sm" onClick={() => setSelectedTeam(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={!!deleteConfirm}
        onOpenChange={(open) => !open && setDeleteConfirm(null)}
      >
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold text-rose-600">
              Confirm Delete Registration
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete the registration for{" "}
              <span className="font-semibold text-slate-900">{deleteConfirm?.name}</span>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-end border-t pt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteConfirm(null)}
              disabled={isPending}
            >
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
