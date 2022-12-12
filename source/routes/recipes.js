const express = require('express')
const router = express.Router()
const recipesController = require('../controller/recipes')
const middleware = require('../middleware/recipes')

// CREATE
router.post(
  '/add',
  middleware.createRecipesValidator,
  recipesController.addRecipes
)

router.post(
  '/add/videos',
  middleware.addVideosValidator,
  recipesController.addVideos
)

router.post(
  '/add/photos',
  middleware.addPhotoValidator,
  recipesController.addPhotos
)

router.post(
  '/add/:id?/comments',
  middleware.addCommentValidator,
  recipesController.addComments
)

// READ
router.get('/search/:titlez?', recipesController.getAllRecipes)
router.get('/search-2/:titlez?', recipesController.getAllRecipes2) //sort by nama

// UPDATE
router.patch(
  '/edit/:id',
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
