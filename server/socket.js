import { Server } from "socket.io";
import express from "express";

export default function socket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected");

    const users = [];

    for (let [id, socket] of io.of("/").sockets) {
      users.push({
        userID: id,
      });
    }
    console.log;
    socket.emit("users", users);

    socket.broadcast.emit("user connected", {
      userID: socket.id,
    });

    socket.on("message", (message) => {
      io.emit("message", message);
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });

  return io;
}
