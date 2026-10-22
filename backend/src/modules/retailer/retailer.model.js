 import mongoose from "mongoose";

const retailerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,   
    },
    shopName: { type: String, required: true, trim: true },
    shopAddress: { type: String, required: true },
    gstNumber: { 
      type: String, 
      required: true, 
      match: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/  
    },
    status: { 
      type: String, 
      enum: ["PENDING", "APPROVED", "REJECTED"], 
      default: "PENDING" 
    },
    isActive: { type: Boolean, default: true },
    bankDetails: {   
      accountNumber: String,
      ifsc: String,
      bankName: String,
    },
  },
  { timestamps: true }
);

export const Retailer = mongoose.model("Retailer", retailerSchema);
