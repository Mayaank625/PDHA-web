"use server";

import connectToDatabase from "@/lib/db";
import Tournament from "@/models/Tournament";
import { revalidatePath } from "next/cache";

export type TournamentStatus = "Upcoming" | "Ongoing" | "Past";

export async function getTournaments() {
  try {
    await connectToDatabase();
    const tournaments = await Tournament.find({}).sort({ startDate: -1 }).lean();

    const formatted = tournaments.map((t: any) => ({
      ...t,
      _id: t._id.toString(),
      startDate: t.startDate ? new Date(t.startDate).toISOString() : new Date().toISOString(),
      endDate: t.endDate ? new Date(t.endDate).toISOString() : new Date().toISOString(),
      createdAt: t.createdAt ? new Date(t.createdAt).toISOString() : new Date().toISOString(),
    }));

    return { success: true, data: formatted };
  } catch (error: any) {
    console.error("Error fetching tournaments:", error);
    return { success: false, data: [], message: error.message || "Failed to load tournaments." };
  }
}

export async function createTournament(data: {
  title: string;
  description: string;
  startDate: string | Date;
  endDate: string | Date;
  venue: string;
  rules?: string;
  status?: TournamentStatus;
  registrationOpen?: boolean;
  teamsCount?: number;
  bannerUrl?: string;
}) {
  try {
    await connectToDatabase();

    const newTournament = new Tournament({
      title: data.title.trim(),
      description: data.description.trim(),
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      venue: data.venue.trim(),
      rules: data.rules?.trim() || "",
      status: data.status || "Upcoming",
      registrationOpen: data.registrationOpen ?? true,
      teamsCount: Number(data.teamsCount) || 0,
      bannerUrl: data.bannerUrl?.trim() || "",
    });

    await newTournament.save();

    revalidatePath("/");
    revalidatePath("/tournaments");
    revalidatePath("/admin/dashboard/tournaments");
    revalidatePath("/admin/dashboard");

    return { success: true, message: `Tournament "${data.title}" created successfully!` };
  } catch (error: any) {
    console.error("Error creating tournament:", error);
    return { success: false, message: error.message || "Failed to create tournament." };
  }
}

export async function updateTournament(
  id: string,
  data: {
    title?: string;
    description?: string;
    startDate?: string | Date;
    endDate?: string | Date;
    venue?: string;
    rules?: string;
    status?: TournamentStatus;
    registrationOpen?: boolean;
    teamsCount?: number;
    bannerUrl?: string;
  }
) {
  try {
    await connectToDatabase();

    const updatePayload: any = { ...data };
    if (data.startDate) updatePayload.startDate = new Date(data.startDate);
    if (data.endDate) updatePayload.endDate = new Date(data.endDate);
    if (data.teamsCount !== undefined) updatePayload.teamsCount = Number(data.teamsCount);

    const updated = await Tournament.findByIdAndUpdate(id, updatePayload, { new: true });
    if (!updated) {
      return { success: false, message: "Tournament not found." };
    }

    revalidatePath("/");
    revalidatePath("/tournaments");
    revalidatePath("/admin/dashboard/tournaments");
    revalidatePath("/admin/dashboard");

    return { success: true, message: `Tournament "${updated.title}" updated successfully.` };
  } catch (error: any) {
    console.error("Error updating tournament:", error);
    return { success: false, message: error.message || "Failed to update tournament." };
  }
}

export async function deleteTournament(id: string) {
  try {
    await connectToDatabase();

    const deleted = await Tournament.findByIdAndDelete(id);
    if (!deleted) {
      return { success: false, message: "Tournament not found." };
    }

    revalidatePath("/");
    revalidatePath("/tournaments");
    revalidatePath("/admin/dashboard/tournaments");
    revalidatePath("/admin/dashboard");

    return { success: true, message: "Tournament deleted successfully." };
  } catch (error: any) {
    console.error("Error deleting tournament:", error);
    return { success: false, message: error.message || "Failed to delete tournament." };
  }
}
