const express = require("express");
const db = require("./config/keys").mongoURI;
const app = express();
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

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is listening on https://localhost:${port}`);
});
