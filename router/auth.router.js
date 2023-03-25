const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const List = require('../models/list.model');
const isAuthenticated = require('../middlewares/isAuthenticated');
const isListInDB = require('../middlewares/isListInDB');

// eslint-disable-next-line prettier/prettier
router.get('/verify', async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decodedToken = await jwt.verify(token, process.env.TOKEN_SECRET)
        res.status(200).json({ message: 'token valid', decodedToken })
    } catch (error) {
        next(error)
    }
})

router.post('/signup', async (req, res, next) => {
    try {
        if (!('email' in req.body && 'password' in req.body)) {
            return res
                .status(422)
                .json({ message: 'need 2 keys : email, password' })
        }
        const { email, password } = req.body
        const foundUser = await User.findOne({ email })
        if (foundUser) {
            return res.status(409).json({ message: 'email already used' })
        }
        const saltRounds = 10
        const hash = await bcrypt.hash(password, saltRounds)
        const ans = await User.create({ email, password: hash })
        res.status(201).json({
            message: 'user created',
            user: {
                id: ans._id,
                email,
            },
        })
    } catch (error) {
        next(error)
    }
})

router.post('/login', async (req, res, next) => {
    try {
        if (!('email' in req.body && 'password' in req.body)) {
            return res
                .status(422)
                .json({ message: 'need 2 keys : email, password' })
        }
        const { email, password } = req.body
        const foundUser = await User.findOne({ email })
        if (!foundUser) {
            return res.status(409).json({ message: 'wrong email or password' })
        }
        const isValid = await bcrypt.compare(password, foundUser.password)
        if (!isValid) {
            return res.status(409).json({ message: 'wrong email or password' })
        }
        const dataToSend = {
            userId: foundUser._id.toString(),
            token: jwt.sign(
                { userId: foundUser._id.toString(), email: foundUser.email },
                process.env.TOKEN_SECRET,
                {
                    expiresIn: '10h',
                }
            ),
        }
        res.status(200).json(dataToSend)
    } catch (error) {
        next(error)
    }
})

router.post('/list',isAuthenticated,isListInDB, async (req, res, next) => {
    try {  
        const { name } = req.body
        console.log('req.user ===> ',req.user)
        
        const {userId} = req.user;
        if (!name) {
            return res
                .status(400)
                .json({ message: 'You have to enter the name of your list' })
        }
        const createList = await List.create({ userId, name })
        console.log('lisst ====> ', createList)
        if (createList) {
            res.status(201).json({
                message: 'List created',
                list: { createList },
            })
        }
    } catch (error) {
        next(error)
    }
})

module.exports = router
