const express = require('express')
const router = express.Router()
const usersController = require('../controller/users')
const middleware = require('../middleware/users')
const middlewareUpload = require('../middleware/upload')

// CREATE
router.post(
  '/register',
  // middlewareUpload.filesPayLoadExist, //jangan di aktifkan
  middlewareUpload.fileExtLimiter([
    '.png',
    '.jpg',
    '.jpeg',
    '.PNG',
    '.JPG',
    '.JPEG',
  ]),
  middlewareUpload.fileSizeLimiter,
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
  // middlewareUpload.filesPayLoadExist, //jangan di aktifkan
  middlewareUpload.fileExtLimiter([
    '.png',
    '.jpg',
    '.jpeg',
    '.PNG',
    '.JPG',
    '.JPEG',
  ]),
  middlewareUpload.fileSizeLimiter,
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
