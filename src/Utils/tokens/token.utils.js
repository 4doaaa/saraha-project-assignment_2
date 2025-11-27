import jwt from "jsonwebtoken";



export const generateToken = ({payload , 
    secretkey=process.env.TOKEN_ACCESS_SECRET
     , options = {exipiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN} ,
    }) =>{
    return jwt.sign(payload , secretkey , options );
};

export const verifyToken = ({token , secretkey=process.env.TOKEN_ACCESS_SECRET,
    
 }) =>{
    return jwt.verify(token , secretkey );
};