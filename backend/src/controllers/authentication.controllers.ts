import { Request, Response } from "express";
import { AppError, handleError } from "../errors/appErrors";
import signupService from "../services/authentication/signup.service";
import loginService from "../services/authentication/login.service";

const signupController = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const signup = await signupService({ name, email, password });

    return res.status(200).send(signup);
  } catch (error) {
    if (error instanceof AppError) {
      handleError(error, res);
    }
  }
};

const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const login = await loginService({ email, password });

    return res.status(200).send(login);
  } catch (error) {
    if (error instanceof AppError) {
      handleError(error, res);
    }
  }
};

export { signupController, loginController };
