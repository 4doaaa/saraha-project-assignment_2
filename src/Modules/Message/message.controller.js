import { Router } from "express";
import * as messageService from "./message.service.js"
import {sendMessageSchema} from "./message.validation.js";

import { Validation } from "../../Middlewares/validation.middleware.js";
const router = Router();

router.post('/send-message/:receiverId',Validation(sendMessageSchema), messageService.sendMessage);
router.get('/get-message', messageService.getMessages);

export default router;

