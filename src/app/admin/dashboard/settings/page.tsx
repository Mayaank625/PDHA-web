"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getSiteSettings, updateSiteSettings } from "@/lib/actions/settings";
import { toast } from "sonner";
import {
  Save,
  Plus,
  Trash2,
  Users,
  Link2,
  Scale,
  Phone,
  Building,
  Info,
  RefreshCw,
  UserCheck,
  Globe,
} from "lucide-react";

interface LinkItem {
  label: string;
  url: string;
}

interface CommitteeMember {
  name: string;
  role: string;
  photoUrl?: string;
  phone?: string;
  email?: string;
}

export default function AdminSettingsPage() {
  const [formData, setFormData] = useState({
    siteName: "",
    logoUrl: "",
    heroTitle: "",
    heroSubtitle: "",
    contactEmail: "",
    contactPhone: "",
    contactAddress: "",
    contactWorkingHours: "",
    socialFacebook: "",
    socialInstagram: "",
    socialTwitter: "",
    socialYoutube: "",
    aboutHistory: "",
    aboutVision: "",
    aboutMission: "",
    quickLinks: [] as LinkItem[],
    legalLinks: [] as LinkItem[],
    executiveCommittee: [] as CommitteeMember[],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    async function loadSettings() {
      setIsLoading(true);
      const res = await getSiteSettings();
      if (res.success && res.data) {
        setFormData({
          siteName: res.data.siteName || "",
          logoUrl: res.data.logoUrl || "",
          heroTitle: res.data.heroTitle || "",
          heroSubtitle: res.data.heroSubtitle || "",
          contactEmail: res.data.contactEmail || "",
          contactPhone: res.data.contactPhone || "",
          contactAddress: res.data.contactAddress || "",
          contactWorkingHours: res.data.contactWorkingHours || "Mon - Sat: 9:00 AM - 6:00 PM",
          socialFacebook: res.data.socialFacebook || "",
          socialInstagram: res.data.socialInstagram || "",
          socialTwitter: res.data.socialTwitter || "",
          socialYoutube: res.data.socialYoutube || "",
          aboutHistory: res.data.aboutHistory || "",
          aboutVision: res.data.aboutVision || "",
          aboutMission: res.data.aboutMission || "",
          quickLinks: res.data.quickLinks || [],
          legalLinks: res.data.legalLinks || [],
          executiveCommittee: res.data.executiveCommittee || [],
        });
      }
      setIsLoading(false);
    }
    loadSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Quick Links handlers
  const handleAddQuickLink = () => {
    setFormData((prev) => ({
      ...prev,
      quickLinks: [...prev.quickLinks, { label: "New Link", url: "/" }],
    }));
  };

  const handleUpdateQuickLink = (index: number, field: "label" | "url", value: string) => {
    setFormData((prev) => {
      const updated = [...prev.quickLinks];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, quickLinks: updated };
    });
  };

  const handleRemoveQuickLink = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      quickLinks: prev.quickLinks.filter((_, i) => i !== index),
    }));
  };

  // Legal Links handlers
  const handleAddLegalLink = () => {
    setFormData((prev) => ({
      ...prev,
      legalLinks: [...prev.legalLinks, { label: "New Policy", url: "#" }],
    }));
  };

  const handleUpdateLegalLink = (index: number, field: "label" | "url", value: string) => {
    setFormData((prev) => {
      const updated = [...prev.legalLinks];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, legalLinks: updated };
    });
  };

  const handleRemoveLegalLink = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      legalLinks: prev.legalLinks.filter((_, i) => i !== index),
    }));
  };

  // Committee handlers
  const handleAddCommitteeMember = () => {
    setFormData((prev) => ({
      ...prev,
      executiveCommittee: [
        ...prev.executiveCommittee,
        {
          name: "",
          role: "Committee Member",
          photoUrl: "",
          phone: "",
          email: "",
        },
      ],
    }));
  };

  const handleUpdateCommitteeMember = (
    index: number,
    field: keyof CommitteeMember,
    value: string
  ) => {
    setFormData((prev) => {
      const updated = [...prev.executiveCommittee];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, executiveCommittee: updated };
    });
  };

  const handleRemoveCommitteeMember = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      executiveCommittee: prev.executiveCommittee.filter((_, i) => i !== index),
    }));
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
    return (
      <div className="flex items-center justify-center p-16 text-slate-500">
        <RefreshCw className="w-5 h-5 animate-spin mr-2 text-blue-600" />
        Loading site settings & committee...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Site Settings & Governance
          </h2>
          <p className="text-slate-500">
            Configure association branding, footer links, contact channels, and executive committee members.
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2 cursor-pointer shadow-xs"
        >
          <Save className="w-4 h-4" />
          {isSaving ? "Saving..." : "Save All Changes"}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
        <TabsList className="bg-slate-100 p-1 flex-wrap h-auto gap-1">
          <TabsTrigger value="general" className="gap-1.5 font-medium">
            <Building className="w-4 h-4" />
            General & Hero
          </TabsTrigger>
          <TabsTrigger value="contact" className="gap-1.5 font-medium">
            <Phone className="w-4 h-4" />
            Contact & Social
          </TabsTrigger>
          <TabsTrigger value="committee" className="gap-1.5 font-medium">
            <Users className="w-4 h-4" />
            Executive Committee
            <span className="ml-1.5 px-1.5 py-0.2 text-[11px] bg-slate-200 text-slate-700 rounded-full font-bold">
              {formData.executiveCommittee.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="quicklinks" className="gap-1.5 font-medium">
            <Link2 className="w-4 h-4" />
            Quick Links
            <span className="ml-1.5 px-1.5 py-0.2 text-[11px] bg-slate-200 text-slate-700 rounded-full font-bold">
              {formData.quickLinks.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="legal" className="gap-1.5 font-medium">
            <Scale className="w-4 h-4" />
            Legal Links
            <span className="ml-1.5 px-1.5 py-0.2 text-[11px] bg-slate-200 text-slate-700 rounded-full font-bold">
              {formData.legalLinks.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="about" className="gap-1.5 font-medium">
            <Info className="w-4 h-4" />
            About History
          </TabsTrigger>
        </TabsList>

        {/* 1. General & Hero Branding */}
        <TabsContent value="general" className="space-y-6 m-0">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader>
              <CardTitle>Association Branding & Hero Headline</CardTitle>
              <CardDescription>
                Customize the name, logo URL, and headline shown on the public homepage hero section.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Site Name / Association Title</Label>
                  <Input
                    name="siteName"
                    value={formData.siteName}
                    onChange={handleChange}
                    placeholder="Pune District Handball Association"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Association Logo URL (Optional)</Label>
                  <Input
                    name="logoUrl"
                    value={formData.logoUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/pdha-logo.png"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="space-y-2">
                  <Label>Homepage Hero Title</Label>
                  <Input
                    name="heroTitle"
                    value={formData.heroTitle}
                    onChange={handleChange}
                    placeholder="Pune District Handball Association"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Homepage Hero Subtitle / Tagline</Label>
                  <Textarea
                    name="heroSubtitle"
                    rows={3}
                    value={formData.heroSubtitle}
                    onChange={handleChange}
                    placeholder="Fostering excellence, teamwork, and passion for handball across the Pune district."
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 2. Contact & Social Channels */}
        <TabsContent value="contact" className="space-y-6 m-0">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader>
              <CardTitle>Contact Credentials & Office Location</CardTitle>
              <CardDescription>
                Updates the contact details in the website footer and Contact Us page.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Official Contact Email</Label>
                  <Input
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    placeholder="info@pdho.org"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Official Contact Phone</Label>
                  <Input
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Working Hours</Label>
                  <Input
                    name="contactWorkingHours"
                    value={formData.contactWorkingHours}
                    onChange={handleChange}
                    placeholder="Mon - Sat: 9:00 AM - 6:00 PM"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Headquarters / Office Address</Label>
                <Textarea
                  name="contactAddress"
                  rows={2}
                  value={formData.contactAddress}
                  onChange={handleChange}
                  placeholder="Shiv Chhatrapati Sports Complex, Mahalunge, Balewadi, Pune, Maharashtra 411045"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-4">
                <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-600" />
                  Social Media Profiles
                </h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Facebook Page URL</Label>
                    <Input
                      name="socialFacebook"
                      value={formData.socialFacebook}
                      onChange={handleChange}
                      placeholder="https://facebook.com/pdhapune"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Instagram Profile URL</Label>
                    <Input
                      name="socialInstagram"
                      value={formData.socialInstagram}
                      onChange={handleChange}
                      placeholder="https://instagram.com/pdhapune"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Twitter / X Profile URL</Label>
                    <Input
                      name="socialTwitter"
                      value={formData.socialTwitter}
                      onChange={handleChange}
                      placeholder="https://twitter.com/pdhapune"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">YouTube Channel URL</Label>
                    <Input
                      name="socialYoutube"
                      value={formData.socialYoutube}
                      onChange={handleChange}
                      placeholder="https://youtube.com/@pdhapune"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 3. Executive Committee Manager */}
        <TabsContent value="committee" className="space-y-6 m-0">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Executive Committee Members</CardTitle>
                <CardDescription>
                  Manage association office bearers, president, secretary, and officials displayed on the About Us page.
                </CardDescription>
              </div>
              <Button
                onClick={handleAddCommitteeMember}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Member
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.executiveCommittee.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed text-slate-500 text-sm">
                  No committee members added. Click &quot;Add Member&quot; to list office bearers.
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {formData.executiveCommittee.map((member, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 relative group"
                    >
                      <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs font-bold flex items-center justify-center">
                            {index + 1}
                          </span>
                          <span className="font-semibold text-sm text-slate-800">
                            {member.name || "New Officer"}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveCommitteeMember(index)}
                          className="h-7 w-7 p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                          title="Remove Member"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs font-medium">Full Name</Label>
                          <Input
                            value={member.name}
                            onChange={(e) =>
                              handleUpdateCommitteeMember(index, "name", e.target.value)
                            }
                            placeholder="Shri. Rajesh Patil"
                            className="bg-white text-xs h-9"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs font-medium">Designation / Role</Label>
                          <Input
                            value={member.role}
                            onChange={(e) =>
                              handleUpdateCommitteeMember(index, "role", e.target.value)
                            }
                            placeholder="President / General Secretary"
                            className="bg-white text-xs h-9 font-semibold text-orange-600"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs font-medium">Photo URL (Optional)</Label>
                        <Input
                          value={member.photoUrl || ""}
                          onChange={(e) =>
                            handleUpdateCommitteeMember(index, "photoUrl", e.target.value)
                          }
                          placeholder="https://example.com/photo.jpg"
                          className="bg-white text-xs h-9"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs font-medium">Email Address (Optional)</Label>
                          <Input
                            value={member.email || ""}
                            onChange={(e) =>
                              handleUpdateCommitteeMember(index, "email", e.target.value)
                            }
                            placeholder="president@pdho.org"
                            className="bg-white text-xs h-9"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs font-medium">Phone (Optional)</Label>
                          <Input
                            value={member.phone || ""}
                            onChange={(e) =>
                              handleUpdateCommitteeMember(index, "phone", e.target.value)
                            }
                            placeholder="+91 98220 12345"
                            className="bg-white text-xs h-9"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 4. Quick Links Manager */}
        <TabsContent value="quicklinks" className="space-y-6 m-0">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Footer Quick Navigation Links</CardTitle>
                <CardDescription>
                  Configure internal and external navigation links shown in the website footer.
                </CardDescription>
              </div>
              <Button
                onClick={handleAddQuickLink}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Link
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {formData.quickLinks.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed text-slate-500 text-sm">
                  No quick links added. Click &quot;Add Link&quot; to configure footer links.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {formData.quickLinks.map((link, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-lg border border-slate-200"
                    >
                      <span className="text-xs font-bold text-slate-400 w-6 text-center">
                        #{index + 1}
                      </span>
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <Input
                          value={link.label}
                          onChange={(e) =>
                            handleUpdateQuickLink(index, "label", e.target.value)
                          }
                          placeholder="Link Label (e.g. Tournaments)"
                          className="bg-white text-xs h-9"
                        />
                        <Input
                          value={link.url}
                          onChange={(e) =>
                            handleUpdateQuickLink(index, "url", e.target.value)
                          }
                          placeholder="Target URL (e.g. /tournaments)"
                          className="bg-white text-xs h-9 font-mono"
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveQuickLink(index)}
                        className="h-8 w-8 p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 5. Legal & Governance Links */}
        <TabsContent value="legal" className="space-y-6 m-0">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Legal, Terms & Constitution Links</CardTitle>
                <CardDescription>
                  Configure policy, bylaws, rules & regulations links for the footer legal section.
                </CardDescription>
              </div>
              <Button
                onClick={handleAddLegalLink}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Legal Link
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {formData.legalLinks.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed text-slate-500 text-sm">
                  No legal links added. Click &quot;Add Legal Link&quot; to configure legal policies.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {formData.legalLinks.map((link, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-lg border border-slate-200"
                    >
                      <span className="text-xs font-bold text-slate-400 w-6 text-center">
                        #{index + 1}
                      </span>
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <Input
                          value={link.label}
                          onChange={(e) =>
                            handleUpdateLegalLink(index, "label", e.target.value)
                          }
                          placeholder="Policy Label (e.g. Privacy Policy)"
                          className="bg-white text-xs h-9"
                        />
                        <Input
                          value={link.url}
                          onChange={(e) =>
                            handleUpdateLegalLink(index, "url", e.target.value)
                          }
                          placeholder="URL or anchor (e.g. /privacy or #)"
                          className="bg-white text-xs h-9 font-mono"
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveLegalLink(index)}
                        className="h-8 w-8 p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 6. About Us Content */}
        <TabsContent value="about" className="space-y-6 m-0">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader>
              <CardTitle>About Us Story, Vision & Mission</CardTitle>
              <CardDescription>
                Narrate the history of the district handball association, along with core vision and mission statements.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label>Our History</Label>
                <Textarea
                  name="aboutHistory"
                  rows={4}
                  value={formData.aboutHistory}
                  onChange={handleChange}
                  placeholder="The Pune District Handball Association was founded with a single goal: to promote the sport of handball at the grassroots level..."
                />
              </div>
              <div className="space-y-2">
                <Label>Our Vision</Label>
                <Textarea
                  name="aboutVision"
                  rows={3}
                  value={formData.aboutVision}
                  onChange={handleChange}
                  placeholder="To make Pune the premier hub for handball talent in India..."
                />
              </div>
              <div className="space-y-2">
                <Label>Our Mission</Label>
                <Textarea
                  name="aboutMission"
                  rows={3}
                  value={formData.aboutMission}
                  onChange={handleChange}
                  placeholder="To discover, nurture, and empower young athletes..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
