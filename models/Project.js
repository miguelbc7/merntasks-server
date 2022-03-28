const { Schema, model } = require("mongoose");

const ProjectSchema = Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = model("Project", ProjectSchema);
