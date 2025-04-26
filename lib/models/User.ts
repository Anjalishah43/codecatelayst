import { Schema, models, model } from "mongoose"

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  score: {
    type: Number,
    default: 0,
  },
  rank: {
    type: Number,
    default: 0,
  },
  solvedChallenges: [
    {
      challenge: {
        type: Schema.Types.ObjectId,
        ref: "Challenge",
      },
      solvedAt: {
        type: Date,
        default: Date.now,
      },
      score: {
        type: Number,
        default: 0,
      },
    },
  ],
  inProgressChallenges: [
    {
      challenge: {
        type: Schema.Types.ObjectId,
        ref: "Challenge",
      },
      startedAt: {
        type: Date,
        default: Date.now,
      },
      lastAttempt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default models.User || model("User", UserSchema)
