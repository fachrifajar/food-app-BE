const express = require('express')
const router = express.Router()
const usersController = require('../controller/users')
const middleware = require('../middleware/log')

// CREATE
router.post(
  '/register',
  middleware.createUsersValidator,
  usersController.createUsers
)

// READ
router.get('/:id?', usersController.getReqAccountByID) // dijalankan dari /controller/users.js

router.get('/name/:username', usersController.getReqUsersByName)

router.get('/email/:email', usersController.getReqUsersByEmail)

// UPDATE
router.patch(
  '/edit/:id',
  middleware.updateUsersPartialValidator,
  usersController.updateUsersPartial
)

router.put('/edit/all/:id', usersController.updateUsers)

// DELETE

router.delete('/delete/:id', usersController.deleteUsers) // cek lagi ada yg kurang

// LOGIN //!@ belum

module.exports = router // koneksi file 'users.js' ke file utama
