import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGO - URI);
        console.log("database connected!");
    } catch (err) {
        console.log(err);
        console.log("database not connet ",);
    }
}

export default dbConnect;
