

import nodemailer from "nodemailer";

export async function sendEmail({
  to = "", 
   text="",
   html="",
   subject = "",
  attachments = [],
    cc,
    bcc,
  }){
    // Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({ service:"gmail",//or outlook
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

  const info = await transporter.sendMail({
    from: `"sarahaapp@gmail.com " <${process.env.EMAIL}>`,
    to,
    attachments,
    subject,
    text, // plain‑text body
    html, // HTML body
    cc,
    bcc,
  });

  console.log("Message sent:", info.messageId);
};

export const emailSubject = {
  confirmEmail: "Confirm Your Email",
  resetPassword: "Reset you password",
welcome: "welcome to sarahaaaa"
}