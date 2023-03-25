require('dotenv').config()

const List = require('../models/list.model')

const isListInDB = async (req, res, next) => {
    try {
        const {name} = req.body
        const foundList = await List.findOne({name})
        if(foundList && foundList.userId===req.user.userId){
            res.status(400).json({message : 'this list were already created', foundList})
        }
    } catch (error) {
        next(error)
    }
}

module.exports = isListInDB