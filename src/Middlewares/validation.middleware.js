import Joi from "joi";
import { genderEnum } from "../DB/Models/user.model.js";
import { Types } from "mongoose";


export const generalFields = {
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    id: Joi.string().custom((value, helper) => Types.ObjectId.isValid(value) || helper.message('Invalid id')).required(),
    otp: Joi.string().pattern(/^[a-zA-Z0-9]{6}$/).length(6), 
    confirmPassword: Joi.any()
        .valid(Joi.ref('password'))
        .required()
        .messages({ 'any.only': 'Confirm password does not match password' }),
};

export const Validation = (schema) => {
    return (req, res, next) => { 
        const validationError = [];
        
for (const key of Object.keys(schema)) {
  const JoiSchema = schema[key];
  const dataToValidate = req[key];
  const ValidationResults = schema[key].validate(req[key], {
                abortEarly: false,
            });
            if (ValidationResults.error) {
                validationError.push({ key, details: ValidationResults.error.details });
            }
        }

        if (validationError.length)
            return res.status(400).json({ message: "Validation Error", details: validationError });
            
        return next();

    };

};


export const signupSchema = {
    body: Joi.object({
        firstName: Joi.string().min(2).max(20).required().messages({
            "string.min": "First Name must be at least 2 characters long",
            "string.max": "First Name must be at most 20 characters long",
            "any.required": "First Name is required",
        }),
        lastName: Joi.string().min(2).max(20).required().messages({
            "string.min": "Last Name must be at least 2 characters long",
            "string.max": "Last Name must be at most 20 characters long",
            "any.required": "Last Name is required",
        }),
        email: Joi.string().email({
            minDomainSegments: 2,
            tlds: { allow: ["com", "net", "io", "org"] }
        }).required(),

        password: Joi.string().min(6).required(),

        confirmPassword: Joi.any().valid(Joi.ref("password")).required().messages({
            "any.only": "Confirm Password does not match Password",
            "any.required": "Confirm Password is required"
        }),

        gender: Joi.string().valid(...Object.values(genderEnum)).default(genderEnum.MALE),

        phone: Joi.string().pattern(/^01[0125][0-9]{8}$/).required(),

        otp: Joi.string(),

        id: Joi.string().custom((value, helper) => {
            return Types.ObjectId.isValid(value) || helper.message("Invalid ObjectId format");
        })
    })
};