const express = require("express");
const db = require("./config/keys").mongoURI;
const app = express();
const zones = require("./data/zones");
const mongoose = require("mongoose");

app.use(express.json());

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Mongos a gogo"));

app.get("/", (req, res) => {
  res.send("Hello word");
});

app.get("/zones", (req, res) => {
  res.json(zones);
});

app.get("/zones/:id", (req, res) => {
  const zone = zones.find((z) => z._id === req.params.id);
  res.json(zone);
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is listening on https://localhost:${port}`);
});
