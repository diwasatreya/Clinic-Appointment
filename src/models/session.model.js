import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    userAgent: { type: String, required: true },
    valid: { type: Boolean, default: false, required: false }
}, {
    timestamps: true
});

export default mongoose.model("Sessions", sessionSchema);