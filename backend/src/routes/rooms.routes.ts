import { Router } from "express";
import verifyAuthTokenMiddleware from "../middlewares/verifyAuthToken.middleware";
import {
  closeChatController,
  createGroupController,
  getGroupController,
  joinGroupController,
  listActiveRoomsController,
  privateRoomController,
  searchGroupsController,
} from "../controllers/room.controllers";

const roomRoutes = Router();

roomRoutes.get('/list', verifyAuthTokenMiddleware, listActiveRoomsController)

roomRoutes.get('/user', verifyAuthTokenMiddleware, privateRoomController)

roomRoutes.post('/group', verifyAuthTokenMiddleware, createGroupController)
roomRoutes.get('/group/search', verifyAuthTokenMiddleware, searchGroupsController)
roomRoutes.post('/group/:roomId/join', verifyAuthTokenMiddleware, joinGroupController)
roomRoutes.get('/group/:roomId', verifyAuthTokenMiddleware, getGroupController)

roomRoutes.post('/:roomId/close', verifyAuthTokenMiddleware, closeChatController)

export default roomRoutes;
