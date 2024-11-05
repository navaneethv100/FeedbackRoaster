import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number;
}

const connection: ConnectionObject = {};

async function dbConnect() : Promise<void> {
    if (connection.isConnected) {
        console.log("Already connected to the database");
        return;
    }
    //To check if connection is Already Established - This is to prevent multiple connections - Edge Time Framework - 
    try {
        const db =await mongoose.connect(process.env.MONGODB_URI as string);
        console.log(db);
        console.log(db.connections);
        connection.isConnected = db.connections[0].readyState;
        console.log("Connected to DB successfully");
    } catch (error) {
        console.log("Error connecting to the database", error);
        process.exit(1);
    }
}

export default dbConnect;
