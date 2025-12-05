import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
content: {
    type: String,
    required: true,
    minLength: [2,"Message Must be at least 2 characters long "],
    maxLength: [500,"Message Must be at most 500 characters long "],

},
receiverId:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
},
},
 {timestamps: true });
const messageModel = mongoose.models.Message || mongoose.model("Message",messageSchema);
export default messageModel;

