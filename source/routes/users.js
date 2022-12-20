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
  redisMiddleware.useRedis,
  usersController.getReqAccountByID
)

router.get(
  '/name/:username',
  authMiddleware.validateToken,
  redisMiddleware.useRedis,
  usersController.getReqUsersByName
)

router.get(
  '/email/:email',
  authMiddleware.validateToken,
  redisMiddleware.useRedis,
  usersController.getReqUsersByEmail
)

// UPDATE //tambahkan bcrypt pada patch
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

// LOGIN //!@ belum

module.exports = router
