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

const app = express();
const server = createServer(app);
const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  methods: ["GET", "POST", "PATCH", "DELETE"],
}
const io = new Server(server, {
  cors: corsOptions,
});


app.use(cors(corsOptions));
app.use(express.json());
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/friend", friendRoutes);
app.use("/api/room", roomRoutes)

app.use(errorsMiddleware);

const socketUsers = [];

io.on("connection", (socket) => {
  let roomId = ''
  console.log('client connected:', socket.id)
  socket.on('connect', ()=>{
  })

  socket.on("sendMessage", (message) => {
    console.log(`Mensagem recebida do cliente: ${message}`);
    io.emit("receivedMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });

  socket.on("send_message", ({message, user}: IClientMessage) => {
    const createdAt = Date.now();
    io.to(roomId).emit("send_message", {message, user, createdAt});
  });

  socket.on('join_room', ({room})=>{
    roomId = room;
    socket.join(roomId);
  })
});

server.listen(port, () => {
  console.log(`App running on port: ${port}`);
});
