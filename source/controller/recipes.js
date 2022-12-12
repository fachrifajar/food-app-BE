const db = require('../config/database')
const models = require('../models/recipes')

const getAllRecipes = async (req, res) => {
  try {
    const { titlez } = req.params
    const { page, limit, sort } = req.query
    const totalDatas = await models.getAllRecipesRelation()
    let getUsersData
    let getAllData

    if (titlez) {
      getUsersData = await models.getRecipesByNameRelation({ title: titlez })
      if (getUsersData.length > 0) {
        res.json({
          message: `Get Recipes With titles: ${titlez}`,
          total: getUsersData.length,
          data: getUsersData,
        })
      } else {
        throw { code: 422, message: 'Data not found' }
      }
    }
    if (!titlez && !page && !limit && !sort) {
      getUsersData = totalDatas

      res.json({
        message: 'success get all data users',
        total: getUsersData.length,
        data: getUsersData,
      })
    }
    if (page || limit || sort) {
      if (page && limit && sort) {
        getAllData = await models.getAllRecipesRelationPaginationSort({
          sort,
          page,
          limit,
        })
      } else if (page && limit) {
        getAllData = await models.getAllRecipesRelationPagination({
          page,
          limit,
        })
      } else if (sort) {
        getAllData = await models.getAllRecipesRelationSort({ sort })
        res.json({
          message: 'success get all data users (Descending)',
          total: totalDatas.length,
          data: getAllData,
        })
      }
    }

    if ((page && limit && sort) || (page && limit)) {
      res.json({
        message: 'success get all data users',
        total: totalDatas.length,
        dataPerPage: getAllData.length,
        page: `${page} from ${Math.ceil(totalDatas.length / limit)}`,
        data: getAllData,
      })
    }
  } catch (err) {
    res.status(err.code ?? 500).json({
      message: err,
    })
  }
}

const getAllRecipes2 = async (req, res) => {
  try {
    const { titlez } = req.params
    const { page, limit, sortTitle } = req.query
    const totalDatas = await models.getAllRecipesTitleRelation()
    let getUsersData
    let getAllData

    if (titlez) {
      getUsersData = await models.getRecipesByNameRelation({ title: titlez })
      if (getUsersData.length > 0) {
        res.json({
          message: `Get Recipes With titles: ${titlez}`,
          total: getUsersData.length,
          data: getUsersData,
        })
      } else {
        throw { code: 422, message: 'Data not found' }
      }
    }
    if (!titlez && !page && !limit && !sortTitle) {
      getUsersData = totalDatas

      res.json({
        message: 'success get all data users',
        total: getUsersData.length,
        data: getUsersData,
      })
    }
    if (page || limit || sortTitle) {
      if (page && limit && sortTitle) {
        getAllData = await models.getAllRecipesTitleRelationPaginationSort({
          sortTitle,
          limit,
          page,
        })
      } else if (page && limit) {
        getAllData = await models.getAllRecipesTitleRelationPagination({
          limit,
          page,
        })
      } else if (sortTitle) {
        getAllData = await models.getAllRecipesTitleRelationSort({ sortTitle })
        res.json({
          message: 'success get data',
          total: totalDatas.length,
          data: getAllData,
        })
      }
    }
    if ((page && limit && sortTitle) || (page && limit)) {
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
    res.status(err.code ?? 500).json({
      message: err,
    })
  }
}

const addRecipes = async (req, res) => {
  try {
    const { accounts_id, title, ingredients } = req.body
    const checkID = await models.checkAccByID({ accounts_id })

    if (checkID.length == 0) {
      throw { code: 422, message: 'ID not identified' }
    }

    const addRecipes = await models.addRecipes({
      accounts_id,
      title,
      ingredients,
    })
    res.json({
      message: 'data collected',
      data: req.body,
    })
  } catch (error) {
    res.status(error.code ?? 500).json({
      message: error,
    })

    if (error.code == 23505) {
      const { title } = req.body
      const getTitle = await models.checkRecipesByTitle({ title })
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
    const checkRecipesID = await models.checkRecipesIDbyRecipesID({
      recipes_id,
    })
    const checkAccID = await models.checkAccIDByRecipesID({ recipes_id })

    if (checkRecipesID.length == 0) {
      throw { code: 422, message: 'ID not identified' }
    }

    const addVideo = models.addVideos({
      recipes_id,
      video,
      accounts_id: checkAccID[0].accounts_id,
      checkAccID,
    })
    res.json({
      message: 'data collected',
      data: req.body,
    })
  } catch (err) {
    res.status(err.code ?? 500).json({
      message: err,
    })
  }
}

const addPhotos = async (req, res) => {
  try {
    const { recipes_id, photo } = req.body
    const checkRecipesID = await models.checkRecipesIDbyRecipesID({
      recipes_id,
    })
    const checkAccID = await models.checkAccIDByRecipesID({ recipes_id })

    if (checkRecipesID.length == 0) {
      throw { code: 422, message: 'ID not identified' }
    }

    const addPhoto = await models.addPhotos({
      recipes_id,
      photo,
      accounts_id: checkAccID[0].accounts_id,
      checkAccID,
    })
    res.json({
      message: 'data collected',
      data: req.body,
    })
  } catch (err) {
    res.status(err.code ?? 500).json({
      message: err,
    })
  }
}

const addComments = async (req, res) => {
  try {
    const { id } = req.params
    const { recipes_id, comment } = req.body
    const checkRecipesID = await models.checkRecipesIDbyRecipesID({
      recipes_id,
    })
    const checkAccID = await models.checkAccIDByRecipesID({ recipes_id })

    if (checkRecipesID.length == 0) {
      throw { code: 422, message: 'ID not identified' }
    }

    const addcomment = await models.addComments({ recipes_id, comment, id })
    res.json({
      message: 'data collected',
      data: req.body,
    })
  } catch (err) {
    res.status(err.code ?? 500).json({
      message: err,
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
    const getAllData = await models.getRecipesByRecipesID({ id })

    if (
      (recipes_id || accounts_id || title || ingredients) !== undefined &&
      (photo || video) == undefined &&
      comment == undefined
    ) {
      if (getAllData.length == 0) {
        throw { code: 422, message: 'accounts_ID not identified' }
      }

      const editRecipes = await models.editRecipes({ title, ingredients, id })
    }
    if (
      (recipes_id || accounts_id || title || ingredients) == undefined &&
      (photo || video) !== undefined &&
      comment == undefined
    ) {
      const checkVidID = await models.checkVideosByID({ id })
      const checkPhtID = await models.checkPhotosByID({ id })

      if (photo !== undefined && video == undefined) {
        if (checkPhtID.length !== 1) {
          throw { code: 422, message: 'photos_ID not identified' }
        }
        const editPhotos = await models.editPhotos({ photo, checkPhtID, id })
      }

      if (video !== undefined && photo == undefined) {
        if (checkVidID.length !== 1) {
          throw { code: 422, message: 'videos_ID not identified' }
        }
        const editvideos = await models.editVideos({ video, checkVidID, id })
      }
    }
    if (
      (recipes_id || accounts_id || title || ingredients) == undefined &&
      (photo || video) == undefined &&
      comment !== undefined
    ) {
      const checkCommID = await models.checkComment({ id })

      if (checkCommID.length !== 1) {
        throw { code: 422, message: 'comments_ID not identified' }
      }

      const editComments = await models.editComments({
        comment,
        checkCommID,
        id,
      })
    }
    res.json({
      message: 'Data updated',
      data: {
        id,
        ...req.body,
      },
    })
  } catch (err) {
    res.status(err.code ?? 500).json({
      message: err,
    })
  }
}

const deleteRecipes = async (req, res) => {
  try {
    const { id } = req.params
    const validator = await models.getRecipesByRecipesID({ id })

    if (validator.length !== 0) {
      await models.deleteRecipes({ id })
    } else {
      res.status(422).json({
        message: 'Recipes_ID not identified',
      })
    }
    res.json({
      status: 'true',
      message: 'DATA DELETED!',
    })
  } catch (err) {
    res.status(500).json({
      message: 'Server Error',
      serverMessage: err,
    })
  }
}

const deleteVideos = async (req, res) => {
  try {
    const { id } = req.params
    const validator = await models.getRecipesVidByVidID({ id })

    console.log(req.body)

    if (validator.length !== 0) {
      await models.deleteVideos({ id })
    } else {
      res.status(422).json({
        message: 'Videos_ID not identified',
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
    const validator = await models.getRecipesPhtByPhtID({ id })

    console.log(req.body)

    if (validator.length !== 0) {
      await models.deletePhotos({ id })
    } else {
      res.status(422).json({
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
    const validator = await models.getCommentsByCommentsID({ id })

    if (validator.length !== 0) {
      await models.deleteComments({ id })
    } else {
      res.status(422).json({
        message: 'Comments_ID not identified',
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
