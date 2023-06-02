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
  authMiddleware.validateRole,
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
  authMiddleware.validateRole,
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
  authMiddleware.validateRole,
  middleware.addCommentValidator,
  recipesController.addComments
)

router.patch(
  '/add/like',
  authMiddleware.validateToken,
  authMiddleware.validateRole,
  recipesController.updateLoveRecipe
)

// READ, NEW UPDATE SORT BY sortType, "1" => sort by title ASC, "2" => sort by created_at DESC
router.get(
  '/search/:titlez?',
  // authMiddleware.validateToken,
  redisMiddleware.getAllRecipes_Redis,
  recipesController.getAllRecipes
) // ?sort by created_at / recipes_id

router.get(
  '/search-2/:titlez?',
  // authMiddleware.validateToken,
  recipesController.getAllRecipes2
) //? sort by nama

router.get('/search/comment/:id', recipesController.getComments)

router.get('/search/myrecipe/:id', recipesController.getMyRecipes)

router.get(
  '/love-recipe',
  authMiddleware.validateToken,
  authMiddleware.validateRole,
  recipesController.getLoveRecipe
)

router.get('/love-recipe/count/:recipes_id', recipesController.getCountLove)

router.get(
  '/love-recipe/validate/:recipes_id',
  authMiddleware.validateToken,
  authMiddleware.validateRole,
  recipesController.getValidateLove
)

// UPDATE
router.patch(
  '/edit/:id',
  authMiddleware.validateToken,
  authMiddleware.validateRole,
  middleware.updateRecipesValidator,
  recipesController.updateRecipes
)

// UPDATE
router.patch(
  '/edit/add/:id',
  authMiddleware.validateToken,
  authMiddleware.validateRole,
  recipesController.updateSave
)

// DELETE
router.delete(
  '/delete/recipes/:id',
  authMiddleware.validateToken,
  authMiddleware.validateRole,
  middleware.deleteValidator,
  recipesController.deleteRecipes
)

router.delete(
  '/delete/videos/:id',
  authMiddleware.validateToken,
  authMiddleware.validateRole,
  middleware.deleteValidator,
  recipesController.deleteVideos
)

router.delete(
  '/delete/photos/:id',
  authMiddleware.validateToken,
  authMiddleware.validateRole,
  middleware.deleteValidator,
  recipesController.deletePhotos
)

router.delete(
  '/delete/comments/:id',
  authMiddleware.validateToken,
  authMiddleware.validateRole,
  middleware.deleteValidator,
  recipesController.deleteComments
)

module.exports = router
