import { Request, Response } from "express";
import { AppError, handleError } from "../errors/appErrors";
import privateRoomService from "../services/rooms/privateRoom.service";
import listActiveRoomsService from "../services/rooms/listActiveRooms.service";
import closeChatService from "../services/rooms/closeChat.service";
import createGroupService from "../services/rooms/createGroup.service";
import searchGroupsService from "../services/rooms/searchGroups.service";
import listGroupsService from "../services/rooms/listGroups.service";
import joinGroupService from "../services/rooms/joinGroup.service";
import getGroupService from "../services/rooms/getGroup.service";

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
      const userId = req.user.id
      const roomId = req.params.roomId
      const closeRoom = await closeChatService({roomId, userId});
      
      return res.status(200).send(closeRoom);
   } catch (error) {
      if (error instanceof AppError) {
         handleError(error, res);
      }
   }
};

const createGroupController = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { name } = req.body;
    const group = await createGroupService({ userId, name });
    return res.status(201).send(group);
  } catch (error) {
    if (error instanceof AppError) {
      handleError(error, res);
    }
  }
};

const listGroupsController = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const groups = await listGroupsService({ userId });
    return res.status(200).send(groups);
  } catch (error) {
    if (error instanceof AppError) {
      handleError(error, res);
    }
  }
};

const searchGroupsController = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const letters = (req.query.letters as string) || "";
    const groups = await searchGroupsService({ userId, letters });
    return res.status(200).send(groups);
  } catch (error) {
    if (error instanceof AppError) {
      handleError(error, res);
    }
  }
};

const joinGroupController = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const roomId = req.params.roomId;
    const group = await joinGroupService({ userId, roomId });
    return res.status(200).send(group);
  } catch (error) {
    if (error instanceof AppError) {
      handleError(error, res);
    }
  }
};

const getGroupController = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const roomId = req.params.roomId;
    const group = await getGroupService({ userId, roomId });
    return res.status(200).send(group);
  } catch (error) {
    if (error instanceof AppError) {
      handleError(error, res);
    }
  }
};

export {
  privateRoomController,
  listActiveRoomsController,
  closeChatController,
  createGroupController,
  listGroupsController,
  searchGroupsController,
  joinGroupController,
  getGroupController,
};
