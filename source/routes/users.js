const express = require('express')
const router = express.Router()
const usersController = require('../controller/users')
const middleware = require('../middleware/users')

// CREATE
router.post(
  '/register',
  middleware.createUsersValidator,
  usersController.createUsers
)

// READ
router.get('/:id?', usersController.getReqAccountByID)

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

router.delete(
  '/delete/:id',
  middleware.deleteUsersValidator,
  usersController.deleteUsers
) // cek lagi ada yg kurang

// LOGIN //!@ belum

module.exports = router
