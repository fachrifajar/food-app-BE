const db = require('../config/database')

//new models for pagination in front-end
const getCountRecipe = async () => {
  return await db`SELECT COUNT(recipes_id) from recipes `
}

//checked 2x
const getAllRecipesRelation = async () => {
  // return await db`SELECT recipes.recipes_id, accounts.username, recipes.title, recipes.ingredients, string_agg(DISTINCT recipe_photos.photo, ',') as photo, array_agg(DISTINCT recipe_videos.video) as video, array_agg(DISTINCT comments.comment) as comment, recipes.created_at, recipes.slug
  // FROM recipes
  // LEFT JOIN accounts ON recipes.accounts_id = accounts.accounts_id
  // LEFT JOIN recipe_photos ON recipes.recipes_id = recipe_photos.recipes_id
  // LEFT JOIN recipe_videos ON recipes.recipes_id = recipe_videos.recipes_id
  // LEFT JOIN comments ON recipes.recipes_id = comments.recipes_id
  // GROUP BY recipes.recipes_id, accounts.username, recipes.title, recipes.ingredients, recipes.created_at`

  return await db`SELECT recipes.recipes_id, accounts.username, recipes.title, recipes.ingredients, recipes.photo, recipes.created_at, recipes.slug
  FROM recipes 
  LEFT JOIN accounts ON recipes.accounts_id = accounts.accounts_id    
  GROUP BY recipes.recipes_id, accounts.username, recipes.title, recipes.ingredients, recipes.created_at`
}

//checked 3x
const getRecipesByNameRelation = async (params) => {
  const { title } = params

  return await db`SELECT recipes.recipes_id, accounts.username, recipes.title, recipes.ingredients, 
  recipes.photo,
  recipes.created_at, recipes.slug, recipes.love
FROM recipes 
LEFT JOIN accounts ON recipes.accounts_id = accounts.accounts_id 
  WHERE recipes.slug ILIKE '%' || ${title} || '%'
  GROUP BY recipes.recipes_id, accounts.username, recipes.title, recipes.ingredients, recipes.created_at`
}

//checked
const getAllRecipesRelationPaginationSort = async (params) => {
  const { sort, limit, page, sortType } = params;
  let orderBy;

  if (sortType === "titleAsc") {
    orderBy = db`ORDER BY recipes.title ASC`;
  } else if (sortType === "titleDesc") {
    orderBy = db`ORDER BY recipes.title DESC`;
  } else if (sortType === "createdAsc") {
    orderBy = db`ORDER BY recipes.created_at ASC`;
  } else if (sortType === "createdDesc") {
    orderBy = db`ORDER BY recipes.created_at DESC`;
  } else if (sortType === "loveAsc") {
    orderBy = db`ORDER BY recipes.love ASC`;
  } else if (sortType === "loveDesc") {
    orderBy = db`ORDER BY recipes.love DESC`;
  } else {
    orderBy = db`ORDER BY recipes.created_at ASC`;
  }

  return await db`
    SELECT recipes.recipes_id, accounts.username, recipes.title, recipes.ingredients, recipes.photo, recipes.created_at, recipes.slug, recipes.love
    FROM recipes 
    LEFT JOIN accounts ON recipes.accounts_id = accounts.accounts_id 
    GROUP BY recipes.recipes_id, accounts.username, recipes.title, recipes.ingredients, recipes.created_at  
    ${sort ? orderBy : db`ORDER BY recipes.created_at ASC`}
    LIMIT ${limit} OFFSET ${limit * (page - 1)}
  `;
};


const getMyRecipePagination = async (params) => {
  const { userId, limit, page, sort } = params

  return await db`SELECT recipes.recipes_id, accounts.username, recipes.title, recipes.ingredients, recipes.photo, recipes.created_at, recipes.slug
  FROM recipes 
  LEFT JOIN accounts ON recipes.accounts_id = accounts.accounts_id    
  WHERE recipes.accounts_id = ${userId}
  GROUP BY recipes.recipes_id, accounts.username, recipes.title, recipes.ingredients, recipes.created_at
  ${
    sort
      ? db`ORDER BY recipes.created_at DESC`
      : db`ORDER BY recipes.created_at ASC`
  }
  LIMIT ${limit} OFFSET ${limit * (page - 1)}`
}

const getMyRecipe = async (params) => {
  const { userId } = params

  return await db`SELECT recipes.recipes_id, accounts.username, recipes.title, recipes.ingredients, recipes.photo, recipes.created_at, recipes.slug
  FROM recipes 
  LEFT JOIN accounts ON recipes.accounts_id = accounts.accounts_id    
  WHERE recipes.accounts_id = ${userId}
  GROUP BY recipes.recipes_id, accounts.username, recipes.title, recipes.ingredients, recipes.created_at
`
}

//checked 2x
const getAllRecipesRelationPagination = async (params) => {
  const { limit, page } = params

  return await db`SELECT recipes.recipes_id, accounts.username, recipes.title, recipes.ingredients, recipes.photo, recipes.created_at, recipes.slug, recipes.love
  FROM recipes 
  LEFT JOIN accounts ON recipes.accounts_id = accounts.accounts_id 
  GROUP BY recipes.recipes_id, accounts.username, recipes.title, recipes.ingredients, recipes.created_at   LIMIT ${limit} OFFSET ${
    limit * (page - 1)
  }`
}

//checked 2x
const getAllRecipesRelationSort = async (params) => {
  const { sort, sortType } = params

  return await db`SELECT recipes.recipes_id, accounts.username, recipes.title, recipes.ingredients, recipes.photo, recipes.created_at, recipes.slug, recipes.love
  FROM recipes 
  LEFT JOIN accounts ON recipes.accounts_id = accounts.accounts_id 
  GROUP BY recipes.recipes_id, accounts.username, recipes.title, recipes.ingredients, recipes.created_at 
  ${
    sort
      ? sortType === '1'
        ? db`ORDER BY recipes.title ASC`
        : sortType === '2'
        ? db`ORDER BY recipes.created_at DESC`
        : db`ORDER BY recipes.created_at ASC`
      : db`ORDER BY recipes.created_at ASC`
  }
  `
}

// query with JOIN, below this codes are for GET RECIPES-2 (not updated, bcs im not using it anymore)
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
  const { accounts_id, title, ingredients, slug, roleValidator, video, photo } =
    params

  return await db`INSERT INTO recipes ("accounts_id", "title", "ingredients", "slug", "video", "photo") VALUES (${accounts_id}, ${title}, ${ingredients}, ${slug}, ${video}, ${photo})`
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
  const { recipes_id, video, accounts_id, roleValidator } = params

  return await db`INSERT INTO recipe_videos ("recipes_id","video", "accounts_id") VALUES (${recipes_id}, ${video}, ${accounts_id})`
}

const addPhotos = async (params) => {
  const { recipes_id, photo, accounts_id, roleValidator } = params

  return await db`INSERT INTO recipe_photos ("recipes_id","photo", "accounts_id") VALUES (${recipes_id}, ${photo}, ${accounts_id})`
}

const addComments = async (params) => {
  const { recipes_id, comment, accounts_id, roleValidator } = params

  return await db`INSERT INTO comments ("recipes_id","comment", "accounts_id") VALUES (${recipes_id}, ${comment}, ${accounts_id})`
}

const getRecipesByRecipesID = async (params) => {
  const { id } = params

  return await db`SELECT * FROM recipes WHERE recipes_id = ${id}`
}

const getRecipesBySlug = async (params) => {
  const { slug } = params

  return await db`SELECT * FROM recipes WHERE slug = ${slug}`
}

const editRecipes = async (params) => {
  const { title, ingredients, id, getAllData, slug } = params

  return await db`UPDATE recipes
    SET title = ${title || getAllData?.title},
      ingredients = ${ingredients || getAllData?.ingredients},
      slug = ${slug || getAllData?.slug},
      updated_at = NOW() AT TIME ZONE 'Asia/Jakarta'
    WHERE recipes_id = ${id} `
}

const checkVideosByID = async (params) => {
  const { id } = params

  return await db`SELECT * FROM recipe_videos WHERE videos_id = ${id}`
}

const checkPhotosByID = async (params) => {
  const { id } = params

  return await db`SELECT * FROM recipes WHERE recipes_id = ${id}`
}

const editPhotos = async (params) => {
  const { title, ingredients, id, getAllData, slug, photo } = params

  return await db`UPDATE recipes
    SET title = ${title || getAllData?.title},
      ingredients = ${ingredients || getAllData?.ingredients},
      slug = ${slug || getAllData?.slug},
      photo = ${photo || getAllData?.photo},
      updated_at = NOW() AT TIME ZONE 'Asia/Jakarta'
    WHERE recipes_id = ${id} `
}

const editVideos = async (params) => {
  const { video, checkVidID, id } = params

  return await db`UPDATE recipe_videos
    SET video = ${video || checkVidID[0]?.video},
    updated_at = NOW() AT TIME ZONE 'Asia/Jakarta'
    WHERE videos_id = ${id}`
}

const checkComment = async (params) => {
  const { id } = params

  return await db`SELECT * FROM comments WHERE id = ${id}`
}

const editComments = async (params) => {
  const { comment, checkCommID, id } = params

  return await db`UPDATE comments
    SET comment = ${comment || checkCommID?.comment},
    updated_at = NOW() AT TIME ZONE 'Asia/Jakarta'
    WHERE id = ${id}`
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

  return await db`SELECT * FROM comments WHERE id = ${id}`
}

const deleteComments = async (params) => {
  const { id } = params

  return await db`DELETE FROM comments WHERE id = ${id}`
}

const getRoles = async (params) => {
  const { roleValidator } = params

  return await db`SELECT role from accounts WHERE accounts_id = ${roleValidator}`
}

const validateRecipesId = async (params) => {
  const { recipes_id } = params

  return await db`SELECT * from recipes WHERE recipes_id = ${recipes_id}`
}

const getComments = async (params) => {
  const { recipes_id } = params

  return await db`SELECT accounts.accounts_id, accounts.username, accounts.profile_picture, accounts.email, comments.comment, comments.id AS comments_id, comments.created_at, comments.updated_at
  FROM comments
  LEFT JOIN accounts ON accounts.accounts_id = comments.accounts_id
  WHERE recipes_id = ${recipes_id} 
  `
}

const addLoveRecipe = async (params) => {
  const { recipes_id, id } = params

  await db`UPDATE recipes
  SET love = love + 1
  WHERE recipes_id = ${recipes_id}`

  await db`UPDATE accounts
  SET love = array_append(love, ${recipes_id}::numeric)
  WHERE accounts_id = ${id};`
}

const addUnloveRecipe = async (params) => {
  const { recipes_id, id } = params

  await db`UPDATE recipes
  SET love = love - 1
  WHERE recipes_id = ${recipes_id}`

  await db`UPDATE accounts
  SET love = array_remove(love, ${recipes_id}::numeric)
  WHERE accounts_id = ${id};`
}

const checkLoveRecipe = async (params) => {
  const { recipes_id, id } = params

  const result = await db`SELECT EXISTS (
    SELECT 1
    FROM accounts
    WHERE accounts_id = ${id}
      AND ${recipes_id} = ANY(love)
  ) AS value_exists;`

  return result[0].value_exists
}

const getLoveRecipe = async (params) => {
  const { id } = params

  return await db`SELECT *
  FROM recipes
  WHERE recipes_id = ANY(SELECT unnest(love) FROM accounts WHERE accounts_id = ${id})`
}

const getLoveRecipeCount = async (params) => {
  const { recipes_id } = params

  return await db`SELECT love FROM recipes WHERE recipes_id = ${recipes_id}`
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
  getCountRecipe,
  getRecipesBySlug,
  getRoles,
  validateRecipesId,
  getMyRecipe,
  getMyRecipePagination,
  getComments,
  addLoveRecipe,
  addUnloveRecipe,
  checkLoveRecipe,
  getLoveRecipe,
  getLoveRecipeCount,
}
