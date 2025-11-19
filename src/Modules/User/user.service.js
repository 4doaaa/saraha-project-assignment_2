import * as dbService from "../../DB/dbService.js";
import UserModel from "../../DB/Models/user.model.js";
import { asymmetricDecript, decrypt } from "../../Utils/Encryption/encryption.utils.js";
import { successResponse } from "../../Utils/successResponse.utils.js";
export const listAllUsers = async (req, res, next ) =>{
    let users = await dbService.find({
        model: UserModel,
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