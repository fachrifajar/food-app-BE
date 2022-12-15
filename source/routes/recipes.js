const express = require('express')
const router = express.Router()
const recipesController = require('../controller/recipes')
const middleware = require('../middleware/recipes')
const middlewareUpload = require('../middleware/upload')

// CREATE
router.post(
  '/add',
  middleware.createRecipesValidator,
  recipesController.addRecipes
)

router.post(
  '/add/videos',
  middlewareUpload.filesPayLoadExist,
  middlewareUpload.fileExtLimiter([
    '.mp4',
    '.mov',
    '.wmv',
    '.avi',
    '.avichd',
    '.flv',
    '.mkv',
    'html5',
    '.MP4',
    '.MOV',
    '.WMV',
    '.AVI',
    '.AVICHD',
    '.FLV',
    '.MKV',
    'HTML5',
  ]),
  middlewareUpload.vidSizeLimiter,
  middleware.addVideosValidator,
  recipesController.addVideos
)

router.post(
  '/add/photos/',
  middlewareUpload.filesPayLoadExist,
  middlewareUpload.fileExtLimiter([
    '.png',
    '.jpg',
    '.jpeg',
    '.PNG',
    '.JPG',
    '.JPEG',
  ]),
  middlewareUpload.fileSizeLimiter,
  middleware.addPhotoValidator,
  recipesController.addPhotos
)

router.post(
  '/add/:id/comments',
  middleware.addCommentValidator,
  recipesController.addComments
)

// READ
router.get('/search/:titlez?', recipesController.getAllRecipes)
router.get('/search-2/:titlez?', recipesController.getAllRecipes2) //sort by nama

// UPDATE // error solved, sepertinya tidak bisa digabung patch untuk vid dan photo. karena middleware akan bertabrakan
router.patch(
  '/edit/:id',
  middlewareUpload.fileExtLimiter([
    '.png',
    '.jpg',
    '.jpeg',
    '.PNG',
    '.JPG',
    '.JPEG',
  ]),
  middlewareUpload.fileSizeLimiter,
  middlewareUpload.vidExtLimiter([
    '.mp4',
    '.mov',
    '.wmv',
    '.avi',
    '.avichd',
    '.flv',
    '.mkv',
    'html5',
    '.MP4',
    '.MOV',
    '.WMV',
    '.AVI',
    '.AVICHD',
    '.FLV',
    '.MKV',
    'HTML5',
  ]),
  middlewareUpload.vidSizeLimiter,
  middleware.updateRecipesValidator,
  recipesController.updateRecipes
)

// DELETE
router.delete(
  '/delete/recipes/:id',
  middleware.deleteValidator,
  recipesController.deleteRecipes
)

router.delete(
  '/delete/videos/:id',
  middleware.deleteValidator,
  recipesController.deleteVideos
)

router.delete(
  '/delete/photos/:id',
  middleware.deleteValidator,
  recipesController.deletePhotos
)

router.delete(
  '/delete/comments/:id',
  middleware.deleteValidator,
  recipesController.deleteComments
)

module.exports = router
