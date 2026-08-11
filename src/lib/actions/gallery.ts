"use server";

import connectToDatabase from "@/lib/db";
import Gallery from "@/models/Gallery";
import { revalidatePath } from "next/cache";

export async function getGalleryItems() {
  try {
    await connectToDatabase();
    const items = await Gallery.find({}).sort({ uploadDate: -1 }).lean();

    const formatted = items.map((g: any) => ({
      ...g,
      _id: g._id.toString(),
      tournamentId: g.tournamentId ? g.tournamentId.toString() : null,
      uploadDate: g.uploadDate ? new Date(g.uploadDate).toISOString() : new Date().toISOString(),
    }));

    return { success: true, data: formatted };
  } catch (error: any) {
    console.error("Error fetching gallery items:", error);
    return { success: false, data: [], message: error.message || "Failed to load gallery items." };
  }
}

export async function createGalleryItem(data: {
  title: string;
  mediaUrl: string;
  mediaType?: "Image" | "Video";
  category?: string;
}) {
  try {
    await connectToDatabase();

    const newItem = new Gallery({
      title: data.title.trim(),
      mediaUrl: data.mediaUrl.trim(),
      mediaType: data.mediaType || "Image",
      category: data.category?.trim() || "Highlights",
    });

    await newItem.save();

    revalidatePath("/");
    revalidatePath("/gallery");
    revalidatePath("/admin/dashboard/gallery");
    revalidatePath("/admin/dashboard");

    return { success: true, message: `Media item "${data.title}" added to gallery successfully!` };
  } catch (error: any) {
    console.error("Error creating gallery item:", error);
    return { success: false, message: error.message || "Failed to add media item." };
  }
}

export async function deleteGalleryItem(id: string) {
  try {
    await connectToDatabase();

    const deleted = await Gallery.findByIdAndDelete(id);
    if (!deleted) {
      return { success: false, message: "Gallery item not found." };
    }

    revalidatePath("/");
    revalidatePath("/gallery");
    revalidatePath("/admin/dashboard/gallery");
    revalidatePath("/admin/dashboard");

    return { success: true, message: "Media item removed from gallery." };
  } catch (error: any) {
    console.error("Error deleting gallery item:", error);
    return { success: false, message: error.message || "Failed to delete media item." };
  }
}
