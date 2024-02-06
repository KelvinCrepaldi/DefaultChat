import { Request, Response } from "express";
import { AppError, handleError } from "../errors/appErrors";
import privateRoomService from "../services/rooms/privateRoom.service";
import { Room } from "../entities/rooms.entity";
import listActiveRoomsService from "../services/rooms/listActiveRooms.service";
import closeChatService from "../services/rooms/closeChat.service";

const privateRoomController = async (req: Request, res: Response) => {
  try {
      const userId = req.user.id
      const friendId = req.query.id as string;

      const friends = await privateRoomService({friendId, userId});
      return res.status(200).send(friends);
  } catch (error) {
     if (error instanceof AppError) {
        handleError(error, res);
     }
  }
};

const listActiveRoomsController = async (req: Request, res: Response) => {
   try {
       const userId = req.user.id
 
       const rooms = await listActiveRoomsService({userId});
       
       return res.status(200).send(rooms);
   } catch (error) {
      if (error instanceof AppError) {
         handleError(error, res);
      }
   }
};

const closeChatController = async (req: Request, res: Response) => {
   try {
       const id = req.params.id
       const closeRoom = await closeChatService({id});
      
       return res.status(200).send(closeRoom);
   } catch (error) {
      if (error instanceof AppError) {
         handleError(error, res);
      }
   }
};



export {privateRoomController, listActiveRoomsController, closeChatController}