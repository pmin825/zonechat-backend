const express = require("express");
const db = require("./config/keys").mongoURI;
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const zones = require("./data/zones");
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

let users = [];
io.on("connect", (socket) => {
  console.log("hello from the server. Socket ID: " + socket.id);
  users.push(socket.id);
  io.emit("userList", users);
  socket.join("General Lobby");
  console.log("Users after connection: ", users);

  socket.on("updateUsers", () => {
    io.emit("userList", users);
  });

  socket.on("newMessage", (newMessage) => {
    io.to(newMessage.zone).emit("newMessage", {
      name: newMessage.name,
      msg: newMessage.msg,
    });
  });

  socket.on("zoneJoined", ({ zone }) => {
    io.to(zone).emit("newMessage", {
      name: socket.id,
      msg: `${socket.id} just joined the Chat...`,
    });
    socket.join(zone);
  });

  socket.on("disconnect", () => {
    users = users.filter((user) => user !== socket.id);
    io.emit("userList", users);
    console.log("Users after disconnection:  ", users);
  });
});

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server is listening on https://localhost:${port}`);
});
