const mongoose = require("mongoose");

const zoneSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 30
  },
  createdBy: {
    type: String,
    default: "unknown"
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Zone", zoneSchema);
