import { Router } from "express";
import { blockUserController, getUserController, searchUserController, uploadUserImageController } from "../controllers/user.controllers";
import verifyAuthTokenMiddleware from "../middlewares/verifyAuthToken.middleware";
import upload from "../multer-config";

const userRoutes = Router();

//find user
userRoutes.get('/search', verifyAuthTokenMiddleware, searchUserController);

//get user 
userRoutes.get('/:id', getUserController)

//block user 
userRoutes.get('/:id/block', verifyAuthTokenMiddleware,blockUserController)

//change user image
userRoutes.post('/img/upload', upload.single('image'), verifyAuthTokenMiddleware, uploadUserImageController)

export default userRoutes;
