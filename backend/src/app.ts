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

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/user/friend", friendRoutes);

app.use(errorsMiddleware);

const socketUsers = [];

io.on("connection", (socket) => {
  socket.id;

  io.on("connect", (user) => {
    socketUsers.push({ user, id: socket.id });
  });

  // Evento para receber mensagens do cliente
  socket.on("sendMessage", (message) => {
    console.log(`Mensagem recebida do cliente: ${message}`);

    // Enviar a mensagem de volta para todos os clientes conectados
    io.emit("receivedMessage", message);
  });

  // Evento para lidar com a desconexão do cliente
  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });

  socket.on("send_message", (message) => {
    socket.emit("receive_message", message);
  });
});

server.listen(port, () => {
  console.log(`App running on port: ${port}`);
});
