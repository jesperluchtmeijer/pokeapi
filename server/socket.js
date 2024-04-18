import { Server } from "socket.io";
import express from "express";
import { v4 as uuidv4 } from "uuid";

export default function socket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  let chosenPokemon = {};

  io.on("connection", (socket) => {
    const users = [];
    console.log("A user connected");
    socket.join("lobby");

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

    socket.on("getMessage", (message) => {
      console.log("Message received on server: ", message);
      socket.rooms.forEach((room) => {
        socket.broadcast.to(room).emit("sendMessage", message);
      });
    });

    socket.on("sendInvite", (invite) => {
      console.log("Invite received on server: ", invite);
      socket.broadcast.to(invite.receiver).emit("receiveInvite", invite);
    });

    socket.on("acceptInvite", (invite) => {
      const socketSender = io.sockets.sockets.get(invite.receiver);
      const room = uuidv4();
      console.log("Invite accepted on server: ", invite);

      socketSender.leave("lobby");
      socket.leave("lobby");
      socketSender.join(room);
      socket.join(room);

      io.to(socketSender.id).emit("redirectInvite", room);
      console.log("Sender: ", invite.sender);
      io.to(socket.id).emit("redirectInvite", room);
    });

    socket.on("declineInvite", (invite) => {
      console.log("Invite declined on server: ", invite);
      socket.broadcast.to(invite.sender).emit("inviteDeclined", invite);
    });

    socket.on("chosePokemon", (pokemonData) => {
      const { pokemon, user } = pokemonData;
      chosenPokemon[user] = pokemon;

      if (Object.keys(chosenPokemon).length === 2) {
        const choices = Object.values(chosenPokemon);
        const winnerIndex = Math.floor(Math.random() * 2);
        const winner = Object.keys(chosenPokemon)[winnerIndex];

        io.to(Object.keys(chosenPokemon)[0]).emit("battleResult", {
          winner: winner === Object.keys(chosenPokemon)[0],
          opponent: Object.keys(chosenPokemon)[1],
        });

        io.to(Object.keys(chosenPokemon)[1]).emit("battleResult", {
          winner: winner === Object.keys(chosenPokemon)[1],
          opponent: Object.keys(chosenPokemon)[0],
        });

        console.log("Chosen pokemon: ", chosenPokemon);

        chosenPokemon = {};
      }
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });

  return io;
}
