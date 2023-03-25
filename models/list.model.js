const mongoose = require('mongoose')

const { Schema } = mongoose

const listSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    name: {
        type: String,
        required: true,
    },
})

const List = mongoose.model('List', listSchema)

module.exports = List
