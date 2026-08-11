"use server";

import connectToDatabase from "@/lib/db";
import Announcement from "@/models/Announcement";
import { revalidatePath } from "next/cache";

export async function getAnnouncements() {
  try {
    await connectToDatabase();
    const items = await Announcement.find({}).sort({ publishDate: -1 }).lean();

    const formatted = items.map((a: any) => ({
      ...a,
      _id: a._id.toString(),
      publishDate: a.publishDate ? new Date(a.publishDate).toISOString() : new Date().toISOString(),
    }));

    return { success: true, data: formatted };
  } catch (error: any) {
    console.error("Error fetching announcements:", error);
    return { success: false, data: [], message: error.message || "Failed to load announcements." };
  }
}

export async function createAnnouncement(data: {
  title: string;
  content: string;
  type: "News" | "Notice" | "Event";
  isPublished?: boolean;
}) {
  try {
    await connectToDatabase();

    const newA = new Announcement({
      title: data.title.trim(),
      content: data.content.trim(),
      type: data.type || "News",
      isPublished: data.isPublished ?? true,
      publishDate: new Date(),
    });

    await newA.save();

    revalidatePath("/");
    revalidatePath("/announcements");
    revalidatePath("/admin/dashboard/announcements");
    revalidatePath("/admin/dashboard");

    return { success: true, message: `Announcement "${data.title}" published successfully!` };
  } catch (error: any) {
    console.error("Error creating announcement:", error);
    return { success: false, message: error.message || "Failed to create announcement." };
  }
}

export async function deleteAnnouncement(id: string) {
  try {
    await connectToDatabase();

    const deleted = await Announcement.findByIdAndDelete(id);
    if (!deleted) {
      return { success: false, message: "Announcement not found." };
    }

    revalidatePath("/");
    revalidatePath("/announcements");
    revalidatePath("/admin/dashboard/announcements");
    revalidatePath("/admin/dashboard");

    return { success: true, message: "Announcement removed successfully." };
  } catch (error: any) {
    console.error("Error deleting announcement:", error);
    return { success: false, message: error.message || "Failed to delete announcement." };
  }
}
