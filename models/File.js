import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  filename: String,
  originalName: String,
  contentType: String,
  size: Number,
  uploadDate: { type: Date, default: Date.now },
});

export default mongoose.model('File', fileSchema)