const router = require("express").Router();
const User = require("../model/user");
const bcrypt = require("bcryptjs");
const { response } = require("express");

router.get("/register", (req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json(err));
});

router.post("/register", async (req, res) => {
  if (!req.body.name || !req.body.password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }
  if (req.body.name.length > 15) {
    return res.status(400).json({ msg: "Max character length is 15" });
  }
  const user = await User.findOne({ name: req.body.name });
  if (user) {
    return res.status(400).json({ msg: "Username is already taken" });
  }

  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(req.body.password, salt, function (err, hash) {
      // Store hash in your password DB.
      const newUser = new User({
        name: req.body.name,
        password: hash,
      });

      newUser
        .save()
        .then((user) => res.json("New User Added"))
        .catch((err) => res.status(400).json(err));
    });
  });
});

router.delete("/:id", (req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then(() => res.json("User Deleted"))
    .catch((err) => res.status(400).json(err));
});

router.get("/login", (req, res) => {
  res.send("GET Login");
});

router.post("/login", async (req, res) => {
  if (!req.body.name || !req.body.password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }
  const user = await User.findOne({ name: req.body.name });
  if (!user) {
    return res.status(400).json({ msg: "User does not exist" });
  }
  bcrypt.compare(req.body.password, user.password, function (err, result) {
    if (!result) {
      return res.status(400).send({ msg: "Invalid Credentials" });
    } else {
      res.send("Authentication Successful");
    }
  });
});

module.exports = router;
