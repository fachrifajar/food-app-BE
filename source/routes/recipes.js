const express = require('express')
const router = express.Router()
const recipesController = require('../controller/recipes')
const middleware = require('../middleware/recipes')
const middlewareUpload = require('../middleware/upload')
const redisMiddleware = require('../middleware/redis')
const authMiddleware = require('../middleware/auth')

// CREATE
router.post(
  '/add',
  authMiddleware.validateToken,
  authMiddleware.validateRole,
  middleware.createRecipesValidator,
  recipesController.addRecipes
)

router.post(
  '/add/videos',
  authMiddleware.validateToken,
  middlewareUpload.filesPayLoadExist,
  middlewareUpload.fileExtLimiter([
    '.mp4',
    '.mov',
    '.wmv',
    '.avi',
    '.avichd',
    '.flv',
    '.mkv',
    '.html5',
    '.MP4',
    '.MOV',
    '.WMV',
    '.AVI',
    '.AVICHD',
    '.FLV',
    '.MKV',
    '.HTML5',
  ]),
  middlewareUpload.vidSizeLimiter,
  middleware.addVideosValidator,
  recipesController.addVideos
)

router.post(
  '/add/photos/',
  authMiddleware.validateToken,
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
  '/add/comments',
  authMiddleware.validateToken,
  middleware.addCommentValidator,
  recipesController.addComments
)

// READ
router.get(
  '/search/:titlez?',
  authMiddleware.validateToken,
  redisMiddleware.getAllRecipes_Redis,
  recipesController.getAllRecipes
) // sort by created_at / recipes_id

router.get(
  '/search-2/:titlez?',
  authMiddleware.validateToken,
  recipesController.getAllRecipes2
) //sort by nama

// UPDATE
router.patch(
  '/edit/:id',
  authMiddleware.validateToken,
  middleware.updateRecipesValidator,
  recipesController.updateRecipes
)

// DELETE
router.delete(
  '/delete/recipes/:id',
  authMiddleware.validateToken,
  middleware.deleteValidator,
  recipesController.deleteRecipes
)

router.delete(
  '/delete/videos/:id',
  authMiddleware.validateToken,
  middleware.deleteValidator,
  recipesController.deleteVideos
)

router.delete(
  '/delete/photos/:id',
  authMiddleware.validateToken,
  middleware.deleteValidator,
  recipesController.deletePhotos
)

router.delete(
  '/delete/comments/:id',
  authMiddleware.validateToken,
  middleware.deleteValidator,
  recipesController.deleteComments
)

module.exports = router
