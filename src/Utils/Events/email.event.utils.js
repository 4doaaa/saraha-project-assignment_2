import { EventEmitter } from "node:events";
import { sendEmail, emailSubject } from "../Emails/email.utils.js";

export const emailEvents = new EventEmitter();

// ==================== Confirm Email ====================
emailEvents.on("confirmEmail", async (data) => {
    try {
        await sendEmail({
            to: data.to,
            subject: emailSubject.confirmEmail,
            html: `
                <div style="font-family: Arial, sans-serif; text-align: center; padding: 30px; background:#f9f9f9; border-radius:10px;">
                    <h2>Hello ${data.firstName}!</h2>
                    <p>Your verification code is:</p>
                    <h1 style="font-size: 50px; letter-spacing: 12px; color: #e91e63; background:#fff; display:inline-block; padding:10px 20px; border-radius:8px; margin:20px;">
                        ${data.otp}
                    </h1>
                    <p>This code expires in <strong>10 minutes</strong>.</p>
                    <p>If you didn't request this, please ignore this email.</p>
                </div>
            `
        });
        console.log("Confirmation email sent successfully to:", data.to);
    } catch (err) {
        console.log("Error sending confirmation email:", err.message);
    }
});

// ==================== Forget Password ====================
emailEvents.on("forgetPassword", async (data) => {
    try {
        await sendEmail({
            to: data.to,
            subject: emailSubject.resetPassword,
            html: `
                <div style="font-family: Arial, sans-serif; text-align: center; padding: 30px; background:#f9f9f9; border-radius:10px;">
                    <h2>Hello ${data.firstName}</h2>
                    <p>Your password reset code:</p>
                    <h1 style="font-size: 50px; letter-spacing: 12px; color: #d32f2f; background:#fff; display:inline-block; padding:10px 20px; border-radius:8px; margin:20px;">
                        ${data.otp}
                    </h1>
                    <p>Valid for <strong>10 minutes only</strong>.</p>
                </div>
            `
        });
        console.log("Password reset email sent successfully to:", data.to);
    } catch (err) {
        console.log("Error sending password reset email:", err.message);
    }
});