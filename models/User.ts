import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true }, // In production, ensure this is hashed
  role: { type: String, enum: ["user", "admin"], default: "user" },
  score: { type: Number, default: 0 },
  rank: { type: Number, default: 0 },
  solvedChallenges: [
    {
      challenge: { type: mongoose.Schema.Types.ObjectId, ref: "Challenge" },
      solvedAt: { type: Date, default: Date.now },
      score: { type: Number, default: 0 },
    },
  ],
  inProgressChallenges: [
    {
      challenge: { type: mongoose.Schema.Types.ObjectId, ref: "Challenge" },
      startedAt: { type: Date, default: Date.now },
      lastAttempt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.models.User || mongoose.model("User", UserSchema)
