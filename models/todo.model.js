const mongoose = require('mongoose')

const { Schema } = mongoose

const todoSchema = new Schema({
    listId: {
        type: mongoose.Schema.Types.ObjectId,
        unique: true,
        ref: 'List',
    },
    name: {
        type: String,
        required: true,
    },
    ShortContent: {
        type: String,
        required: true,
        maxLength: 50,
    },
    LongContent: {
        type: String,
        required: true,
        minLength: 50,
    },
})

const Todo = mongoose.model('Todo', todoSchema)

module.exports = Todo
