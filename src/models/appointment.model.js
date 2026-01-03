import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    clinicID: { type: String, required: true },
    checkupType: { type: String, required: true },
    doctorId: { type: String, required: true },
    appointmentDate: { type: String, required: true },
    appointmentTime: { type: String, required: true },
    reason: { type: String, required: false },
    completed: { type: Boolean, default: false, required: false },
    status: { type: String, default: "Pending", required: false },
    cancellationReason: { type: String, required: false }



}, {
    timestamps: true
});

export default mongoose.model("Appointment", appointmentSchema);