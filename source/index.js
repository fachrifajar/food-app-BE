require('dotenv').config()
const middleware = require('./middleware/log')
const helmet = require('helmet')
const xss = require('xss-clean')
const cors = require('cors')
const PORT = process.env.PORT || 4999
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

//koneksi body-parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//koneksi cors
app.use(cors())

// koneksi middleware
app.use(middleware.logRequest)
app.use(express.json()) // body-parser, menggunakan middleware

// koneksi helmet
app.use(helmet())

// koneksi xss
app.use(xss())

// koneksi routes
const usersRoutes = require('./routes/users')
app.use('/users', usersRoutes)
app.use('/users/recipes', require('./routes/recipes'))

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Food Recipe Website',
  })
})

app.use(middleware.urlValidator)

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})
