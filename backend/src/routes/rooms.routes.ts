import { Router } from "express";
import verifyAuthTokenMiddleware from "../middlewares/verifyAuthToken.middleware";
import { closeChatController, listActiveRoomsController, privateRoomController } from "../controllers/room.controllers";

const roomRoutes = Router();


//list active rooms 
roomRoutes.get('/list', verifyAuthTokenMiddleware, listActiveRoomsController)

//private room [/room/user?id=]
roomRoutes.get('/user', verifyAuthTokenMiddleware, privateRoomController)

//group room [/room/group?id=]
roomRoutes.get('/room/group', verifyAuthTokenMiddleware)

//set room status to closed 
roomRoutes.post('/:roomId/close', verifyAuthTokenMiddleware, closeChatController)

//delete private room
roomRoutes.delete('/')

//fetchInfo private room
roomRoutes.get('/')

//invite to room



export default roomRoutes;