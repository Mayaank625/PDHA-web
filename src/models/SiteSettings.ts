import mongoose, { Schema, Document } from 'mongoose';

export interface ILinkItem {
  label: string;
  url: string;
}

export interface ICommitteeMember {
  name: string;
  role: string;
  photoUrl?: string;
  phone?: string;
  email?: string;
}

export interface ISiteSettings extends Document {
  siteName: string;
  logoUrl: string;
  heroTitle: string;
  heroSubtitle: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  contactWorkingHours: string;
  socialFacebook: string;
  socialInstagram: string;
  socialTwitter: string;
  socialYoutube: string;
  aboutHistory: string;
  aboutVision: string;
  aboutMission: string;
  quickLinks: ILinkItem[];
  legalLinks: ILinkItem[];
  executiveCommittee: ICommitteeMember[];
  updatedAt: Date;
}

const LinkItemSchema = new Schema(
  {
    label: { type: String, required: true },
    url: { type: String, required: true },
  },
  { _id: false }
);

const CommitteeMemberSchema = new Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    photoUrl: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
  },
  { _id: false }
);

const SiteSettingsSchema: Schema = new Schema({
  siteName: { type: String, default: 'Pune District Handball Association' },
  logoUrl: { type: String, default: '' },
  heroTitle: { type: String, default: 'Pune District Handball Association' },
  heroSubtitle: { type: String, default: 'Fostering excellence, teamwork, and passion for handball across the Pune district.' },
  contactEmail: { type: String, default: 'info@pdho.org' },
  contactPhone: { type: String, default: '+91 98765 43210' },
  contactAddress: { type: String, default: 'Shiv Chhatrapati Sports Complex, Mahalunge, Balewadi, Pune, Maharashtra 411045' },
  contactWorkingHours: { type: String, default: 'Mon - Sat: 9:00 AM - 6:00 PM' },
  socialFacebook: { type: String, default: 'https://facebook.com' },
  socialInstagram: { type: String, default: 'https://instagram.com' },
  socialTwitter: { type: String, default: 'https://twitter.com' },
  socialYoutube: { type: String, default: 'https://youtube.com' },
  aboutHistory: { type: String, default: 'The Pune District Handball Association was founded with a single goal: to promote the sport of handball at the grassroots level.' },
  aboutVision: { type: String, default: 'To make Pune the premier hub for handball talent in India by providing world-class coaching, infrastructure, and competitive opportunities.' },
  aboutMission: { type: String, default: 'To discover, nurture, and empower young athletes through structured training programs and transparent, high-quality tournaments.' },
  quickLinks: {
    type: [LinkItemSchema],
    default: [
      { label: 'About Us', url: '/about' },
      { label: 'Tournaments', url: '/tournaments' },
      { label: 'Schedule & Results', url: '/schedule' },
      { label: 'Player Registration', url: '/register/player' },
      { label: 'Team Registration', url: '/register/team' },
      { label: 'Media Gallery', url: '/gallery' },
    ],
  },
  legalLinks: {
    type: [LinkItemSchema],
    default: [
      { label: 'Privacy Policy', url: '#' },
      { label: 'Terms of Service', url: '#' },
      { label: 'Rules & Regulations', url: '#' },
      { label: 'Code of Conduct', url: '#' },
    ],
  },
  executiveCommittee: {
    type: [CommitteeMemberSchema],
    default: [
      { name: 'Shri. Rajesh Patil', role: 'President', photoUrl: '', phone: '+91 98220 12345', email: 'president@pdho.org' },
      { name: 'Mr. Anand Shinde', role: 'General Secretary', photoUrl: '', phone: '+91 98221 23456', email: 'secretary@pdho.org' },
      { name: 'Mrs. Sneha Deshmukh', role: 'Treasurer', photoUrl: '', phone: '+91 98222 34567', email: 'treasurer@pdho.org' },
      { name: 'Mr. Vikram Joshi', role: 'Vice President', photoUrl: '', phone: '+91 98223 45678', email: 'vp@pdho.org' },
      { name: 'Mr. Sameer Kulkarni', role: 'Joint Secretary', photoUrl: '', phone: '+91 98224 56789', email: 'jointsec@pdho.org' },
      { name: 'Coach Ramesh Jadhav', role: 'Technical Director', photoUrl: '', phone: '+91 98225 67890', email: 'technical@pdho.org' },
    ],
  },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.SiteSettings || mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);
