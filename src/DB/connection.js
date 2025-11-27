import mongoose from "mongoose";


 const connectDB = async ()=>{
    try {
        await mongoose.connect(
            process.env.DB_URI,
        {
            serverSelectionTimeoutMS: 5000,
        });
   console.log("MongoDB Connection Successfully");
   
    } catch (error) {
        console.log("MongoDB Connection Failed " , error);
        
    } 
};

export default connectDB;