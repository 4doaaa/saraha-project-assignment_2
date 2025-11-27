import mongoose from "mongoose";
export const genderEnum = {
    MALE:"MALE",
    FEMALE:"FEMALE",
};
const userSchema = new mongoose.Schema({
    firstName: {
        type:String,
        required: true,
        trim:true,
        minlength:[2 , "First Name must be at least 2 characters long"],
        maxlength:[20 , "First Name must be at most 20 characters long"],
    },
    lastName: {
        type:String,
        required: true,
        trim:true,
        minlength:[2 , "First Name must be at least 2 characters long"],
        maxlength:[20 , "First Name must be at most 20 characters long"],
    },
    email:
    {
        type:String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type:String,
        required:true,
    },
    gender:{
        type:String,
        enum:{
            values: Object.values(genderEnum), //["Male" , "Female"],
            message:"{VALUE} is not valid gender",
        },
        default:genderEnum.MALE,
    },
    phone: String,
    confirmEmail:Date,
    confirmEmailOTP: String,
    
},
 {timestamps: true });
const UserModel = mongoose.models.User || mongoose.model("User",userSchema);

export default UserModel;

// rhyg chcm truf ltax
