

import * as dbService from  "../DB/dbService.js" 
import TokenModel from "../DB/Models/token.model.js";
import UserModel from "../DB/Models/user.model.js";

import { verifyToken } from "../Utils/tokens/token.utils.js";

export const authentication = async (req , res , next) =>{
    const {authorization} = req.headers;
  
    if (!authorization) {
            return next(new Error("Authorization token is missing", { cause: 400 }));
        }
 
 if (!authorization.startsWith(process.env.TOKEN_PREFIX)) {
            return next(new Error("Invalid Authorization Format ", { cause: 400 }));
        }
const token = authorization.split(" ")[1];
    const decoded = verifyToken({
        token: token, 
        secretkey: process.env.TOKEN_ACCESS_SECRET
    });


if (!decoded?.id || !decoded?.jti) {
return next(new Error("Invalid token: missing id or jti", { cause: 401 }));        }
           const revokedToken = await dbService.findOne({
            model:TokenModel,
           filter:{jwtid:decoded.jti},
           });
           if (revokedToken)
                return next(new Error(" token is revoked", {cause:401}));

           //find user
           const user = await dbService.findById({
            model: UserModel,
            id: decoded.id       
        });
         if (!user)          
           return next(new Error(" user not found", {cause:404}));     
       
       req.user = user;
req.decoded = decoded;
         next();
};