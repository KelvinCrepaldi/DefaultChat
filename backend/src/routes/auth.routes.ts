import { Router } from "express";
import {
  loginController,
  signupController,
} from "../controllers/authentication.controllers";

const authRoutes = Router();

//signup
authRoutes.post("/signup", signupController);

//login
authRoutes.post("/login", loginController);

//update

export default authRoutes;
