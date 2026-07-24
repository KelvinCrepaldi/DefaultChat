import { AppError, handleError } from "../errors/appErrors";
import { Request, Response } from "express";
import setMessagesAsViewedService from "../services/messageNotification/setMessagesAsViewed.service";

const setMessagesAsViewedController =  async (req: Request, res: Response) => {
  try {
      const userId = req.user.id
      const roomId = req.params.roomId as string;

      const friends = await setMessagesAsViewedService({userId, roomId});
      return res.status(200).send(friends);
  } catch (error) {
     if (error instanceof AppError) {
        handleError(error, res);
     }
  }
};

export {setMessagesAsViewedController}