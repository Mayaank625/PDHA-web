import mongoose, { Schema, Document } from 'mongoose';

export interface IPlayer extends Document {
  fullName: string;
  age: number;
  gender: string;
  teamId?: mongoose.Types.ObjectId;
  mobileNumber: string;
  email: string;
  district: string;
  position: string;
  registrationStatus: 'Pending' | 'Approved';
  createdAt: Date;
}

const PlayerSchema: Schema = new Schema({
  fullName: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  teamId: { type: Schema.Types.ObjectId, ref: 'Team' },
  mobileNumber: { type: String, required: true },
  email: { type: String, required: true },
  district: { type: String, required: true },
  position: { type: String, required: true },
  registrationStatus: { type: String, enum: ['Pending', 'Approved'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Player || mongoose.model<IPlayer>('Player', PlayerSchema);
