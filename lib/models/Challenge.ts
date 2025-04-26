import { Schema, models, model } from "mongoose"

const ChallengeSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["DSA", "Quiz", "Project"],
    required: true,
  },
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard", "Expert"],
    required: true,
  },
  points: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "draft", "archived"],
    default: "active",
  },

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

  createdBy: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

export default models.Challenge || model("Challenge", ChallengeSchema)
