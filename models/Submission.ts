import mongoose from "mongoose"

const SubmissionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  challenge: { type: mongoose.Schema.Types.ObjectId, ref: "Challenge", required: true },
  submissionType: { type: String, enum: ["code", "github", "quiz"], required: true },

  // For code submissions
  code: String,
  language: String,

  // For GitHub submissions
  githubLink: String,
  notes: String,

  // For quiz submissions
  answers: [String],

  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
  score: { type: Number, default: 0 },
  feedback: String,

  submittedAt: { type: Date, default: Date.now },
})

export default mongoose.models.Submission || mongoose.model("Submission", SubmissionSchema)
