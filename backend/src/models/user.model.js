import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    avatar: {
      type: String,
      default: null,
    },

    password: {
      type: String,
      required: false,
      select: false,
    },

    role: {
      type: String,
      enum: ["CUSTOMER", "ADMIN", "RETAILER"],
      default: "CUSTOMER",
    },
    googleId: {
      type: String,
      default: null,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
  },
  { timestamps: true },
);
export const User = mongoose.models.User || mongoose.model("User", userSchema);
