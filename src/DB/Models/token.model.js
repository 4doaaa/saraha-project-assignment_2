import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
jwtid:{
    type: String,
    require:true,
    uniquer:true,
} 
, expiresIn:{
    type:Date,
    require:true,
} ,
 userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
   required:true,
 },
},
 {timestamps: true });
const TokenModel = mongoose.models.Token || mongoose.model("Token",tokenSchema);

export default TokenModel;

