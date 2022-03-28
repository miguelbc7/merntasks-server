const { Schema, model } = require("mongoose");

const TaskSchema = Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: Boolean,
    default: false
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: "Project",
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = model("Task", TaskSchema);
