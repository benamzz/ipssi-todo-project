// const router = require('express').Router();
// // const isListInDB = require('../middlewares/isListInDB')
// // const isAuthenticated = require('../middlewares/isAuthenticated')
// const List = require('../models/list.model');

// router.post('/', async (req, res, next) => {
//     const {name} = req.body
//     try {
//         if (!name) {
//             return res
//                 .status(400)
//                 .json({ message: 'You have to enter the name of your list' })
//         }
//         const createList = await List.create({ name })
//         console.log(createList)
//         if (createList) {
//             res.status(201).json({
//                 message: 'List created',
//                 list: { name },
//             })
//         }
//     } catch (error) {
//         next(error)
//     }
// })