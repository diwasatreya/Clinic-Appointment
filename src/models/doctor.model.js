import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
    clinicId: { type: String, required: true },
    name: { type: String, required: true },
    speciality: { type: String, required: true },
    description: { type: String, required: true },
    time: { type: Array, required: false }
});

export default mongoose.model('Doctor', doctorSchema);