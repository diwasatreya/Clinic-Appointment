import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    number: { type: Number, required: true, unique: true },
    password: { type: String, required: true },
}, {
    timestamps: true
});

export default mongoose.model("Users", userSchema);