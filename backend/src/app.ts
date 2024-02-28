import "reflect-metadata";
import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

import errorsMiddleware from "./middlewares/errors.middleware";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import friendRoutes from "./routes/friends.routes";
import roomRoutes from "./routes/rooms.routes";
import { IClientMessage } from "./interface/socket";
import AppDataSource from "./data-source";
import { User } from "./entities/user.entity";
import { Relationship } from "./entities/relationship.entity";
import messageRoutes from "./routes/messages.routes";
import { Room } from "./entities/room.entity";
import { MessageNotification } from "./entities/messageNotification.entity";
import createMessageService from "./services/messages/createMessage.service";
import { Message } from "./entities/messages.enitity";
import notificationRoutes from "./routes/notifications.routes";

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: { 
    origin: '*', 
    methods: ['PUT', "GET"]
  },
});
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("<h1>Default chat app!</h1>");
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/friend", friendRoutes);
app.use("/api/room", roomRoutes)
app.use('/api/message', messageRoutes)
app.use("/api/notification", notificationRoutes)
app.use(errorsMiddleware);

interface IUsersOnline {
  socketId: string,
  userEmail:string
}

let usersOnline:IUsersOnline[] = [];

io.on("connection", (socket) => {

  socket.on('connect', ()=>{
  })

  socket.on('registerUser',async (data)=>{
    for (let room in socket.rooms) {
      if (room !== socket.id) {
          socket.leave(room);
      }
    }

    const alreadyRegistered = usersOnline.find((user) => user.userEmail === data.userEmail);
    if(!alreadyRegistered){
      usersOnline.push({
        socketId: socket.id,
        userEmail: data.userEmail
      })
    }
   
  }) 
  socket.on("userListReady", async ({userEmail, activeRooms})=>{
    try {
      const friends = await AppDataSource.getRepository(Relationship).find({
        where:{
          requester:{
            email: userEmail
          },
          type: "accepted"
        },
        relations: ['addressee', 'requester']
      })
    
      if (friends) {
        const onlineFriends = usersOnline.filter((user: IUsersOnline) =>
        friends.some((friend: Relationship) => friend.addressee.email === user.userEmail)
        );
        
        //Notifying friends that the user has come online
        onlineFriends.forEach((friend: IUsersOnline) => {
          io.to(friend.socketId).emit('friendIsOnline', { userEmail: userEmail });
        });
        
        //Returning to the user the friends who are online
        io.to(socket.id).emit('friendsOnline', onlineFriends);
      }

      activeRooms.forEach((room: any) =>{
        socket.join(room)
      })
    } catch (error) {
      console.log(error)
    }
  })

  socket.on("disconnect", async () => {
    const userEmail = usersOnline.find((user)=> user.socketId === socket.id)?.userEmail
    if(userEmail){
      const friends = await AppDataSource.getRepository(Relationship).find({
        where:{
          requester:{
            email: userEmail
          },
          type: "accepted"
        },
        relations: ['addressee', 'requester']
      })
   
      if (friends) {
        usersOnline = usersOnline.filter((user)=> user.socketId !== socket.id)
        const onlineFriends = usersOnline.filter((user: IUsersOnline) =>

        friends.some((friend: Relationship) => friend.addressee.email === user.userEmail)
        );
  
        onlineFriends.forEach((friend: IUsersOnline) => {
          io.to(friend.socketId).emit('friendIsOffline', { userEmail: userEmail });
        });
      }
      
      socket.disconnect();
    }
  });

  socket.on("send_message", async ({message, user, roomId}: IClientMessage) => {
    const dateNow = Date.now();
    const createdAt = new Date(dateNow)
    io.to(roomId).emit("send_message", {message, user, roomId, createdAt})

    try {
      const userRepository = AppDataSource.getRepository(User)
      const roomRepository = AppDataSource.getRepository(Room)

      const room = await roomRepository.findOne({where: {id: roomId}, relations: ['roomUsers', 'roomUsers.user'] })
      const messageNotificationRepository = AppDataSource.getRepository(MessageNotification)

      if(!room){
        console.log("Room not exists")
        throw new Error
      }

      //save message on database 
        const newMessage: Message = await createMessageService({message, roomId, userId: user.id})

      //create notification on database for offline users
        if(newMessage){
          const removeSender = room.roomUsers.filter((x) => x.user.id !== user.id  )
          removeSender.forEach(async (user)=>{
            const userIsOffline = usersOnline.some((userOnline)=>userOnline.userEmail === user.user.email)
            
            if(!userIsOffline){
              const userExists = await userRepository.findOne({where: {id: user.user.id}})
              if(userExists){
                const newNotification = new MessageNotification();
                newNotification.message = newMessage
                newNotification.user = userExists;
                newNotification.room = room;
                newNotification.viewed = false;
                await messageNotificationRepository.save(newNotification)
              }
            } 
          })
        }
    } catch (error) {
      console.log(error)
    }
  });

  socket.on('join_room', ({room})=>{
    socket.join(room);
  })
});

server.listen(port, () => {
  console.log(`App running on port: ${port}`);
});
