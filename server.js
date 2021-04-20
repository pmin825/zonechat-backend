const express = require("express");
const db = require("./config/keys").mongoURI;
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
// const zones = require("./data/zones");
const mongoose = require("mongoose");
const zonesRouter = require("./routes/zones");
const usersRouter = require("./routes/users");
require("dotenv").config();

app.use(express.json());

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Mongos a gogo"));

app.use("/api/zones", zonesRouter);
app.use("/api/users", usersRouter);

let users = {};
io.on("connect", (socket) => {
  console.log("hello from the server. Socket ID: " + socket.id);
  socket.on("userJoin", (username) => {
    users[socket.id] = username;
    socket.join(username);
    socket.join("General Lobby");
    console.log("User Object after connection: ", users);
    io.emit("userList", [...new Set(Object.values(users))]);
  });

  socket.on("newMessage", (newMessage) => {
    io.to(newMessage.zone).emit("newMessage", {
      name: newMessage.name,
      msg: newMessage.msg,
      isPrivate: newMessage.isPrivate,
    });
  });

  socket.on("zoneJoined", ({ oldZone, newZone }) => {
    socket.leave(oldZone);
    io.to(oldZone).emit("newMessage", {
      name: socket.id,
      msg: `${users[socket.id]} just left "${oldZone}"`,
    });
    io.to(newZone).emit("newMessage", {
      name: socket.id,
      msg: `${users[socket.id]} just joined the Chat...`,
    });
    socket.join(newZone);
  });

  socket.on("disconnect", () => {
    delete users[socket.id];
    io.emit("userList", [...new Set(Object.values(users))]);
    console.log("Users after disconnection:  ", users);
  });
});

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server is listening on https://localhost:${port}`);
});
