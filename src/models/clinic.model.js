import mongoose from "mongoose";

const clinicSchema = new mongoose.Schema({
    clinicName: { type: String, required: true },
    description: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    phone: { type: Number, required: true, unique: true },
    address: { type: String, required: true },
    password: { type: String, required: true },
    opening: { type: String, required: false },
    speciality: { type: Array, required: false },
    status: { type: Boolean, default: true, required: false },
    approved: { type: Boolean, default: true, required: false },
}, {
    timestamps: true
});

export default mongoose.model("Clinic", clinicSchema);