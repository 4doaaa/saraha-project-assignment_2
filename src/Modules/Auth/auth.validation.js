import Joi from 'joi';
import { generalFields } from '../../Middlewares/validation.middleware.js';
import { genderEnum } from "../../DB/Models/user.model.js";

// ==================== Joi Schema  ====================

export const signupSchema = {
    body: Joi.object({
        email: generalFields.email,
        password: generalFields.password,

        confirmPassword: Joi.any()
            .valid(Joi.ref('password'))
            .required()
            .messages({
                'any.only': 'Confirm password does not match password',
                'any.required': 'Confirm password is required'
            }),

        gender: Joi.string()
            .valid(...Object.values(genderEnum))
            .default(genderEnum.MALE),

        phone: Joi.string()
            .pattern(/^01[0125][0-9]{8}$/)
            .required()
            .messages({
                'string.pattern.base': 'Phone must be a valid Egyptian mobile number'
            }),

        firstName: Joi.string().min(2).max(20).required(),
        lastName: Joi.string().min(2).max(20).required(),
    })
};


export const loginSchema = {
    body:Joi.object({
 
   email:generalFields.email.required(),
         password: generalFields.password.required(),
  
}),
};


export const confirmEmailSchema = {
    body: Joi.object({
        email: generalFields.email,                  
        otp: Joi.string()
          .trim()
          .replace(/\s+/g, '')
          .length(6)
          .required()
          .messages({
            'string.length': 'OTP must be exactly 6 characters',
            'any.required': 'OTP is required',
          }),
    })
};

export const forgetPasswordSchema = {
    body: Joi.object({
        email: generalFields.email.required(),                  
    }),
};

export const resetPasswordSchema = {
    body: Joi.object({
        email: generalFields.email.required(),    
        otp:generalFields.otp.required(),
        password: generalFields.password.required(),
        confirmPassword:generalFields.confirmPassword,            
    }),
};

