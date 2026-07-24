import { Socket, Server } from "socket.io"
import { IClientMessage, IUserJoinRoomSocket, IUserReadySocket, IUserRegisterSocket, IUsersOnline } from "../../interface/socket";
import userServices from "../services/user.services";
import messageServices from "../services/message.services";
import verifySocketToken from "../../middlewares/verifySocketToken";

const initSocketController = (io: Server) =>{
  let usersOnline:IUsersOnline[] = [];

  io.on("connection", (socket: Socket) => {

    socket.on("connect", ()=>{
    })
  
    socket.on("user:register", ({userId, token}: IUserRegisterSocket)=>{
      const decoded = verifySocketToken(token);
      if (!decoded) return;

      userServices(io, socket).registerUser(usersOnline, {userId: decoded.id, token});
    })

    socket.on("user:ready", async ({userId, activeRooms, token}: IUserReadySocket)=>{
      const decoded = verifySocketToken(token);
      if (!decoded) return;

      userServices(io, socket).userListReady(usersOnline, {userId: decoded.id, activeRooms, token});
    })
  
    socket.on("disconnect", async () => {
      const users = await userServices(io, socket).disconnect(usersOnline);
      if(users) usersOnline = users;
    });
  
    socket.on("message:send", async ({message, user, roomId}: IClientMessage) => {
      const decoded = verifySocketToken(user.token);
      if (!decoded) return;

      messageServices(io, socket).sendMessage(usersOnline, {
        message,
        user: { ...user, id: decoded.id },
        roomId
      })
    });
  
    socket.on('user:joinRoom', ({room, token}: IUserJoinRoomSocket)=>{
      const decoded = verifySocketToken(token);
      if (!decoded) return;

      socket.join(room);
    })
  });

}

export default initSocketController;
