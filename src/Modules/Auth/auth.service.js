import UserModel from "../../DB/Models/user.model.js";
import { successResponse } from "../../Utils/successResponse.utils.js";
import * as dbService from "../../DB/dbService.js";
import { asymmetricEncrypt, encrypt } from "../../Utils/Encryption/encryption.utils.js";
//import { encrypt } from "../../Utils/Encryption/encryption.utils.js";

import bcrypt, { compare } from 'bcrypt';
/////signup
export const signup = async (req , res , next)=>{
     const {firstName , lastName , email , password , gender , phone } = req.body;
//create user ---> direct call create method db
     const checkUser = await dbService.findOne({model:UserModel , filter: {email},});
  
     if (checkUser){ 
        return next(new Error("User Already Exists", {cause:409}));
  }
 
 
 
 
 // encrypt

  // const encryptedData = encrypt(phone);
 const encryptedData = asymmetricEncrypt(phone);

 const saltRounds = 10; 
 const hashedPassword = await bcrypt.hash(password, saltRounds);
  
 const user = await dbService.create({model:UserModel, data:[{firstName ,
     lastName ,
      email ,
       password: hashedPassword,
       gender ,
        phone:encryptedData},],
    });
        return successResponse({res ,
         statuscode:201,
         message:"User Created Successfuly",
          data: {user}
        });

};

////login 
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
  return successResponse({res ,
         statuscode:200,
         message:"User loggedIn Successfuly",
          data: {checkUser}
        });
};