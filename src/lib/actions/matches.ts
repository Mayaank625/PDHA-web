"use server";

import connectToDatabase from "@/lib/db";
import Match from "@/models/Match";
import { revalidatePath } from "next/cache";

export type MatchStatus = "Scheduled" | "Completed" | "Cancelled";

export async function getMatches() {
  try {
    await connectToDatabase();
    const matches = await Match.find({}).sort({ matchDate: -1 }).lean();

    const formatted = matches.map((m: any) => ({
      ...m,
      _id: m._id.toString(),
      tournamentId: m.tournamentId ? m.tournamentId.toString() : null,
      teamAId: m.teamAId ? m.teamAId.toString() : null,
      teamBId: m.teamBId ? m.teamBId.toString() : null,
      matchDate: m.matchDate ? new Date(m.matchDate).toISOString() : new Date().toISOString(),
      createdAt: m.createdAt ? new Date(m.createdAt).toISOString() : new Date().toISOString(),
    }));

    return { success: true, data: formatted };
  } catch (error: any) {
    console.error("Error fetching matches:", error);
    return { success: false, data: [], message: error.message || "Failed to load matches." };
  }
}

export async function createMatch(data: {
  tournamentTitle?: string;
  teamA: string;
  teamB: string;
  matchDate: string | Date;
  venue: string;
  stage?: string;
  scoreA?: number;
  scoreB?: number;
  status?: MatchStatus;
}) {
  try {
    await connectToDatabase();

    const newMatch = new Match({
      tournamentTitle: data.tournamentTitle?.trim() || "PDHA Championship",
      teamA: data.teamA.trim(),
      teamB: data.teamB.trim(),
      matchDate: new Date(data.matchDate),
      venue: data.venue.trim(),
      stage: data.stage?.trim() || "Group Stage",
      scoreA: Number(data.scoreA) || 0,
      scoreB: Number(data.scoreB) || 0,
      status: data.status || "Scheduled",
    });

    await newMatch.save();

    revalidatePath("/");
    revalidatePath("/schedule");
    revalidatePath("/admin/dashboard/matches");
    revalidatePath("/admin/dashboard");

    return { success: true, message: `Match "${data.teamA} vs ${data.teamB}" created successfully!` };
  } catch (error: any) {
    console.error("Error creating match:", error);
    return { success: false, message: error.message || "Failed to create match." };
  }
}

export async function updateMatch(
  id: string,
  data: {
    tournamentTitle?: string;
    teamA?: string;
    teamB?: string;
    matchDate?: string | Date;
    venue?: string;
    stage?: string;
    scoreA?: number;
    scoreB?: number;
    status?: MatchStatus;
  }
) {
  try {
    await connectToDatabase();

    const updatePayload: any = { ...data };
    if (data.matchDate) updatePayload.matchDate = new Date(data.matchDate);
    if (data.scoreA !== undefined) updatePayload.scoreA = Number(data.scoreA);
    if (data.scoreB !== undefined) updatePayload.scoreB = Number(data.scoreB);

    const updated = await Match.findByIdAndUpdate(id, updatePayload, { new: true });
    if (!updated) {
      return { success: false, message: "Match not found." };
    }

    revalidatePath("/");
    revalidatePath("/schedule");
    revalidatePath("/admin/dashboard/matches");
    revalidatePath("/admin/dashboard");

    return { success: true, message: `Match details updated successfully.` };
  } catch (error: any) {
    console.error("Error updating match:", error);
    return { success: false, message: error.message || "Failed to update match." };
  }
}

export async function deleteMatch(id: string) {
  try {
    await connectToDatabase();

    const deleted = await Match.findByIdAndDelete(id);
    if (!deleted) {
      return { success: false, message: "Match not found." };
    }

    revalidatePath("/");
    revalidatePath("/schedule");
    revalidatePath("/admin/dashboard/matches");
    revalidatePath("/admin/dashboard");

    return { success: true, message: "Match deleted successfully." };
  } catch (error: any) {
    console.error("Error deleting match:", error);
    return { success: false, message: error.message || "Failed to delete match." };
  }
}
