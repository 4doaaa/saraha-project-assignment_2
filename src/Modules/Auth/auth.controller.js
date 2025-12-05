import { Router } from "express";
import * as authService from "./auth.service.js";
import { authentication } from "../../Middlewares/auth.middleware.js";  
import { Validation } from "../../Middlewares/validation.middleware.js"; 
import { signupSchema, loginSchema, confirmEmailSchema ,resetPasswordSchema } from "./auth.validation.js";
import { forgetPasswordSchema } from "./auth.validation.js";



const router = Router();

// Sign up
router.post("/signup", Validation(signupSchema), authService.signup);

// Login
router.post("/login", Validation(loginSchema), authService.login);

// Confirm Email
router.patch("/confirm-email", Validation(confirmEmailSchema), authService.confirmEmail);

// Logout (revoke token)
router.post("/revoke-token", authentication, authService.logOut);

// Refresh Token
router.post("/refresh-token", authService.refreshToken);

//forget-password
router.post("/forget-password", Validation(forgetPasswordSchema), authService.forgetPassword);

//reset-password
router.patch("/reset-password",  Validation(resetPasswordSchema),authService.forgetPassword);

//social-login
router.post("/social-login",  //Validation(resetPasswordSchema),
authService.loginwithGoogle);

export default router;