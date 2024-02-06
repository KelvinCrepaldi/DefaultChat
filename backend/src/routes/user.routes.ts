import { Router } from "express";
import { blockUserController, getUserController, searchUserController } from "../controllers/user.controllers";
import verifyAuthTokenMiddleware from "../middlewares/verifyAuthToken.middleware";

const userRoutes = Router();



//find user
userRoutes.get('/search', verifyAuthTokenMiddleware, searchUserController);

//get user 
userRoutes.get('/:id', getUserController)

//block user 
userRoutes.get('/:id/block', verifyAuthTokenMiddleware,blockUserController)

export default userRoutes;
