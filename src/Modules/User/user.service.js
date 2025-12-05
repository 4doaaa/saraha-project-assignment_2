
import * as dbService from "../../DB/dbService.js";
import UserModel from "../../DB/Models/user.model.js";
import { asymmetricDecript } from "../../Utils/Encryption/encryption.utils.js";
import { successResponse } from "../../Utils/successResponse.utils.js";


export const listAllUsers = async (req, res, next ) =>{
    let users = await dbService.find({
        model: UserModel,
        populate:[{path:"messages"}],
    });
 
    users = users.map ((userDoc) =>{
    const user = userDoc.toObject(); 

    if (user.phone && typeof user.phone === 'string' && user.phone.includes(':')) {
        user.phone = asymmetricDecript(user.phone); 
    }
    return user;
});
       
  
  return successResponse({res ,
           statuscode:200,
           message:"User Fetched Successfuly",
            data: {users},
          });
  
};





export const updateProfile = async (req, res, next ) =>{
    
  const {firstName , lastName , gender}= req.body;
  const { id } = req.decoded;

  
  //token---> req.headers

   const user = await dbService.findByIdAndUpdate({
       model: UserModel,
       id: id, 
       data:{firstName , lastName , gender ,$inc: {__v:1} },
       new: true 
     });
  return successResponse({res ,
           statuscode:200,
           message:"User Updated Successfuly",
            data: {user},
          });
  
};

export default {
    listAllUsers,
    updateProfile,
};