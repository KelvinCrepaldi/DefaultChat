import { Router } from "express";
import {
  blockUserController,
  getUserController,
  searchUserController,
  updateAvatarColorController,
  uploadUserImageController,
} from "../controllers/user.controllers";
import verifyAuthTokenMiddleware from "../middlewares/verifyAuthToken.middleware";
import upload from "../multer-config";

const userRoutes = Router();

userRoutes.get("/search", verifyAuthTokenMiddleware, searchUserController);

userRoutes.patch(
  "/avatar-color",
  verifyAuthTokenMiddleware,
  updateAvatarColorController
);

userRoutes.get("/:id", getUserController);

userRoutes.get("/:id/block", verifyAuthTokenMiddleware, blockUserController);

userRoutes.post(
  "/img/upload",
  upload.single("image"),
  verifyAuthTokenMiddleware,
  uploadUserImageController
);

export default userRoutes;
