import mongoose from 'mongoose';

const repoSchema = new mongoose.Schema({
  repoUrl: { type: String, required: true, unique: true },
  owner: String,
  name: String,
  structure: mongoose.Schema.Types.Mixed,
  analysis: mongoose.Schema.Types.Mixed,
  dependencies: mongoose.Schema.Types.Mixed,
  techStack: [String],
  fileContents: mongoose.Schema.Types.Mixed,
}, { timestamps: true });

repoSchema.index({ repoUrl: 1 });

export default mongoose.model('Repo', repoSchema);