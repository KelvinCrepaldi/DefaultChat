import { Router } from "express";
import verifyAuthTokenMiddleware from "../middlewares/verifyAuthToken.middleware";
import { createMessageController, listMessageController } from "../controllers/messages.controllers";

const messageRoutes = Router();

messageRoutes.post('/:roomId', verifyAuthTokenMiddleware, createMessageController)
messageRoutes.get('/:roomId', verifyAuthTokenMiddleware, listMessageController)

export default messageRoutes;