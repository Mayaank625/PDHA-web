"use server";

import connectToDatabase from "@/lib/db";
import Player from "@/models/Player";
import Team from "@/models/Team";
import { revalidatePath } from "next/cache";

export async function registerPlayer(data: any) {
  try {
    await connectToDatabase();
    
    const newPlayer = new Player({
      fullName: data.fullName,
      age: parseInt(data.age),
      gender: data.gender,
      mobileNumber: data.mobileNumber,
      email: data.email,
      district: data.district,
      position: data.position,
      registrationStatus: "Pending",
    });

    await newPlayer.save();
    
    return { success: true, message: "Player registered successfully!" };
  } catch (error: any) {
    console.error("Error registering player:", error);
    return { success: false, message: error.message || "Failed to register player." };
  }
}

export async function registerTeam(data: any) {
  try {
    await connectToDatabase();
    
    const newTeam = new Team({
      name: data.name,
      managerName: data.managerName,
      contactNumber: data.contactNumber,
      email: data.email,
      category: data.category,
      status: "Pending",
    });

    await newTeam.save();
    
    return { success: true, message: "Team registered successfully!" };
  } catch (error: any) {
    console.error("Error registering team:", error);
    return { success: false, message: error.message || "Failed to register team." };
  }
}
