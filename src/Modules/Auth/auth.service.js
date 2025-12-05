import UserModel, { providerEnum } from "../../DB/Models/user.model.js";
import TokenModel from "../../DB/Models/token.model.js"; 
import { successResponse } from "../../Utils/successResponse.utils.js";
import * as dbService from "../../DB/dbService.js";
import { asymmetricEncrypt, encrypt } from "../../Utils/Encryption/encryption.utils.js";
//import { encrypt } from "../../Utils/Encryption/encryption.utils.js";
import bcrypt, { compare } from 'bcrypt';
import { emailSubject, sendEmail } from "../../Utils/Emails/email.utils.js";
import { emailEvents } from "../../Utils/Events/email.event.utils.js";
import { customAlphabet } from "nanoid";
import { generateToken, verifyToken } from "../../Utils/tokens/token.utils.js";
import {v4 as uuid} from "uuid";
import { signupSchema } from "../../Middlewares/validation.middleware.js"; 
import nodemailer from "nodemailer";
import { OAuth2Client } from 'google-auth-library';
import { model } from "mongoose";

// Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

// ==================== SIGNUP ====================
export const signup = async (req , res , next)=>{
     const {firstName ,
       lastName ,
        email , 
        password ,
        confirmPassword,
         gender , 
         phone
         } = req.body;
const { error } = signupSchema.body.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      message: "Validation Failed",
      errors: error.details.map((d) => d.message),
    });
  }

//create user ---> direct call create method db
     const checkUser = await dbService.findOne({
      model:UserModel , 
      filter: {email},
    });
  
     if (checkUser){ 
        return next(new Error("User Already Exists", {cause:409}));
  };
 // encrypt

  // const encryptedData = encrypt(phone);
 const encryptedData = asymmetricEncrypt(phone);

 const saltRounds = 10; 
 const hashedPassword = await bcrypt.hash(password, saltRounds);
  
// generate OTP
const otp = customAlphabet("0123456789",6)();

const user = await dbService.create({
  model: UserModel,
  data:[ {                     
    firstName,
    lastName,
    email,
    password: hashedPassword,
    confirmEmailOTP: await bcrypt.hash(otp, saltRounds),
   confirmEmailOTPExpires: Date.now() + 10 * 60 * 1000,  
    phone: encryptedData,
    gender,
  }]
});
   //emit 
   emailEvents.emit("confirmEmail", {to: email , otp , firstName});

const accessToken = await generateToken({payload: {id:user._id, email:user.email},
  secretkey:process.env.TOKEN_ACCESS_SECRET,
  options: {
    expiresIn: "1d",
    issuer: "http://localhost:3000",
    audience:"http://localhost:4000",
    jwtid: uuid(), // user for revoke token
  },
});

        return successResponse({res ,
         statuscode:201,
         message:"User Created Successfuly",
          data: {accessToken}
        });
};


// ==================== LOGIN ====================
export const login = async (req , res , next)=>{
   
     const {email , password} = req.body;

     const checkUser = await dbService.findOne({model:UserModel , 
        filter: {email},
    });
     if (!checkUser){
    return next(new Error("User Not Found", {cause:404}));
  }
if (!(await bcrypt.compare(password, checkUser.password))) { 
        return next(new Error("Invalid Email Or Password" , {cause: 400}));  
    }
const accessToken =  generateToken({
    payload: { id: checkUser._id, email: checkUser.email },
    secretkey: process.env.TOKEN_ACCESS_SECRET,
    options: {
        expiresIn:parseInt(process.env.ACCESS_TOKEN_EXPIRES_IN),
        jwtid: uuid(),
    },
});


const refreshToken =  generateToken({
    payload: { id: checkUser._id, email: checkUser.email },
    secretkey:process.env.REFRESH_TOKEN_SECRET,
    options: {
        expiresIn:parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN),
        jwtid: uuid(),
    },
});
return successResponse({
    res,
    statuscode: 200,
    message: "User loggedIn Successfuly",
    data: { accessToken, refreshToken },
});
};


// ==================== CONFIRM EMAIL ====================
export const confirmEmail = async (req , res , next)=>{
   
     const {email , otp} = req.body;

const user = await dbService.findOne({
  model: UserModel,
  filter: {
    email,
    confirmEmail: false,                  
    confirmEmailOTP: { $exists: true },
    confirmEmailOTPExpires: { $gt: Date.now() }
  }
});

     if (!user){
return next(new Error("Invalid or expired OTP, or email already confirmed", { cause: 400 }));     }

     if (!(await bcrypt.compare(otp, user.confirmEmailOTP))) {
        return next(new Error("Invalid otp" , {cause: 400})); 
     };

        //update user 
  await dbService.updateOne({
  model: UserModel,
  filter: { _id: user._id }, 
  data: {
    confirmEmail: true, 
    $unset: {
      confirmEmailOTP: 1,
      confirmEmailOTPExpires: 1
    }
  }
});
   return successResponse({
    res,
    statuscode: 200,
    message: "Email confirmed successfully",
    data: null
  });
};


// ==================== LOGOUT (Revoke Token) ====================
export const logOut = async (req , res , next)=>{
  
    await dbService.create({
        model: TokenModel,
        data: [
           { jwtid: req.decoded.jti,
            expiresIn: new Date( req.decoded.exp * 1000),
            userId: req.user._id,
       },
      ] ,
    });

   return successResponse({
    res,
    statuscode: 200,
    message: "logged out successfully",
    data: {}
  });
};



// ==================== refreshToken ====================
export const refreshToken = async (req , res , next)=>{
 
 const {refreshtoken} =req.headers; 
const decoded = verifyToken({ 
  token:refreshtoken,
  secretkey:process.env.REFRESH_TOKEN_SECRET,
});

const accessToken =  generateToken({
    payload: { id: decoded.id, email: decoded.email },
    secretkey: process.env.TOKEN_ACCESS_SECRET,
    options: {
        expiresIn:parseInt(process.env.ACCESS_TOKEN_EXPIRES_IN),
        jwtid: uuid(),
    },
});

   return successResponse({
    res,
    statuscode: 200,
    message: "Token Refreshed successfully",
    data: {accessToken},
  });
};



// ==================== forgetPassword ====================

const saltRounds = 10;
export const forgetPassword = async (req , res , next)=>{
 const {email} =req.body;

 //send email otp
 const otp = await customAlphabet("123456789pqowieurtysgdhl",6)();

 const user = await dbService.findOneAndUpdate({
  model:UserModel,
  filter:{
  email,
  confirmEmail:{$exists:true},
 },
}, {data:{
  forgetPasswordOTP: await bcrypt.hash(otp, saltRounds),
  forgetPasswordOTPExpires: Date.now() + 10 * 60 * 1000, 
}});
if(!user)return next(new Error("User Not Found or Email Not Confirmed" , {cause:404}));
//send email emit 
 emailEvents.emit("forgetPassword",{ 
  to:email,
  firstName: user.firstName,
  otp,
});
   return successResponse({
    res,
    statuscode: 200,
    message: "Check Your Box",
  });
};


// ==================== resetPassword ====================
export const resetPassword = async (req, res, next) => {
    const { email, otp, newPassword } = req.body;

    const user = await dbService.findOne({
        model: UserModel,
        filter: {
            email,
            forgetPasswordOTP: { $exists: true },
            forgetPasswordOTPExpires: { $gt: Date.now() }
        }
    });

    if (!user) {
        return next(new Error("Invalid or expired OTP", { cause: 400 }));
    }

    const isOtpValid = await bcrypt.compare(otp, user.forgetPasswordOTP);
    if (!isOtpValid) {
        return next(new Error("Invalid OTP", { cause: 400 }));
    }

    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    await dbService.updateOne({
        model: UserModel,
        filter: { _id: user._id },
        data: {
            password: hashedNewPassword,
            $unset: {
                forgetPasswordOTP: 1,
                forgetPasswordOTPExpires: 1
            }
        }
    });
    return successResponse({
        res,
        statuscode: 200,
        message: "Password reset successfully",
        data: null
    });
};



// ====================verifyGoogleAccount====================

const client = new OAuth2Client();

const verifyGoogleAccount = async ({ idToken }) => {
  const ticket = await client.verifyIdToken({
    idToken
  });
  const payload = ticket.getPayload();
      return ticket.getPayload();
}





// ==================== GOOGLE LOGIN ====================
export const loginwithGoogle = async (req, res, next) => {
  const token = req.body.credential || req.body.idToken || req.body.token;

  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Google token is missing"
    });
  }


    const {email ,email_verified ,given_name ,family_name ,picture} = 
    await verifyGoogleAccount({idToken});

 if (!email_verified) 
return next(new Error("Email not verified by Google", { cause: 401 })); 

  const user = await dbService.findOne({
    model:UserModel,
    filter:{email},
  });
  if(user){
    if(user.providers === providerEnum.GOOGLE){
const accessToken =  generateToken({
    payload: { id: user._id, email: user.email },
    secretkey: process.env.TOKEN_ACCESS_SECRET,
    options: {
        expiresIn:parseInt(process.env.ACCESS_TOKEN_EXPIRES_IN),
        jwtid: uuid(),
    },
});


const refreshToken =  generateToken({
    payload: { id: user._id, email: user.email },
    secretkey:process.env.REFRESH_TOKEN_SECRET,
    options: {
        expiresIn:parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN),
        jwtid: uuid(),
    },
});
return successResponse({
    res,
    statuscode: 200,
    message: "User loggedIn Successfuly",
    data: { accessToken, refreshToken },
});
};

    }
    const newUser = await dbService.create({
  model:UserModel,
    data:[{
      firstName: given_name,
      lastName: family_name,
      email,
      confirmEmail:date.now(),
      providers:providerEnum.GOOGLE,
    },],
    });
  const accessToken =  generateToken({
    payload: { id: newUser._id, email: newUser.email },
    secretkey: process.env.TOKEN_ACCESS_SECRET,
    options: {
        expiresIn:parseInt(process.env.ACCESS_TOKEN_EXPIRES_IN),
        jwtid: uuid(),
    },
});


const refreshToken =  generateToken({
    payload: { id: newUser._id, email: newUser.email },
    secretkey:process.env.REFRESH_TOKEN_SECRET,
    options: {
        expiresIn:parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN),
        jwtid: uuid(),
    },
});
  return successResponse({
    res,
    statuscode: 200,
    message: "Google login successful",
    data: {accessToken ,refreshToken},
  });
};