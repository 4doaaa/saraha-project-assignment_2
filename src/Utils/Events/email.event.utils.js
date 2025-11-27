import { EventEmitter } from "node:events";
import { sendEmail, emailSubject } from "../Emails/email.utils.js";

export const emailEvents = new EventEmitter();

emailEvents.on("confirmEmail", async(data)=>{
    //send email-----> confirm email before login 
    await sendEmail ({
      to:data.to ,
       subject:emailSubject.confirmEmail ,
       html:template(data.otp , data.firstName),
      }).catch((err)=>{
        console.log(`Error in Sending Confirmation Email: ${err}`);
        
      });
});
