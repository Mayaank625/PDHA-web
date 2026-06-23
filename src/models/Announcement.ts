import mongoose, { Schema, Document } from 'mongoose';

export interface IAnnouncement extends Document {
  title: string;
  content: string;
  type: 'News' | 'Notice' | 'Event';
  isPublished: boolean;
  publishDate: Date;
}

const AnnouncementSchema: Schema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ['News', 'Notice', 'Event'], default: 'News' },
  isPublished: { type: Boolean, default: false },
  publishDate: { type: Date, default: Date.now },
});

export default mongoose.models.Announcement || mongoose.model<IAnnouncement>('Announcement', AnnouncementSchema);
