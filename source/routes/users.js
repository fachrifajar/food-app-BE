const express = require('express')
const router = express.Router()
const usersController = require('../controller/users')
const middleware = require('../middleware/users')
const authMiddleware = require('../middleware/auth')
const uploadMiddleware = require('../middleware/upload')
const redisMiddleware = require('../middleware/redis')

// CREATE
router.post(
  '/register',
  uploadMiddleware.fileExtLimiter([
    '.png',
    '.jpg',
    '.jpeg',
    '.PNG',
    '.JPG',
    '.JPEG',
  ]),
  uploadMiddleware.fileSizeLimiter,
  middleware.createUsersValidator,
  usersController.createUsers
)

// READ
router.get(
  '/:id?',
  authMiddleware.validateToken,
  redisMiddleware.getReqAccountByID_Redis,
  usersController.getReqAccountByID
)

router.get(
  '/name/:username',
  authMiddleware.validateToken,
  redisMiddleware.getReqUsersByName_Redis,
  usersController.getReqUsersByName
)

router.get(
  '/email/:email',
  authMiddleware.validateToken,
  redisMiddleware.getReqUsersByEmail_Redis,
  usersController.getReqUsersByEmail
)

// UPDATE
router.patch(
  '/edit/:id',
  authMiddleware.validateToken,
  uploadMiddleware.fileExtLimiter([
    '.png',
    '.jpg',
    '.jpeg',
    '.PNG',
    '.JPG',
    '.JPEG',
  ]),
  uploadMiddleware.fileSizeLimiter,
  middleware.updateUsersPartialValidator,
  usersController.updateUsersPartial
)

router.put('/edit/all/:id', usersController.updateUsers)

// DELETE

router.delete(
  '/delete/:id',
  authMiddleware.validateToken,
  middleware.deleteUsersValidator,
  usersController.deleteUsers
) // cek lagi ada yg kurang

module.exports = router
