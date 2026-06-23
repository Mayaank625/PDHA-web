import mongoose, { Schema, Document } from 'mongoose';

export interface ITournament extends Document {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  venue: string;
  rules: string;
  status: 'Upcoming' | 'Ongoing' | 'Past';
  registrationOpen: boolean;
  createdAt: Date;
}

const TournamentSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  venue: { type: String, required: true },
  rules: { type: String },
  status: { type: String, enum: ['Upcoming', 'Ongoing', 'Past'], default: 'Upcoming' },
  registrationOpen: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Tournament || mongoose.model<ITournament>('Tournament', TournamentSchema);
