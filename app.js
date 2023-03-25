const express = require('express')
require('dotenv').config()
require('./db')
const authRouter = require('./router/auth.router')
// const listRouter = require('./router/list.router')

const { PORT } = process.env || 3000

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/auth', authRouter)
// app.use('/list', listRouter)

app.use((err, req, res) => {
    res.status(500).json({ status: 'error', message: err })
})
app.use((req, res) => {
    res.status(404).json({ message: 'not found : check the url !' })
})

app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`)
})
