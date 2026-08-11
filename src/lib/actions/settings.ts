"use server";

import connectToDatabase from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";
import { revalidatePath } from "next/cache";

const defaultQuickLinks = [
  { label: "About Us", url: "/about" },
  { label: "Tournaments", url: "/tournaments" },
  { label: "Schedule & Results", url: "/schedule" },
  { label: "Player Registration", url: "/register/player" },
  { label: "Team Registration", url: "/register/team" },
  { label: "Media Gallery", url: "/gallery" },
];

const defaultLegalLinks = [
  { label: "Privacy Policy", url: "#" },
  { label: "Terms of Service", url: "#" },
  { label: "Rules & Regulations", url: "#" },
  { label: "Code of Conduct", url: "#" },
];

const defaultCommittee = [
  { name: "Shri. Rajesh Patil", role: "President", photoUrl: "", phone: "+91 98220 12345", email: "president@pdho.org" },
  { name: "Mr. Anand Shinde", role: "General Secretary", photoUrl: "", phone: "+91 98221 23456", email: "secretary@pdho.org" },
  { name: "Mrs. Sneha Deshmukh", role: "Treasurer", photoUrl: "", phone: "+91 98222 34567", email: "treasurer@pdho.org" },
  { name: "Mr. Vikram Joshi", role: "Vice President", photoUrl: "", phone: "+91 98223 45678", email: "vp@pdho.org" },
  { name: "Mr. Sameer Kulkarni", role: "Joint Secretary", photoUrl: "", phone: "+91 98224 56789", email: "jointsec@pdho.org" },
  { name: "Coach Ramesh Jadhav", role: "Technical Director", photoUrl: "", phone: "+91 98225 67890", email: "technical@pdho.org" },
];

export async function getSiteSettings() {
  try {
    await connectToDatabase();

    let settings = await SiteSettings.findOne({});

    if (!settings) {
      settings = await SiteSettings.create({});
    }

    const data = JSON.parse(JSON.stringify(settings));

    // Ensure array fallbacks if loaded from an older db schema document
    if (!data.quickLinks || data.quickLinks.length === 0) {
      data.quickLinks = defaultQuickLinks;
    }
    if (!data.legalLinks || data.legalLinks.length === 0) {
      data.legalLinks = defaultLegalLinks;
    }
    if (!data.executiveCommittee || data.executiveCommittee.length === 0) {
      data.executiveCommittee = defaultCommittee;
    }
    if (!data.contactWorkingHours) {
      data.contactWorkingHours = "Mon - Sat: 9:00 AM - 6:00 PM";
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Error fetching site settings:", error);
    return {
      success: false,
      data: {
        siteName: "Pune District Handball Association",
        logoUrl: "",
        heroTitle: "Pune District Handball Association",
        heroSubtitle: "Fostering excellence, teamwork, and passion for handball across the Pune district.",
        contactEmail: "info@pdho.org",
        contactPhone: "+91 98765 43210",
        contactAddress: "Shiv Chhatrapati Sports Complex, Mahalunge, Balewadi, Pune, Maharashtra 411045",
        contactWorkingHours: "Mon - Sat: 9:00 AM - 6:00 PM",
        socialFacebook: "https://facebook.com",
        socialInstagram: "https://instagram.com",
        socialTwitter: "https://twitter.com",
        socialYoutube: "https://youtube.com",
        aboutHistory: "The Pune District Handball Association was founded with a single goal: to promote the sport of handball at the grassroots level.",
        aboutVision: "To make Pune the premier hub for handball talent in India by providing world-class coaching, infrastructure, and competitive opportunities.",
        aboutMission: "To discover, nurture, and empower young athletes through structured training programs and transparent, high-quality tournaments.",
        quickLinks: defaultQuickLinks,
        legalLinks: defaultLegalLinks,
        executiveCommittee: defaultCommittee,
      },
      error: error.message,
    };
  }
}

export async function updateSiteSettings(formData: any) {
  try {
    await connectToDatabase();

    const settings = await SiteSettings.findOne({});
    if (settings) {
      await SiteSettings.updateOne(
        { _id: settings._id },
        {
          $set: {
            ...formData,
            updatedAt: Date.now(),
          },
        }
      );
    } else {
      await SiteSettings.create(formData);
    }

    // Revalidate paths so public pages see the new settings immediately
    revalidatePath("/", "layout");
    revalidatePath("/about");
    revalidatePath("/contact");
    revalidatePath("/admin/dashboard/settings");

    return { success: true, message: "Site settings & executive committee updated successfully!" };
  } catch (error: any) {
    console.error("Error updating site settings:", error);
    return { success: false, message: error.message || "Failed to update settings." };
  }
}
