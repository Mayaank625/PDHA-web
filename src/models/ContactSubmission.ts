import mongoose, { Schema, Document } from 'mongoose';

export interface IContactSubmission extends Document {
  name: string;
  email: string;
  message: string;
  status: 'Unread' | 'Read' | 'Replied';
  submittedAt: Date;
}

const ContactSubmissionSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['Unread', 'Read', 'Replied'], default: 'Unread' },
  submittedAt: { type: Date, default: Date.now },
});

export default mongoose.models.ContactSubmission || mongoose.model<IContactSubmission>('ContactSubmission', ContactSubmissionSchema);
