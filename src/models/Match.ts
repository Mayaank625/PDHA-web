import mongoose, { Schema, Document } from 'mongoose';

export interface IMatch extends Document {
  tournamentTitle?: string;
  tournamentId?: mongoose.Types.ObjectId;
  teamA: string;
  teamB: string;
  teamAId?: mongoose.Types.ObjectId;
  teamBId?: mongoose.Types.ObjectId;
  matchDate: Date;
  venue: string;
  scoreA: number;
  scoreB: number;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  stage: string;
  createdAt: Date;
}

const MatchSchema: Schema = new Schema({
  tournamentTitle: { type: String, default: 'General Match' },
  tournamentId: { type: Schema.Types.ObjectId, ref: 'Tournament' },
  teamA: { type: String, required: true },
  teamB: { type: String, required: true },
  teamAId: { type: Schema.Types.ObjectId, ref: 'Team' },
  teamBId: { type: Schema.Types.ObjectId, ref: 'Team' },
  matchDate: { type: Date, required: true },
  venue: { type: String, required: true },
  scoreA: { type: Number, default: 0 },
  scoreB: { type: Number, default: 0 },
  status: { type: String, enum: ['Scheduled', 'Completed', 'Cancelled'], default: 'Scheduled' },
  stage: { type: String, default: 'Group Stage' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Match || mongoose.model<IMatch>('Match', MatchSchema);
