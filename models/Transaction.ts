import mongoose, { Schema, model, models } from "mongoose";

const transactionSchema = new Schema({
  userId: { type: String, required: true },
  type: { type: String, enum: ["income", "expense"], required: true },
  amount: { type: Number, required: true },
  category: { type: String, default: "General" }, // ✅ NEW
  description: String,
  date: { type: Date, default: Date.now },
});

const Transaction = models.Transaction || model("Transaction", transactionSchema);
export default Transaction;
