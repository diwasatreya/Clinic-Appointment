import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    speciality: { type: String, required: true },
    description: { type: String, required: true },
});

export default mongoose.model('Doctor', doctorSchema);