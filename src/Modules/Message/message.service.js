import * as dbService from "../../DB/dbService.js"
import UserModel from "../../DB/Models/user.model.js"
import messageModel from "../../DB/Models/message.model.js";
import { successResponse } from "../../Utils/successResponse.utils.js";
export  const sendMessage= async(req, res, next) => {
    const {content} = req.body;
    const { receiverId } = req.params;

    const user = await dbService.findById({
       model: UserModel,
       id: receiverId,
    });
const receiver = await UserModel.findById(receiverId);    
    if (!receiver) {
   
    throw new Error("Receiver Not Found"); 
} const message = await dbService.create({
        model:messageModel,
        data:[{
            content,
            receiverId: user._id,

        },
    ],
    });
      return successResponse({res ,
             statuscode:201,
             message:"Message sent Successfuly",
              data: {message}
            });
};

export  const getMessages= async(req, res, next) => {

    const messages = await dbService.find({
       model: messageModel,
     populate: [{path:"receiverId", select:'firstName lastName email gender -_id'}

     ],
    });

      return successResponse({
           res ,
             statuscode:200,
             message:"Message fetched Successfuly",
              data: {messages}
            });
        };