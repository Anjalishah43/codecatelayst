import mongoose from "mongoose"

const ChallengeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ["DSA", "Quiz", "Project"], required: true },
  difficulty: { type: String, enum: ["Easy", "Medium", "Hard", "Expert"], required: true },
  points: { type: Number, required: true },
  status: { type: String, enum: ["active", "draft", "archived"], default: "active" },

  // For DSA challenges
  examples: [
    {
      input: String,
      output: String,
      explanation: String,
    },
  ],
  constraints: [String],
  testCases: [
    {
      input: String,
      output: String,
      isHidden: { type: Boolean, default: false },
    },
  ],

  // For Quiz challenges
  questions: [
    {
      question: String,
      options: [String],
      answer: String,
    },
  ],

  // For Project challenges
  requirements: [String],

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

export default mongoose.models.Challenge || mongoose.model("Challenge", ChallengeSchema)
