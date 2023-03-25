const mongoose = require('mongoose');

const {Schema} = mongoose;

const todoSchema = new Schema({
  description: {
    type: String,
    required: true
  },
  details: {
    type: String,
    default: ''
  },
  dueDate: {
    type: Date,
  },
  completed: {
    type: Boolean,
    default: false
  },
  list: {
    type: Schema.Types.ObjectId,
    ref: 'List'
  },
  createdDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Todo', todoSchema);

