const express = require('express')
const router = express.Router()
const authController = require('../controller/auth')
const middleware = require('../middleware/auth')
const jwt = require('jsonwebtoken')

router.post('/login', middleware.loginValidator, authController.login)
router.get('/token', authController.refreshToken)

module.exports = router
