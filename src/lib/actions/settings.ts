"use server";

import connectToDatabase from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";
import { revalidatePath } from "next/cache";

export async function getSiteSettings() {
  try {
    await connectToDatabase();
    
    let settings = await SiteSettings.findOne({});
    
    if (!settings) {
      // Seed default settings if none exist
      settings = await SiteSettings.create({});
    }
    
    return { success: true, data: JSON.parse(JSON.stringify(settings)) };
  } catch (error: any) {
    console.error("Error fetching site settings:", error);
    return { success: false, data: null, error: error.message };
  }
}

export async function updateSiteSettings(formData: any) {
  try {
    await connectToDatabase();
    
    const settings = await SiteSettings.findOne({});
    if (settings) {
      await SiteSettings.updateOne({ _id: settings._id }, { $set: { ...formData, updatedAt: Date.now() } });
    } else {
      await SiteSettings.create(formData);
    }
    
    // Revalidate paths so public pages see the new settings
    revalidatePath("/", "layout"); 
    
    return { success: true, message: "Settings updated successfully!" };
  } catch (error: any) {
    console.error("Error updating site settings:", error);
    return { success: false, message: error.message || "Failed to update settings." };
  }
}
