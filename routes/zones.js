const router = require("express").Router();
const Zone = require("../model/zone");
const auth = require("../middleware/auth");

router.get("/", (req, res) => {
  Zone.find()
    .then((zones) => res.json(zones))
    .catch((err) => res.status(400).json(err));
});

router.get("/zones", (req, res) => {
  res.json(zones);
});

router.get("/:id", (req, res) => {
  Zone.findById(req.params.id)
    .then((zone) => res.json(zone))
    .catch((err) => res.json(err));
});

router.post("/", auth, (req, res) => {
  const newZone = new Zone({
    name: req.body.name,
    createdBy: req.body.createdBy,
  });

  newZone
    .save()
    .then((zones) => res.json("New Zone Added"))
    .catch((err) => res.status(400).json(err));
});

router.delete("/:id", auth, (req, res) => {
  Zone.findByIdAndDelete(req.params.id)
    .then(() => res.json("Zone Deleted"))
    .catch((err) => res.status(400).json(err));
});

router.put("/:id", auth, (req, res) => {
  Zone.findByIdAndUpdate(req.params.id, { $set: req.body })
    .then(() => res.json("Zone Updated"))
    .catch((err) => res.status(400).json(err));
});

module.exports = router;
