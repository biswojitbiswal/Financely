import mongoose from "mongoose";

const connectDb = async () => {
    try {
        const connection = await mongoose.connect(`${process.env.MONGO_DB_URL}`);
        console.log("MongoDb Database Connection Successful")
    } catch (error) {
        console.log("MongoDB Database Connection Failed: ",error);
        process.exit(1);
    }
}

export default connectDb;