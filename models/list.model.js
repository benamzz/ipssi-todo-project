const mongoose = require('mongoose')

const {Schema} = mongoose;

const listSchema = new Schema({
    userId:{
        type:Number,
        required:true,
        unique:true
    },
    name:{
        type:String,
        required:true
    }
})

const List = mongoose.model( 'List', listSchema)

module.exports= List;