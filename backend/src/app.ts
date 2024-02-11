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

const app = express();
const server = createServer(app);
const corsOptions = { 
  origin: '*', 
  methods: '*',
  allowedHeaders: '*',
}
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
app.use(errorsMiddleware);

interface IUsersOnline {
  socketId: string,
  userEmail:string
}

let usersOnline:IUsersOnline[] = [];

io.on("connection", (socket) => {
  let roomId = ''

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
  socket.on("userListReady", async ({userEmail})=>{
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
    } catch (error) {
      console.log(error)
    }
  })

  socket.on("disconnect", async () => {
    roomId = '';
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
      console.log("Cliente desconectado");
    }
  });

  socket.on("send_message", ({message, user, roomId}: IClientMessage) => {
    console.log({message, user, roomId})
    const createdAt = Date.now();
    io.to(roomId).emit("send_message", {message, user, roomId, createdAt})
  });

  socket.on('join_room', ({room})=>{
    for (let room in socket.rooms) {
      if (room !== socket.id) {
          socket.leave(room);
      }
    }

    socket.leave(roomId)
    roomId = room;
    socket.join(roomId);
  })
});

server.listen(port, () => {
  console.log(`App running on port: ${port}`);
});
