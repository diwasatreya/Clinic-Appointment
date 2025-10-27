import mongoose from "mongoose";

const clinicSchema = new mongoose.Schema({
    clinicName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: Number, required: true, unique: true },
    address: { type: String, required: true },
    password: { type: String, required: true },
}, {
    timestamps: true
});

export default mongoose.model("Clinic", clinicSchema);