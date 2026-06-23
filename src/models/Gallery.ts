import mongoose, { Schema, Document } from 'mongoose';

export interface IGallery extends Document {
  title: string;
  mediaUrl: string;
  mediaType: 'Image' | 'Video';
  tournamentId?: mongoose.Types.ObjectId;
  uploadDate: Date;
}

const GallerySchema: Schema = new Schema({
  title: { type: String, required: true },
  mediaUrl: { type: String, required: true },
  mediaType: { type: String, enum: ['Image', 'Video'], default: 'Image' },
  tournamentId: { type: Schema.Types.ObjectId, ref: 'Tournament' },
  uploadDate: { type: Date, default: Date.now },
});

export default mongoose.models.Gallery || mongoose.model<IGallery>('Gallery', GallerySchema);
