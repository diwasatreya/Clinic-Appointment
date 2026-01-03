import mongoose from "mongoose";

const timeSlotSchema = new mongoose.Schema({
    time: { type: String, required: true },
    limit: { type: Number, default: 10, required: false }
}, { _id: false });

const doctorSchema = new mongoose.Schema({
    clinicId: { type: String, required: true },
    name: { type: String, required: true },
    speciality: { type: String, required: true },
    description: { type: String, required: true },
    time: { type: [timeSlotSchema], required: false }
});

export default mongoose.model('Doctor', doctorSchema);