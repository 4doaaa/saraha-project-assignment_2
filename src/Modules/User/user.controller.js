import { Router } from "express";
import userService from "./user.service.js";
import { authentication } from "../../Middlewars/auth.middleware.js";

const router = Router();

router.get("/", userService.listAllUsers);
router.patch("/update",authentication ,userService.updateProfile);

export default router;