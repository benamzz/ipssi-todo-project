require('dotenv').config()
const jwt = require('jsonwebtoken')

const isAuthenticated = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const { userId, email } = jwt.verify(token, process.env.TOKEN_SECRET)
        req.user = {
            userId,
            email,
        }
        next()
    } catch (error) {
        next('=> token not valid')
    }
}

module.exports = isAuthenticated
