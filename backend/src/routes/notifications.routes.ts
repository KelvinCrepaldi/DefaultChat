import { Router } from "express";
import verifyAuthTokenMiddleware from "../middlewares/verifyAuthToken.middleware";
import { setMessagesAsViewedController } from "../controllers/notifications.controller";

const notificationRoutes = Router();

notificationRoutes.post("/:roomId", verifyAuthTokenMiddleware ,setMessagesAsViewedController)

export default notificationRoutes;