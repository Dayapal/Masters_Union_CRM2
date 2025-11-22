import http from "http";
import app from "./app.js";
import { Server } from "socket.io";

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Create socket.io server
export const io = new Server(server, {
  cors: {
    origin: "*",
  }
});

// When client connects
io.on("connection", (socket) => {
  console.log("⚡ User connected:", socket.id);

  // Join a room based on userId
  socket.on("join", (userId) => {
    socket.join(`user_${userId}`);
    console.log(`User joined room: user_${userId}`);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
