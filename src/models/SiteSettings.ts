import mongoose, { Schema, Document } from 'mongoose';

export interface ISiteSettings extends Document {
  siteName: string;
  logoUrl: string;
  heroTitle: string;
  heroSubtitle: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  aboutHistory: string;
  aboutVision: string;
  aboutMission: string;
  updatedAt: Date;
}

const SiteSettingsSchema: Schema = new Schema({
  siteName: { type: String, default: 'Pune District Handball Organisation' },
  logoUrl: { type: String, default: '' },
  heroTitle: { type: String, default: 'Pune District Handball Organisation' },
  heroSubtitle: { type: String, default: 'Fostering excellence, teamwork, and passion for handball across the Pune district.' },
  contactEmail: { type: String, default: 'info@pdho.org' },
  contactPhone: { type: String, default: '+91 98765 43210' },
  contactAddress: { type: String, default: 'Shiv Chhatrapati Sports Complex, Mahalunge, Balewadi, Pune, Maharashtra 411045' },
  aboutHistory: { type: String, default: 'Founded with a single goal: to promote the sport of handball at the grassroots level.' },
  aboutVision: { type: String, default: 'To make Pune the premier hub for handball talent in India.' },
  aboutMission: { type: String, default: 'To discover, nurture, and empower young athletes.' },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.SiteSettings || mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);
