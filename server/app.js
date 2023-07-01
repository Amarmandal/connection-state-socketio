const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { instrument } = require("@socket.io/admin-ui");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  connectionStateRecovery: {
    // the backup duration of the sessions and the packets
    maxDisconnectionDuration: 2 * 60 * 1000,
    // whether to skip middlewares upon successful recovery
    skipMiddlewares: true,
  },
  cors: {
    origin: ["https://admin.socket.io", "http://localhost:5173"],
    credentials: true,
  },
});

instrument(io, {
  auth: {
    type: "basic",
    username: "admin",
    password: "$2a$10$PvQ3BGpIev5vGKiGdDY.kOVpQYLzjbueKuGUMtGWkKiTz0dmvWMzG",
  },
  mode: "development",
});

io.on("connection", (socket) => {
  console.log("New connection", socket.id);

  if (socket.recovered) {
    console.log(`Recovered for the client ${socket.id} was successful....`);
  } else {
    // new or unrecoverable session
  }

  socket.on("message", (msg) => {
    socket.broadcast.emit("client:channel", msg);
  });

  socket.on("disconnect", (reason) => {
    console.log(reason);
  });
});

httpServer.listen(8000, () => {
  console.log("Server listening on port 8000");
});
