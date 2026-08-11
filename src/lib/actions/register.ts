"use server";

import connectToDatabase from "@/lib/db";
import Player from "@/models/Player";
import Team from "@/models/Team";
import { revalidatePath } from "next/cache";

export type RegistrationStatus = "Pending" | "Approved" | "Rejected";

export async function registerPlayer(data: {
  fullName: string;
  age: string | number;
  gender: string;
  mobileNumber: string;
  email: string;
  district: string;
  position: string;
}) {
  try {
    await connectToDatabase();

    const newPlayer = new Player({
      fullName: data.fullName.trim(),
      age: parseInt(String(data.age), 10),
      gender: data.gender,
      mobileNumber: data.mobileNumber.trim(),
      email: data.email.trim().toLowerCase(),
      district: data.district.trim(),
      position: data.position,
      registrationStatus: "Pending",
    });

    await newPlayer.save();

    revalidatePath("/admin/dashboard/registrations");
    revalidatePath("/admin/dashboard");

    return { success: true, message: "Player registration submitted successfully! An administrator will review your application." };
  } catch (error: any) {
    console.error("Error registering player:", error);
    return { success: false, message: error.message || "Failed to register player." };
  }
}

export async function registerTeam(data: {
  name: string;
  managerName: string;
  contactNumber: string;
  email: string;
  category: string;
}) {
  try {
    await connectToDatabase();

    const newTeam = new Team({
      name: data.name.trim(),
      managerName: data.managerName.trim(),
      contactNumber: data.contactNumber.trim(),
      email: data.email.trim().toLowerCase(),
      category: data.category,
      status: "Pending",
    });

    await newTeam.save();

    revalidatePath("/admin/dashboard/registrations");
    revalidatePath("/admin/dashboard");

    return { success: true, message: "Team registration submitted successfully! An administrator will review your application." };
  } catch (error: any) {
    console.error("Error registering team:", error);
    return { success: false, message: error.message || "Failed to register team." };
  }
}

export async function getRegistrations() {
  try {
    await connectToDatabase();

    const [players, teams] = await Promise.all([
      Player.find({}).sort({ createdAt: -1 }).lean(),
      Team.find({}).sort({ createdAt: -1 }).lean(),
    ]);

    const formattedPlayers = players.map((p: any) => ({
      ...p,
      _id: p._id.toString(),
      teamId: p.teamId ? p.teamId.toString() : null,
      createdAt: p.createdAt ? new Date(p.createdAt).toISOString() : new Date().toISOString(),
    }));

    const formattedTeams = teams.map((t: any) => ({
      ...t,
      _id: t._id.toString(),
      createdAt: t.createdAt ? new Date(t.createdAt).toISOString() : new Date().toISOString(),
    }));

    return {
      success: true,
      data: {
        players: formattedPlayers,
        teams: formattedTeams,
      },
    };
  } catch (error: any) {
    console.error("Error fetching registrations:", error);
    return {
      success: false,
      data: { players: [], teams: [] },
      message: error.message || "Failed to load registrations.",
    };
  }
}

export async function updatePlayerStatus(playerId: string, status: RegistrationStatus) {
  try {
    await connectToDatabase();

    const updated = await Player.findByIdAndUpdate(
      playerId,
      { registrationStatus: status },
      { new: true }
    );

    if (!updated) {
      return { success: false, message: "Player not found." };
    }

    revalidatePath("/admin/dashboard/registrations");
    revalidatePath("/admin/dashboard");

    return {
      success: true,
      message: `Player "${updated.fullName}" marked as ${status}.`,
    };
  } catch (error: any) {
    console.error("Error updating player status:", error);
    return { success: false, message: error.message || "Failed to update player status." };
  }
}

export async function updateTeamStatus(teamId: string, status: RegistrationStatus) {
  try {
    await connectToDatabase();

    const updated = await Team.findByIdAndUpdate(
      teamId,
      { status },
      { new: true }
    );

    if (!updated) {
      return { success: false, message: "Team not found." };
    }

    revalidatePath("/admin/dashboard/registrations");
    revalidatePath("/admin/dashboard");

    return {
      success: true,
      message: `Team "${updated.name}" marked as ${status}.`,
    };
  } catch (error: any) {
    console.error("Error updating team status:", error);
    return { success: false, message: error.message || "Failed to update team status." };
  }
}

export async function deletePlayerRegistration(playerId: string) {
  try {
    await connectToDatabase();

    const deleted = await Player.findByIdAndDelete(playerId);

    if (!deleted) {
      return { success: false, message: "Player not found." };
    }

    revalidatePath("/admin/dashboard/registrations");
    revalidatePath("/admin/dashboard");

    return { success: true, message: `Player registration deleted.` };
  } catch (error: any) {
    console.error("Error deleting player:", error);
    return { success: false, message: error.message || "Failed to delete player." };
  }
}

export async function deleteTeamRegistration(teamId: string) {
  try {
    await connectToDatabase();

    const deleted = await Team.findByIdAndDelete(teamId);

    if (!deleted) {
      return { success: false, message: "Team not found." };
    }

    revalidatePath("/admin/dashboard/registrations");
    revalidatePath("/admin/dashboard");

    return { success: true, message: `Team registration deleted.` };
  } catch (error: any) {
    console.error("Error deleting team:", error);
    return { success: false, message: error.message || "Failed to delete team." };
  }
}

export async function getRegistrationStats() {
  try {
    await connectToDatabase();

    const [
      totalPlayers,
      pendingPlayers,
      approvedPlayers,
      rejectedPlayers,
      totalTeams,
      pendingTeams,
      approvedTeams,
      rejectedTeams,
    ] = await Promise.all([
      Player.countDocuments({}),
      Player.countDocuments({ registrationStatus: "Pending" }),
      Player.countDocuments({ registrationStatus: "Approved" }),
      Player.countDocuments({ registrationStatus: "Rejected" }),
      Team.countDocuments({}),
      Team.countDocuments({ status: "Pending" }),
      Team.countDocuments({ status: "Approved" }),
      Team.countDocuments({ status: "Rejected" }),
    ]);

    return {
      success: true,
      data: {
        players: {
          total: totalPlayers,
          pending: pendingPlayers,
          approved: approvedPlayers,
          rejected: rejectedPlayers,
        },
        teams: {
          total: totalTeams,
          pending: pendingTeams,
          approved: approvedTeams,
          rejected: rejectedTeams,
        },
        totalCombined: totalPlayers + totalTeams,
        pendingCombined: pendingPlayers + pendingTeams,
        approvedCombined: approvedPlayers + approvedTeams,
        rejectedCombined: rejectedPlayers + rejectedTeams,
      },
    };
  } catch (error: any) {
    console.error("Error fetching registration stats:", error);
    return {
      success: false,
      data: {
        players: { total: 0, pending: 0, approved: 0, rejected: 0 },
        teams: { total: 0, pending: 0, approved: 0, rejected: 0 },
        totalCombined: 0,
        pendingCombined: 0,
        approvedCombined: 0,
        rejectedCombined: 0,
      },
    };
  }
}
