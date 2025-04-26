import { Schema, models, model } from "mongoose"

const SubmissionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  challenge: {
    type: Schema.Types.ObjectId,
    ref: "Challenge",
    required: true,
  },
  submissionType: {
    type: String,
    enum: ["code", "github", "quiz"],
    required: true,
  },

  // For code submissions
  code: String,
  language: String,

  // For GitHub submissions
  githubLink: String,
  notes: String,

  // For quiz submissions
  answers: [String],

  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  score: {
    type: Number,
    default: 0,
  },
  feedback: String,

  submittedAt: {
    type: Date,
    default: Date.now,
  },
})

export default models.Submission || model("Submission", SubmissionSchema)
