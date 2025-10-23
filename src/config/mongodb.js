import mongoose from 'mongoose';

const connectDB = async (MONGO_URI) => {
    try {
        if (!MONGO_URI) throw Error("No MongoDB URL Provided!");

        await mongoose.connect(MONGO_URI);
        console.log("Connected to the MongoDB!");

    } catch (error) {
        console.log(error);
    }
};

export default connectDB;