const dotenv = require('dotenv').config({ path: './config.env' })
const express = require('express')
const morgan = require('morgan')

const app = express()

//middlewares

app.use(express.json())
app.use(morgan('dev'))

//test url
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Hello there! 😊'
    })
})

module.exports = app