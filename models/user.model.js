const mongoose = require('mongoose')
require('dotenv').config()
const { Schema } = mongoose

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
})

const User = mongoose.model('User', userSchema)

module.exports = User
