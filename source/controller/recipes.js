const db = require('../config/database')

const getAllRecipes = async (req, res) => {
  try {
    const { titlez } = req.params
    const { page, limit, sort } = req.query
    const totalDatas =
      await db`SELECT DISTINCT ON (recipes.recipes_id) recipes.recipes_id, accounts.username, recipes.title, recipes.ingredients, recipe_photos.photo, recipe_videos.video, comments.comment, recipes.created_at FROM recipes LEFT JOIN accounts ON recipes.accounts_id = accounts.accounts_id LEFT JOIN recipe_photos ON recipes.accounts_id = recipe_photos.accounts_id LEFT JOIN recipe_videos ON recipes.accounts_id = recipe_videos.accounts_id LEFT JOIN comments ON recipes.accounts_id = comments.accounts_id`
    let getUsersData
    let getAllData
    console.log(titlez)
    if (titlez) {
      getUsersData =
        await db`SELECT DISTINCT ON (recipes.recipes_id) recipes.recipes_id, accounts.username, recipes.title, recipes.ingredients, recipe_photos.photo, recipe_videos.video, comments.comment, recipes.created_at FROM recipes  LEFT JOIN accounts ON recipes.accounts_id = accounts.accounts_id  LEFT JOIN recipe_photos ON recipes.accounts_id = recipe_photos.accounts_id  LEFT JOIN recipe_videos ON recipes.accounts_id = recipe_videos.accounts_id  LEFT JOIN comments ON recipes.accounts_id = comments.accounts_id WHERE recipes.title LIKE ${
          '%' + titlez + '%'
        }`
      if (getUsersData.length > 0) {
        res.json({
          message: `Get Recipes With titles: ${titlez}`,
          total: getUsersData.length,
          data: getUsersData,
        })
      } else {
        throw 'Data not found'
      }
    }
    if (!titlez && !page && !limit && !sort) {
      getUsersData =
        await db`SELECT DISTINCT ON (recipes.recipes_id) recipes.recipes_id, accounts.username, recipes.title, recipes.ingredients, recipe_photos.photo, recipe_videos.video, comments.comment, recipes.created_at FROM recipes LEFT JOIN accounts ON recipes.accounts_id = accounts.accounts_id LEFT JOIN recipe_photos ON recipes.accounts_id = recipe_photos.accounts_id LEFT JOIN recipe_videos ON recipes.accounts_id = recipe_videos.accounts_id LEFT JOIN comments ON recipes.accounts_id = comments.accounts_id`

      res.json({
        message: 'success get all data users',
        total: getUsersData.length,
        data: getUsersData,
      })
    }
    if (page || limit || sort) {
      if (page && limit && sort) {
        getAllData =
          await db`SELECT DISTINCT ON (recipes.recipes_id) recipes.recipes_id, accounts.username, recipes.title, recipes.ingredients, recipe_photos.photo, recipe_videos.video, comments.comment, recipes.created_at FROM recipes LEFT JOIN accounts ON recipes.accounts_id = accounts.accounts_id LEFT JOIN recipe_photos ON recipes.accounts_id = recipe_photos.accounts_id LEFT JOIN recipe_videos ON recipes.accounts_id = recipe_videos.accounts_id LEFT JOIN comments ON recipes.accounts_id = comments.accounts_id ${
            sort
              ? db`ORDER BY recipes.recipes_id DESC`
              : db`ORDER BY recipes.recipes_id ASC`
          } LIMIT ${limit} OFFSET ${limit * (page - 1)}`
      } else if (page && limit) {
        getAllData =
          await db`SELECT DISTINCT ON (recipes.recipes_id) recipes.recipes_id, accounts.username, recipes.title, recipes.ingredients, recipe_photos.photo, recipe_videos.video, comments.comment, recipes.created_at FROM recipes LEFT JOIN accounts ON recipes.accounts_id = accounts.accounts_id LEFT JOIN recipe_photos ON recipes.accounts_id = recipe_photos.accounts_id LEFT JOIN recipe_videos ON recipes.accounts_id = recipe_videos.accounts_id LEFT JOIN comments ON recipes.accounts_id = comments.accounts_id  LIMIT ${limit} OFFSET ${
            limit * (page - 1)
          }`
      } else if (sort) {
        getAllData =
          await db`SELECT DISTINCT ON (recipes.recipes_id) recipes.recipes_id, accounts.username, recipes.title, recipes.ingredients, recipe_photos.photo, recipe_videos.video, comments.comment, recipes.created_at FROM recipes LEFT JOIN accounts ON recipes.accounts_id = accounts.accounts_id LEFT JOIN recipe_photos ON recipes.accounts_id = recipe_photos.accounts_id LEFT JOIN recipe_videos ON recipes.accounts_id = recipe_videos.accounts_id LEFT JOIN comments ON recipes.accounts_id = comments.accounts_id  ${
            sort
              ? db`ORDER BY recipes.recipes_id DESC`
              : db`ORDER BY recipes.recipes_id ASC`
          } `
        res.json({
          message: 'success get data',
          total: totalDatas.length,
          data: getAllData,
        })
      }
    }
    if ((page && limit && sort) || (page && limit)) {
      // if (getAllData > 0) {
      res.json({
        message: 'success get data',
        total: totalDatas.length,
        dataPerPage: getAllData.length,
        page: `${page} from ${Math.ceil(totalDatas.length / limit)}`,
        data: getAllData,
      })
      // } else {
      //   throw 'Data not found'
      // }
    }
  } catch (err) {
    res.status(500).json({
      message: 'Server Error',
      serverMessage: `${err}`,
    })
  }
}

const getAllRecipes2 = async (req, res) => {
  try {
    const { titlez } = req.params
    const { page, limit, sort } = req.query
    const totalDatas =
      await db`SELECT DISTINCT ON (recipes.recipes_id) recipes.recipes_id, accounts.username, recipes.title, recipes.ingredients, recipe_photos.photo, recipe_videos.video, comments.comment, recipes.created_at FROM recipes LEFT JOIN accounts ON recipes.accounts_id = accounts.accounts_id LEFT JOIN recipe_photos ON recipes.accounts_id = recipe_photos.accounts_id LEFT JOIN recipe_videos ON recipes.accounts_id = recipe_videos.accounts_id LEFT JOIN comments ON recipes.accounts_id = comments.accounts_id`
    let getUsersData
    let getAllData
    console.log(titlez)
    if (titlez) {
      getUsersData =
        await db`SELECT DISTINCT ON (recipes.recipes_id) recipes.recipes_id, accounts.username, recipes.title, recipes.ingredients, recipe_photos.photo, recipe_videos.video, comments.comment, recipes.created_at FROM recipes  LEFT JOIN accounts ON recipes.accounts_id = accounts.accounts_id  LEFT JOIN recipe_photos ON recipes.accounts_id = recipe_photos.accounts_id  LEFT JOIN recipe_videos ON recipes.accounts_id = recipe_videos.accounts_id  LEFT JOIN comments ON recipes.accounts_id = comments.accounts_id WHERE recipes.title LIKE ${
          '%' + titlez + '%'
        }`
      if (getUsersData.length > 0) {
        res.json({
          message: `Get Recipes With titles: ${titlez}`,
          total: getUsersData.length,
          data: getUsersData,
        })
      } else {
        throw 'Data not found'
      }
    }
    if (!titlez && !page && !limit && !sort) {
      getUsersData =
        await db`SELECT DISTINCT ON (recipes.recipes_id) recipes.recipes_id, accounts.username, recipes.title, recipes.ingredients, recipe_photos.photo, recipe_videos.video, comments.comment, recipes.created_at FROM recipes LEFT JOIN accounts ON recipes.accounts_id = accounts.accounts_id LEFT JOIN recipe_photos ON recipes.accounts_id = recipe_photos.accounts_id LEFT JOIN recipe_videos ON recipes.accounts_id = recipe_videos.accounts_id LEFT JOIN comments ON recipes.accounts_id = comments.accounts_id`

      res.json({
        message: 'success get all data users',
        total: getUsersData.length,
        data: getUsersData,
      })
    }
    if (page || limit || sort) {
      if (page && limit && sort) {
        getAllData =
          await db`SELECT DISTINCT ON (recipes.title) recipes.recipes_id, accounts.username, recipes.title, recipes.ingredients, recipe_photos.photo, recipe_videos.video, comments.comment, recipes.created_at FROM recipes LEFT JOIN accounts ON recipes.accounts_id = accounts.accounts_id LEFT JOIN recipe_photos ON recipes.accounts_id = recipe_photos.accounts_id LEFT JOIN recipe_videos ON recipes.accounts_id = recipe_videos.accounts_id LEFT JOIN comments ON recipes.accounts_id = comments.accounts_id ${
            sort
              ? db`ORDER BY recipes.title DESC`
              : db`ORDER BY recipes.title ASC`
          } LIMIT ${limit} OFFSET ${limit * (page - 1)}`
      } else if (page && limit) {
        getAllData =
          await db`SELECT DISTINCT ON (recipes.recipes_id) recipes.recipes_id, accounts.username, recipes.title, recipes.ingredients, recipe_photos.photo, recipe_videos.video, comments.comment, recipes.created_at FROM recipes LEFT JOIN accounts ON recipes.accounts_id = accounts.accounts_id LEFT JOIN recipe_photos ON recipes.accounts_id = recipe_photos.accounts_id LEFT JOIN recipe_videos ON recipes.accounts_id = recipe_videos.accounts_id LEFT JOIN comments ON recipes.accounts_id = comments.accounts_id  LIMIT ${limit} OFFSET ${
            limit * (page - 1)
          }`
      } else if (sort) {
        getAllData =
          await db`SELECT DISTINCT ON (recipes.title) recipes.recipes_id, accounts.username, recipes.title, recipes.ingredients, recipe_photos.photo, recipe_videos.video, comments.comment, recipes.created_at FROM recipes LEFT JOIN accounts ON recipes.accounts_id = accounts.accounts_id LEFT JOIN recipe_photos ON recipes.accounts_id = recipe_photos.accounts_id LEFT JOIN recipe_videos ON recipes.accounts_id = recipe_videos.accounts_id LEFT JOIN comments ON recipes.accounts_id = comments.accounts_id  ${
            sort
              ? db`ORDER BY recipes.title DESC`
              : db`ORDER BY recipes.title ASC`
          } `
        res.json({
          message: 'success get data',
          total: totalDatas.length,
          data: getAllData,
        })
      }
    }
    if ((page && limit && sort) || (page && limit)) {
      // if (getAllData > 0) {
      res.json({
        message: 'success get data',
        total: totalDatas.length,
        dataPerPage: getAllData.length,
        page: `${page} from ${Math.ceil(totalDatas.length / limit)}`,
        data: getAllData,
      })
      // } else {
      //   throw 'Data not found'
      // }
    }
  } catch (err) {
    res.status(500).json({
      message: 'Server Error',
      serverMessage: `${err}`,
    })
  }
}

const addRecipes = async (req, res) => {
  try {
    const { accounts_id, title, ingredients } = req.body
    const checkID =
      await db`SELECT * FROM accounts WHERE accounts_id = ${accounts_id}`

    if (checkID.length == 0) {
      return res.status(403).json({
        message: 'ID not identified',
      })
    }

    if (title.length < 4) {
      return res.status(403).json({
        message: 'Title must have atleast 4 characters',
      })
    }
    if (title.length == 0) {
      return res.status(403).json({
        message: "Title can't be empty",
      })
    }
    if (ingredients.length < 3) {
      return res.status(403).json({
        message: 'Ingredients must have atleast 4 characters',
      })
    }
    if (ingredients.length == 0) {
      return res.status(403).json({
        message: "ingredients can't be empty",
      })
    }

    const addRecipes =
      await db`INSERT INTO recipes ("accounts_id", "title", "ingredients") VALUES (${accounts_id}, ${title}, ${ingredients})`
    res.json({
      message: 'data collected',
      data: req.body,
    })
    console.log(req.body)
  } catch (error) {
    if (error.code == 23505) {
      const getTitle =
        await db`SELECT * FROM recipes WHERE title = ${req.body.title}`
      if (getTitle.length !== 0) {
        {
          res.status(403).json({
            message: 'Title taken!',
          })
        }
      }
    }
  }
}

const addVideos = async (req, res) => {
  try {
    const { recipes_id, video } = req.body
    const checkRecipesID =
      await db`SELECT recipes_id FROM recipes where recipes_id = ${recipes_id}`
    const checkAccID =
      await db`SELECT accounts_id FROM recipes where recipes_id = ${recipes_id}`

    if (checkRecipesID.length == 0) {
      return res.status(403).json({
        message: 'ID not identified',
      })
    }

    if (video.length == 0) {
      return res.status(403).json({
        message: 'Please upload video link',
      })
    }

    const addVideo =
      await db`INSERT INTO recipe_videos ("recipes_id","video", "accounts_id") VALUES (${recipes_id}, ${video}, ${checkAccID[0].accounts_id})`
    res.json({
      message: 'data collected',
      data: req.body,
    })
    console.log(req.body)
  } catch (err) {
    res.status(500).json({
      message: 'Server Error',
      serverMessage: `${err}`,
    })
  }
}

const addPhotos = async (req, res) => {
  try {
    const { recipes_id, photo } = req.body
    const checkRecipesID =
      await db`SELECT recipes_id FROM recipes where recipes_id = ${recipes_id}`
    const checkAccID =
      await db`SELECT accounts_id FROM recipes where recipes_id = ${recipes_id}`

    if (checkRecipesID.length == 0) {
      return res.status(403).json({
        message: 'ID not identified',
      })
    }

    if (photo.length == 0) {
      return res.status(403).json({
        message: 'Please upload photo link',
      })
    }

    const addPhoto =
      await db`INSERT INTO recipe_photos ("recipes_id","photo", "accounts_id") VALUES (${recipes_id}, ${photo}, ${checkAccID[0].accounts_id})`
    res.json({
      message: 'data collected',
      data: req.body,
    })
    console.log(req.body)
  } catch (err) {
    res.status(500).json({
      message: 'Server Error',
      serverMessage: `${err}`,
    })
  }
}

const addComments = async (req, res) => {
  try {
    const { id } = req.params
    const { recipes_id, comment } = req.body
    const checkRecipesID =
      await db`SELECT recipes_id FROM recipes where recipes_id = ${recipes_id}`
    const checkAccID =
      await db`SELECT accounts_id FROM recipes where recipes_id = ${id}`

    if (checkAccID.length == 0) {
      return res.status(403).json({
        message: 'User not identified',
      })
    }

    if (checkRecipesID.length == 0) {
      return res.status(403).json({
        message: 'ID not identified',
      })
    }

    if (comment.length == 0) {
      return res.status(403).json({
        message: "Comment can't be empty",
      })
    }

    const addcomment =
      await db`INSERT INTO comments ("recipes_id","comment", "accounts_id") VALUES (${recipes_id}, ${comment}, ${id})`
    res.json({
      message: 'data collected',
      data: req.body,
    })
    console.log(req.body)
  } catch (err) {
    res.status(500).json({
      message: 'Server Error',
      serverMessage: `${err}`,
    })
  }
}

const updateRecipes = async (req, res) => {
  try {
    const { id } = req.params
    const {
      recipes_id,
      accounts_id,
      title,
      ingredients,
      photo,
      video,
      comment,
    } = req.body
    const getAllData = await db`SELECT * FROM recipes WHERE recipes_id = ${id}`

    const regexURL =
      /(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/g

    if (
      (recipes_id || accounts_id || title || ingredients) !== undefined &&
      (photo || video) == undefined &&
      comment == undefined
    ) {
      if (getAllData.length > 0) {
        if (recipes_id) {
          return res.status(403).json({
            message: "CAN'T CHANGE THIS CONTENT!!!",
          })
        }

        if (accounts_id) {
          return res.status(403).json({
            message: "CAN'T CHANGE THIS CONTENT!!!",
          })
        }

        if (title) {
          if (title.length < 4 || title.length > 20) {
            return res.status(403).json({
              message: 'Title must have atleast 4 characters',
            })
          }
        } else if (title == '') {
          return res.status(403).json({
            message: "Title can't be empty",
          })
        }
        if (ingredients) {
          if (ingredients.length <= 10) {
            return res.status(403).json({
              message: 'Ingredients must have atleast 10 characters',
            })
          }
        } else if (ingredients == '') {
          return res.status(403).json({
            message: "ingredients can't be empty",
          })
        }
        const editRecipes = await db`UPDATE recipes
      SET title = ${title || getAllData[0]?.title},
        ingredients = ${ingredients || getAllData[0]?.ingredients}
      WHERE recipes_id = ${id} `
      } else {
        return res.status(403).json({
          message: 'ID not identified',
        })
      }
    }
    if (
      (recipes_id || accounts_id || title || ingredients) == undefined &&
      (photo || video) !== undefined &&
      comment == undefined
    ) {
      const checkVidID =
        await db`SELECT * FROM recipe_videos WHERE videos_id = ${id}`
      const checkPhtID =
        await db`SELECT * FROM recipe_photos WHERE photos_id = ${id}`

      if (checkPhtID.length !== 1 && checkVidID.length !== 1) {
        return res.status(403).json({
          message: 'ID not identified',
        })
      }

      if (photo !== undefined && video == undefined) {
        if (regexURL.test(photo) == false) {
          return res.status(403).json({
            message: 'Please insert valid photo URL',
          })
        }
        const editPhotos = await db`UPDATE recipe_photos
            SET photo = ${photo || checkPhtID[0]?.photo}
            WHERE photos_id = ${id}`
      }

      if (video !== undefined && photo == undefined) {
        if (regexURL.test(video) == false) {
          return res.status(403).json({
            message: 'Please insert valid video URL',
          })
        }
        const editvideos = await db`UPDATE recipe_videos
              SET video = ${video || checkVidID[0]?.video}
              WHERE videos_id = ${id}`
      }
    }
    if (
      (recipes_id || accounts_id || title || ingredients) == undefined &&
      (photo || video) == undefined &&
      comment !== undefined
    ) {
      const checkCommID =
        await db`SELECT * FROM comments WHERE comments_id = ${id}`
      console.log(checkCommID)
      if (comment.length < 3) {
        return res.status(403).json({
          message: 'Comment must have atleast 4 characters',
        })
      }
      if (checkCommID.length !== 1) {
        return res.status(403).json({
          message: 'ID not identified',
        })
      }

      const editComments = await db`UPDATE comments
              SET comment = ${comment || checkVidID[0]?.comment}
              WHERE comments_id = ${id}`
    }
    res.json({
      message: 'Data updated',
      data: {
        id,
        ...req.body,
      },
    })
  } catch (err) {
    res.status(500).json({
      message: 'Server Error',
      serverMessage: `${err}`,
    })
  }
}

const deleteRecipes = async (req, res) => {
  try {
    const { id } = req.params
    const validator = await db`SELECT * FROM recipes WHERE recipes_id = ${id}`

    console.log(req.body)

    if (validator.length !== 0) {
      await db`DELETE FROM recipes WHERE recipes_id = ${id}`
    } else {
      res.status(403).json({
        message: 'ID not identified',
      })
    }
    res.json({
      status: 'true',
      message: 'DATA DELETED!',
    })
  } catch (err) {
    res.status(500).json({
      message: 'Server Error',
      serverMessage: `${err}`,
    })
  }
}

const deleteVideos = async (req, res) => {
  try {
    const { id } = req.params
    const validator =
      await db`SELECT * FROM recipe_videos WHERE videos_id = ${id}`

    console.log(req.body)

    if (validator.length !== 0) {
      await db`DELETE FROM recipe_videos WHERE videos_id = ${id}`
    } else {
      res.status(403).json({
        message: 'ID not identified',
      })
    }
    res.json({
      status: 'true',
      message: 'DATA DELETED!',
    })
  } catch (err) {
    res.status(500).json({
      message: 'Server Error',
      serverMessage: `${err}`,
    })
  }
}

const deletePhotos = async (req, res) => {
  try {
    const { id } = req.params
    const validator =
      await db`SELECT * FROM recipe_photos WHERE photos_id = ${id}`

    console.log(req.body)

    if (validator.length !== 0) {
      await db`DELETE FROM recipe_photos WHERE photos_id = ${id}`
    } else {
      res.status(403).json({
        message: 'ID not identified',
      })
    }
    res.json({
      status: 'true',
      message: 'DATA DELETED!',
    })
  } catch (err) {
    res.status(500).json({
      message: 'Server Error',
      serverMessage: `${err}`,
    })
  }
}

const deleteComments = async (req, res) => {
  try {
    const { id } = req.params
    const validator = await db`SELECT * FROM comments WHERE comments_id = ${id}`

    console.log(req.body)

    if (validator.length !== 0) {
      await db`DELETE FROM comments WHERE comments_id = ${id}`
    } else {
      res.status(403).json({
        message: 'ID not identified',
      })
    }
    res.json({
      status: 'true',
      message: 'DATA DELETED!',
    })
  } catch (err) {
    res.status(500).json({
      message: 'Server Error',
      serverMessage: `${err}`,
    })
  }
}

module.exports = {
  getAllRecipes,
  getAllRecipes2,
  addRecipes,
  addVideos,
  addPhotos,
  addComments,
  updateRecipes,
  deleteRecipes,
  deleteVideos,
  deletePhotos,
  deleteComments,
}

//      await db`SELECT accounts.username, recipes.title, recipes.ingredients, recipe_photos.photo, recipe_videos.video, comments.comment, recipes.created_at FROM recipes LEFT JOIN accounts ON recipes.accounts_id = accounts.accounts_id LEFT JOIN recipe_photos ON recipes.accounts_id = recipe_photos.accounts_id LEFT JOIN recipe_videos ON recipes.accounts_id = recipe_videos.accounts_id LEFT JOIN comments ON recipes.accounts_id = comments.accounts_id`
