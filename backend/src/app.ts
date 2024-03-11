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
import { UserRoom } from "./entities/userRoom.entity";
import initSocketController from "./socket/controller/initSocket.controller";

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

initSocketController(io);

server.listen(port, () => {
  console.log(`App running on port: ${port}`);
});
