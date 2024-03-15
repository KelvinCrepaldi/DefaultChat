import { Socket, Server } from "socket.io"
import { IClientMessage, IUsersOnline } from "../../interface/socket";
import userServices from "../services/user.services";
import messageServices from "../services/message.services";

const initSocketController = (io: Server) =>{
  let usersOnline:IUsersOnline[] = [];

  io.on("connection", (socket: Socket) => {

    socket.on("connect", ()=>{
    })
  
    socket.on("registerUser", (data)=>{
      userServices(io, socket).registerUser(usersOnline, data);
    })

    socket.on("userListReady", async ({userEmail, activeRooms})=>{
      userServices(io, socket).userListReady(usersOnline, {userEmail, activeRooms});
    })
  
    socket.on("disconnect", async () => {
      const users = await userServices(io, socket).disconnect(usersOnline);

      if(users) usersOnline = users;
    });
  
    socket.on("message:send", async ({message, user, roomId}: IClientMessage) => {
      messageServices(io, socket).sendMessage(usersOnline, {message, user, roomId})
    });
  
    socket.on('join_room', ({room})=>{
      socket.join(room);
    })
  });

}

export default initSocketController;