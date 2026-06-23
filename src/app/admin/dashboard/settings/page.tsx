"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { getSiteSettings, updateSiteSettings } from "@/lib/actions/settings";
import { toast } from "sonner"; // Assuming sonner was installed

export default function AdminSettingsPage() {
  const [formData, setFormData] = useState({
    siteName: "",
    logoUrl: "",
    heroTitle: "",
    heroSubtitle: "",
    contactEmail: "",
    contactPhone: "",
    contactAddress: "",
    aboutHistory: "",
    aboutVision: "",
    aboutMission: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      const res = await getSiteSettings();
      if (res.success && res.data) {
        setFormData(res.data);
      }
      setIsLoading(false);
    }
    loadSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    const res = await updateSiteSettings(formData);
    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Loading settings...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Site Settings</h2>
          <p className="text-slate-500">Manage public content, logos, and contact information.</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700">
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="space-y-8 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">General & Branding</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Site Name / Organization Name</Label>
              <Input name="siteName" value={formData.siteName} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label>Logo URL</Label>
              <Input name="logoUrl" value={formData.logoUrl} onChange={handleChange} placeholder="https://example.com/logo.png" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Home Page Hero</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Hero Title</Label>
              <Input name="heroTitle" value={formData.heroTitle} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label>Hero Subtitle</Label>
              <Textarea name="heroSubtitle" value={formData.heroSubtitle} onChange={handleChange} />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Contact Information</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Contact Email</Label>
              <Input name="contactEmail" value={formData.contactEmail} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label>Contact Phone</Label>
              <Input name="contactPhone" value={formData.contactPhone} onChange={handleChange} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Office Address</Label>
              <Textarea name="contactAddress" value={formData.contactAddress} onChange={handleChange} />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">About Us Content</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Our History</Label>
              <Textarea name="aboutHistory" value={formData.aboutHistory} onChange={handleChange} className="min-h-[100px]" />
            </div>
            <div className="space-y-2">
              <Label>Our Vision</Label>
              <Textarea name="aboutVision" value={formData.aboutVision} onChange={handleChange} className="min-h-[100px]" />
            </div>
            <div className="space-y-2">
              <Label>Our Mission</Label>
              <Textarea name="aboutMission" value={formData.aboutMission} onChange={handleChange} className="min-h-[100px]" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
