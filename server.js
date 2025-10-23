import app from './src/app.js';
import connectDB from './src/config/mongodb.js';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

function start() {

    try {
        if (!PORT) throw Error('No Server PORT provided!');

        connectDB(MONGO_URI);

        app.listen(PORT, () => {
            console.log(`🔥 Server Started in http://localhost:${PORT}`);
        })
    } catch (error) {
        console.error(error);
    }

}

start();