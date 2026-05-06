import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
}, { _id: false });

const chatHistorySchema = new mongoose.Schema({
  repoUrl: { type: String, required: true },
  filePath: { type: String, required: true },
  messages: [messageSchema],
}, { timestamps: true });

chatHistorySchema.index({ repoUrl: 1, filePath: 1 });

export default mongoose.model('ChatHistory', chatHistorySchema);