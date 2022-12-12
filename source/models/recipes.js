const db = require('../config/database')

const getAllRecipesRelation = async () => {
  return await db`SELECT DISTINCT ON (recipes.recipes_id) recipes.recipes_id, accounts.username, recipes.title, recipes.ingredients, recipe_photos.photo, recipe_videos.video, comments.comment, recipes.created_at FROM recipes LEFT JOIN accounts ON recipes.accounts_id = accounts.accounts_id LEFT JOIN recipe_photos ON recipes.accounts_id = recipe_photos.accounts_id LEFT JOIN recipe_videos ON recipes.accounts_id = recipe_videos.accounts_id LEFT JOIN comments ON recipes.accounts_id = comments.accounts_id`
}

const getRecipesByNameRelation = async (params) => {
  const { title } = params

  return await db`SELECT DISTINCT ON (recipes.recipes_id) recipes.recipes_id, accounts.username, recipes.title, recipes.ingredients, recipe_photos.photo, recipe_videos.video, comments.comment, recipes.created_at FROM recipes  LEFT JOIN accounts ON recipes.accounts_id = accounts.accounts_id  LEFT JOIN recipe_photos ON recipes.accounts_id = recipe_photos.accounts_id  LEFT JOIN recipe_videos ON recipes.accounts_id = recipe_videos.accounts_id  LEFT JOIN comments ON recipes.accounts_id = comments.accounts_id WHERE recipes.title LIKE ${
    '%' + title + '%'
  }`
}

const getAllRecipesRelationPaginationSort = async (params) => {
  const { sort, limit, page } = params

  return await db`SELECT DISTINCT ON (recipes.created_at) recipes.recipes_id, accounts.username, recipes.title, recipes.ingredients, recipe_photos.photo, recipe_videos.video, comments.comment, recipes.created_at FROM recipes LEFT JOIN accounts ON recipes.accounts_id = accounts.accounts_id LEFT JOIN recipe_photos ON recipes.accounts_id = recipe_photos.accounts_id LEFT JOIN recipe_videos ON recipes.accounts_id = recipe_videos.accounts_id LEFT JOIN comments ON recipes.accounts_id = comments.accounts_id ${
    sort
      ? db`ORDER BY recipes.created_at DESC`
      : db`ORDER BY recipes.created_at ASC`
  } LIMIT ${limit} OFFSET ${limit * (page - 1)}`
}

const getAllRecipesRelationPagination = async (params) => {
  const { limit, page } = params

  return await db`SELECT DISTINCT ON (recipes.recipes_id) recipes.recipes_id, accounts.username, recipes.title, recipes.ingredients, recipe_photos.photo, recipe_videos.video, comments.comment, recipes.created_at FROM recipes LEFT JOIN accounts ON recipes.accounts_id = accounts.accounts_id LEFT JOIN recipe_photos ON recipes.accounts_id = recipe_photos.accounts_id LEFT JOIN recipe_videos ON recipes.accounts_id = recipe_videos.accounts_id LEFT JOIN comments ON recipes.accounts_id = comments.accounts_id  LIMIT ${limit} OFFSET ${
    limit * (page - 1)
  }`
}

const getAllRecipesRelationSort = async (params) => {
  const { sort } = params

  return await db`SELECT DISTINCT ON (recipes.recipes_id) recipes.recipes_id, accounts.username, recipes.title, recipes.ingredients, recipe_photos.photo, recipe_videos.video, comments.comment, recipes.created_at FROM recipes LEFT JOIN accounts ON recipes.accounts_id = accounts.accounts_id LEFT JOIN recipe_photos ON recipes.accounts_id = recipe_photos.accounts_id LEFT JOIN recipe_videos ON recipes.accounts_id = recipe_videos.accounts_id LEFT JOIN comments ON recipes.accounts_id = comments.accounts_id  ${
    sort
      ? db`ORDER BY recipes.recipes_id DESC`
      : db`ORDER BY recipes.recipes_id ASC`
  } `
}

const getAllRecipesTitleRelation = async () => {
  return await db`SELECT DISTINCT ON (recipes.title) recipes.recipes_id, accounts.username, recipes.title, recipes.ingredients, recipe_photos.photo, recipe_videos.video, comments.comment, recipes.created_at FROM recipes LEFT JOIN accounts ON recipes.accounts_id = accounts.accounts_id LEFT JOIN recipe_photos ON recipes.accounts_id = recipe_photos.accounts_id LEFT JOIN recipe_videos ON recipes.accounts_id = recipe_videos.accounts_id LEFT JOIN comments ON recipes.accounts_id = comments.accounts_id ORDER BY recipes.title ASC`
}

const getAllRecipesTitleRelationPaginationSort = async (params) => {
  const { sortTitle, limit, page } = params

  return await db`SELECT DISTINCT ON (recipes.title) recipes.recipes_id, accounts.username, recipes.title, recipes.ingredients, recipe_photos.photo, recipe_videos.video, comments.comment, recipes.created_at FROM recipes LEFT JOIN accounts ON recipes.accounts_id = accounts.accounts_id LEFT JOIN recipe_photos ON recipes.accounts_id = recipe_photos.accounts_id LEFT JOIN recipe_videos ON recipes.accounts_id = recipe_videos.accounts_id LEFT JOIN comments ON recipes.accounts_id = comments.accounts_id ${
    sortTitle ? db`ORDER BY recipes.title DESC` : db`ORDER BY recipes.title ASC`
  } LIMIT ${limit} OFFSET ${limit * (page - 1)}`
}

const getAllRecipesTitleRelationPagination = async (params) => {
  const { limit, page } = params

  return await db`SELECT DISTINCT ON (recipes.recipes_id) recipes.recipes_id, accounts.username, recipes.title, recipes.ingredients, recipe_photos.photo, recipe_videos.video, comments.comment, recipes.created_at FROM recipes LEFT JOIN accounts ON recipes.accounts_id = accounts.accounts_id LEFT JOIN recipe_photos ON recipes.accounts_id = recipe_photos.accounts_id LEFT JOIN recipe_videos ON recipes.accounts_id = recipe_videos.accounts_id LEFT JOIN comments ON recipes.accounts_id = comments.accounts_id  LIMIT ${limit} OFFSET ${
    limit * (page - 1)
  }`
}

const getAllRecipesTitleRelationSort = async (params) => {
  const { sortTitle } = params

  return await db`SELECT DISTINCT ON (recipes.title) recipes.recipes_id, accounts.username, recipes.title, recipes.ingredients, recipe_photos.photo, recipe_videos.video, comments.comment, recipes.created_at FROM recipes LEFT JOIN accounts ON recipes.accounts_id = accounts.accounts_id LEFT JOIN recipe_photos ON recipes.accounts_id = recipe_photos.accounts_id LEFT JOIN recipe_videos ON recipes.accounts_id = recipe_videos.accounts_id LEFT JOIN comments ON recipes.accounts_id = comments.accounts_id  ${
    sortTitle ? db`ORDER BY recipes.title DESC` : db`ORDER BY recipes.title ASC`
  } `
}

const checkAccByID = async (params) => {
  const { accounts_id } = params

  return await db`SELECT * FROM accounts WHERE accounts_id = ${accounts_id}`
}

const addRecipes = async (params) => {
  const { accounts_id, title, ingredients } = params

  return await db`INSERT INTO recipes ("accounts_id", "title", "ingredients") VALUES (${accounts_id}, ${title}, ${ingredients})`
}

const checkRecipesByTitle = async (params) => {
  const { title } = params

  return await db`SELECT * FROM recipes WHERE title = ${title}`
}

const checkRecipesIDbyRecipesID = async (params) => {
  const { recipes_id } = params

  return await db`SELECT recipes_id FROM recipes where recipes_id = ${recipes_id}`
}

const checkAccIDByRecipesID = async (params) => {
  const { recipes_id } = params

  return await db`SELECT accounts_id FROM recipes where recipes_id = ${recipes_id}`
}

const addVideos = async (params) => {
  const { recipes_id, video, checkAccID } = params

  return await db`INSERT INTO recipe_videos ("recipes_id","video", "accounts_id") VALUES (${recipes_id}, ${video}, ${checkAccID[0].accounts_id})`
}

const addPhotos = async (params) => {
  const { recipes_id, photo, checkAccID } = params

  return await db`INSERT INTO recipe_photos ("recipes_id","photo", "accounts_id") VALUES (${recipes_id}, ${photo}, ${checkAccID[0].accounts_id})`
}

const addComments = async (params) => {
  const { recipes_id, comment, id } = params

  return await db`INSERT INTO comments ("recipes_id","comment", "accounts_id") VALUES (${recipes_id}, ${comment}, ${id})`
}

const getRecipesByRecipesID = async (params) => {
  const { id } = params

  return await db`SELECT * FROM recipes WHERE recipes_id = ${id}`
}

const editRecipes = async (params) => {
  const { title, ingredients, id } = params

  return await db`UPDATE recipes
    SET title = ${title || getAllData[0]?.title},
      ingredients = ${ingredients || getAllData[0]?.ingredients}
    WHERE recipes_id = ${id} `
}

const checkVideosByID = async (params) => {
  const { id } = params

  return await db`SELECT * FROM recipe_videos WHERE videos_id = ${id}`
}

const checkPhotosByID = async (params) => {
  const { id } = params

  return await db`SELECT * FROM recipe_photos WHERE photos_id = ${id}`
}

const editPhotos = async (params) => {
  const { photo, checkPhtID, id } = params

  return await db`UPDATE recipe_photos
    SET photo = ${photo || checkPhtID[0]?.photo}
    WHERE photos_id = ${id}`
}

const editVideos = async (params) => {
  const { video, checkVidID, id } = params

  return await db`UPDATE recipe_videos
    SET video = ${video || checkVidID[0]?.video}
    WHERE videos_id = ${id}`
}

const checkComment = async (params) => {
  const { id } = params

  return await db`SELECT * FROM comments WHERE comments_id = ${id}`
}

const editComments = async (params) => {
  const { comment, checkCommID, id } = params

  return await db`UPDATE comments
    SET comment = ${comment || checkCommID[0]?.comment}
    WHERE comments_id = ${id}`
}

const deleteRecipes = async (params) => {
  const { id } = params

  return await db`DELETE FROM recipes WHERE recipes_id = ${id}`
}

const getRecipesVidByVidID = async (params) => {
  const { id } = params

  return await db`SELECT * FROM recipe_videos WHERE videos_id = ${id}`
}

const deleteVideos = async (params) => {
  const { id } = params

  return await db`DELETE FROM recipe_videos WHERE videos_id = ${id}`
}

const getRecipesPhtByPhtID = async (params) => {
  const { id } = params

  return await db`SELECT * FROM recipe_photos WHERE photos_id = ${id}`
}

const deletePhotos = async (params) => {
  const { id } = params

  return await db`DELETE FROM recipe_photos WHERE photos_id = ${id}`
}

const getCommentsByCommentsID = async (params) => {
  const { id } = params

  return await db`SELECT * FROM comments WHERE comments_id = ${id}`
}

const deleteComments = async (params) => {
  const { id } = params

  return await db`DELETE FROM comments WHERE comments_id = ${id}`
}

module.exports = {
  getAllRecipesRelation,
  getRecipesByNameRelation,
  getAllRecipesRelationPaginationSort,
  getAllRecipesRelationPagination,
  getAllRecipesRelationSort,
  getAllRecipesTitleRelation,
  getAllRecipesTitleRelationPaginationSort,
  getAllRecipesTitleRelationPagination,
  getAllRecipesTitleRelationSort,
  checkAccByID,
  addRecipes,
  checkRecipesByTitle,
  checkRecipesIDbyRecipesID,
  checkAccIDByRecipesID,
  addVideos,
  addPhotos,
  addComments,
  getRecipesByRecipesID,
  editRecipes,
  checkVideosByID,
  checkPhotosByID,
  editPhotos,
  editVideos,
  checkComment,
  editComments,
  deleteRecipes,
  getRecipesVidByVidID,
  deleteVideos,
  getRecipesPhtByPhtID,
  deletePhotos,
  getCommentsByCommentsID,
  deleteComments,
}
