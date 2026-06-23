import mongoose, { Schema, Document } from 'mongoose';

export interface IMatch extends Document {
  tournamentId: mongoose.Types.ObjectId;
  teamA: mongoose.Types.ObjectId;
  teamB: mongoose.Types.ObjectId;
  matchDate: Date;
  venue: string;
  scoreA: number;
  scoreB: number;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  stage: string;
}

const MatchSchema: Schema = new Schema({
  tournamentId: { type: Schema.Types.ObjectId, ref: 'Tournament', required: true },
  teamA: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
  teamB: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
  matchDate: { type: Date, required: true },
  venue: { type: String, required: true },
  scoreA: { type: Number, default: 0 },
  scoreB: { type: Number, default: 0 },
  status: { type: String, enum: ['Scheduled', 'Completed', 'Cancelled'], default: 'Scheduled' },
  stage: { type: String, required: true },
});

export default mongoose.models.Match || mongoose.model<IMatch>('Match', MatchSchema);
