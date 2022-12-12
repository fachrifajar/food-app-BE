const express = require('express')
const router = express.Router()
const recipesController = require('../controller/recipes')

// CREATE
router.post('/add', recipesController.addRecipes)

router.post('/add/videos', recipesController.addVideos)

router.post('/add/photos', recipesController.addPhotos)

router.post('/add/:id?/comments', recipesController.addComments)

// READ
router.get('/search/:titlez?', recipesController.getAllRecipes)
router.get('/search2/:titlez?', recipesController.getAllRecipes)

// UPDATE
router.patch('/edit/:id', recipesController.updateRecipes)

// DELETE
router.delete('/delete/recipes/:id', recipesController.deleteRecipes)

router.delete('/delete/videos/:id', recipesController.deleteVideos)

router.delete('/delete/photos/:id', recipesController.deletePhotos)

router.delete('/delete/comments/:id', recipesController.deleteComments)



module.exports = router
