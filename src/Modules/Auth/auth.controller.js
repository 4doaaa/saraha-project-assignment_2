import { Router } from "express";
import * as authService from "./auth.service.js";
import { authentication } from "../../Middlewars/auth.middleware.js";
const router = Router();

router.post("/signup", authService.signup);
router.post("/login", authService.login);
router.patch("/confirm-email", authService.confirmEmail);
router.post("/revoke-token",authentication, authService.logOut);
router.post("/refresh-token", authService.refreshToken);

export default router;

