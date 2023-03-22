require('dotenv').config()
const express = require('express')
const app = express()
require('dotenv').config()
require('./db')
const {PORT}=process.env || 3000

const User = require('./models/user.model')
const List = require('./models/list.model')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.post('/users', async (req, res, next) => {
    const {email, password} = req.body
    try {
        await User.create({email, password})
        console.log(`email => ${email}, password => ${password}`)
        res.status(201).json({message:'user created', user:{email,password}})
    } catch (error) {
        next(error)
    }
    
})
app.use((err, req, res, next) => {
    res.status(500).json({ status: 'error', message: err })
})
app.use((req, res) => {
    res.status(404).json({ message: 'not found : check the url !' })
})

app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`);
  });
