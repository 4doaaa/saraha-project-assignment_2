import mongoose from "mongoose";


 const connectDB = async ()=>{
    try {
        await mongoose.connect(
            "mongodb+srv://saraha:sarahadb@cluster0.ca1xj8h.mongodb.net/sarahaApp_3" ,
        {
            serverSelectionTimeoutMS: 5000,
        });
   console.log("MongoDB Connection Successfully");
   
    } catch (error) {
        console.log("MongoDB Connection Failed " , error);
        
    } 
};

export default connectDB;