import mongoose, { Schema, Document } from 'mongoose';

export interface ITeam extends Document {
  name: string;
  managerName: string;
  contactNumber: string;
  email: string;
  category: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: Date;
}

const TeamSchema: Schema = new Schema({
  name: { type: String, required: true },
  managerName: { type: String, required: true },
  contactNumber: { type: String, required: true },
  email: { type: String, required: true },
  category: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Team || mongoose.model<ITeam>('Team', TeamSchema);
