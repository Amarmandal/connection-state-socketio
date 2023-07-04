const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { instrument } = require("@socket.io/admin-ui");
const { createClient } = require("redis");
const { createAdapter } = require("@socket.io/redis-adapter");

const app = express();
const httpServer = createServer(app);

// redis adapter configuratino
// const pubClient = createClient({
//   password: "8mFtq5qS3rnZEkVV8XZyHwRHcCAi6rSW",
//   socket: {
//     host: "redis-18005.c264.ap-south-1-1.ec2.cloud.redislabs.com",
//     port: 18005,
//   },
// });
const pubClient = createClient({
  socket: {
    host: "redis-srv",
    port: 6379,
  },
});
const subClient = pubClient.duplicate();

const io = new Server(httpServer, {
  connectionStateRecovery: {
    // the backup duration of the sessions and the packets
    maxDisconnectionDuration: 2 * 60 * 1000,
    // whether to skip middlewares upon successful recovery
    skipMiddlewares: true,
  },
  cors: {
    // origin: "*",
    origin: ["http://client-srv", "http://localhost:5173", "https://admin.socket.io"],
    credentials: true,
  },
});

Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
  io.adapter(createAdapter(pubClient, subClient));
  // io.listen(3000);
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
    console.log(`Disconnection: ${reason} with socket id: ${socket.id}`);
  });
});

httpServer.listen(8000, () => {
  console.log("Server listening on port 8000");
});
