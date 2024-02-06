import { Request, Response } from "express";
import { AppError, handleError } from "../errors/appErrors";

import getUserService from "../services/user/getUser.service";
import blockUserService from "../services/user/blockUser.service";
import searchUserService from "../services/user/searchUser.service";
import inviteFriendService from "../services/user/inviteFriend.service";

const getUserController = async (req: Request, res: Response) => {
  try {
     const user = req.params.id;

     const getUser = await getUserService({ id: user });
     return res.status(200).send(getUser);
  } catch (error) {
     if (error instanceof AppError) {
        handleError(error, res);
     }
  }
};

const searchUserController = async (req: Request, res: Response) => {
   try {
      const letters = req.query.letters as string;
      const { id } = req.user;

      const users = await searchUserService({ letters, userId: id });
      return res.status(200).send(users);
   } catch (error) {
      if (error instanceof AppError) {
         handleError(error, res);
      }
   }
};

const blockUserController = async (req: Request, res: Response) => {
   try {
      const blockId = req.params.id;
      const userId = req.user.id
 
      const getUser = await blockUserService({ userId , blockId});
      return res.status(200).send(getUser);
   } catch (error) {
      if (error instanceof AppError) {
         handleError(error, res);
      }
   }
 };

export {getUserController, blockUserController, searchUserController};
