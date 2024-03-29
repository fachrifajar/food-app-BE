const db = require('../config/database')
const models = require('../models/recipes')
const { v4: uuidv4 } = require('uuid')
// const path = require('path')
// const { clearLine } = require('readline')
const { connectRedis } = require('../middleware/redis')
const { cloudinary } = require('../middleware/upload')

const getComments = async (req, res) => {
  try {
    const { id } = req.params

    const getCommentsData = await models.getComments({
      recipes_id: id,
    })

    if (getCommentsData) {
      res.json({
        data: getCommentsData,
      })
    } else {
      throw { code: 422, message: 'Data not found' }
    }
  } catch (err) {
    res.status(err.code ?? 500).json({
      message: err,
    })
  }
}

const getAllRecipes = async (req, res) => {
  try {
    const { titlez } = req.params
    const { page, limit, sort, sortType } = req.query
    const totalDatas = await models.getAllRecipesRelation()
    let getUsersData
    let getAllData

    if (titlez) {
      getUsersData = await models.getRecipesByNameRelation({ title: titlez })

      if (getUsersData.length > 0) {
        connectRedis.set('url_getAllRecipes', req.originalUrl, 'ex', 10)
        connectRedis.set('title_getAllRecipes', titlez, 'ex', 10)
        connectRedis.set(
          'data_getAllRecipes',
          JSON.stringify(getUsersData),
          'ex',
          10
        )
        connectRedis.set('is_title_getAllRecipes', true, 'ex', 10)
        connectRedis.set('total_find', getUsersData?.length, 'ex', 10)
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
      connectRedis.set('url_getAllRecipes', req.originalUrl, 'ex', 10)
      connectRedis.set('is_getAllRecipes', true, 'ex', 10)
      connectRedis.set('total_find', getUsersData?.length, 'ex', 10)
      connectRedis.set(
        'data_getAllRecipes',
        JSON.stringify(getUsersData),
        'ex',
        10
      )
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
          sortType,
        })
        connectRedis.set('url_getAllRecipes', req.originalUrl, 'ex', 10)
        connectRedis.set('is_paginated', true, 'ex', 10)
        connectRedis.set('is_sorted', true, 'ex', 10)
        connectRedis.set(
          'data_paginated_getAllRecipes',
          JSON.stringify(getAllData),
          'ex',
          10
        )
        connectRedis.set('total_paginated', totalDatas?.length, 'ex', 10)
        connectRedis.set('dataPerPage', getAllData?.length, 'ex', 10)
        connectRedis.set('page', page, 'ex', 10)
        connectRedis.set('limit', limit, 'ex', 10)
      } else if (page && limit) {
        getAllData = await models.getAllRecipesRelationPagination({
          page,
          limit,
        })
        connectRedis.set('url_getAllRecipes', req.originalUrl, 'ex', 10)
        connectRedis.set('is_paginated', true, 'ex', 10)
        connectRedis.set(
          'data_paginated_getAllRecipes',
          JSON.stringify(getAllData),
          'ex',
          10
        )
        connectRedis.set('total_paginated', totalDatas?.length, 'ex', 10)
        connectRedis.set('dataPerPage', getAllData?.length, 'ex', 10)
        connectRedis.set('page', page, 'ex', 10)
        connectRedis.set('limit', limit, 'ex', 10)
      } else if (sort) {
        getAllData = await models.getAllRecipesRelationSort({ sort, sortType })
        connectRedis.set('url_getAllRecipes', req.originalUrl, 'ex', 10)
        connectRedis.set('data_sort', JSON.stringify(getAllData), 'ex', 10)
        connectRedis.set('total_data_sort', getAllData?.length, 'ex', 10)
        connectRedis.set('is_sorted', true, 'ex', 10)
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

    // const getRecipesBySlug = await models.getRecipesBySlug({ slug: titlez })
    // res.json({
    //   message: `Get Recipes With titles: ${titlez}`,
    //   total: getUsersData.length,
    //   data: getUsersData,
    // })
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

const getMyRecipes = async (req, res) => {
  try {
    const { id } = req.params
    const { page, limit, sort, sortType } = req.query
    const getUsersData = await models.getMyRecipePagination({
      userId: id,
      page,
      limit,
      sort,
      sortType,
    })
    const totalDatas = await models.getMyRecipe({ userId: id })

    res.json({
      message: 'success get all data users',
      total: totalDatas.length,
      dataPerPage: getUsersData.length,
      page: `${page} from ${Math.ceil(totalDatas.length / limit)}`,
      data: getUsersData,
    })
  } catch (err) {
    res.status(err.code ?? 500).json({
      message: err,
    })
  }
}

const addRecipes = async (req, res) => {
  try {
    const { title, ingredients, photo } = req.body

    const roleValidator = req.accounts_id || null // middleware for roleValidator
    const getTitle = await models.checkRecipesByTitle({ title })
    console.log(getTitle)
    console.log('getTitle.length !== 0', getTitle.length !== 0)
    let titleConvert = title.replace(/ /g, '-').toLowerCase()
    let photoResult
    if (getTitle.length !== 0) {
      throw { code: 403, message: 'Title already exists' }
    }

    console.log('TESS')

    if (req.files) {
      let filePhoto = req.files.photo
      console.log('filePhoto===', filePhoto)
      cloudinary.v2.uploader.upload(
        filePhoto.tempFilePath,
        { public_id: uuidv4() },
        async function (error, result) {
          try {
            if (error) {
              throw 'Upload failed'
            }
            photoResult = result.public_id
            console.log('photoResult---', photoResult)
            await models.addRecipes({
              accounts_id: roleValidator,
              title,
              ingredients,
              slug: titleConvert,
              photo: photoResult,
            })
            console.log('test bawah')
            res.json({
              message: 'data collected',
              data: req.body,
            })
          } catch (error) {
            res.status(error?.code ?? 500).json({
              message: error,
            })
          }
        }
      )
    }
  } catch (error) {
    console.error(error)
    res.status(error.code ?? 500).json({
      message: error || 'Server Error',
    })
  }
}

const addVideos = async (req, res) => {
  try {
    const { recipes_id, video } = req.body
    const checkRecipesID = await models.checkRecipesIDbyRecipesID({
      recipes_id,
    })
    // const checkAccID = await models.checkAccIDByRecipesID({ recipes_id })

    // if (checkRecipesID.length == 0) {
    //   throw { code: 400, message: 'ID not identified' }
    // }

    const roleValidator = req.accounts_id || null // middleware for roleValidator
    const getRole = await models.getRoles({ roleValidator })
    const isAdmin = getRole[0]?.role

    const validateRecipesId = await models.validateRecipesId({ recipes_id })
    const recipesIdvalidator = validateRecipesId[0]?.accounts_id

    if (isAdmin == 'ADMIN' || roleValidator == recipesIdvalidator) {
      if (req.files) {
        let file = req.files.video

        cloudinary.v2.uploader.upload(
          file.tempFilePath,
          { resource_type: 'video', public_id: uuidv4() },
          async function (error, result) {
            try {
              if (error) {
                throw 'Upload failed'
              }
              await models.addVideos({
                recipes_id,
                video: result.public_id,
                accounts_id: roleValidator,
              })
              res.json({
                message: 'video uploaded',
                data: req.body,
              })
            } catch (error) {
              res.status(error.code ?? 500).json({
                message: error,
              })
            }
          }
        )
      }
    } else {
      throw {
        code: 401,
        message:
          'Access not granted, only admin & valid user can access this section!',
      }
    }
  } catch (error) {
    res.status(error.code ?? 500).json({
      message: error,
    })
  }
}

const addPhotos = async (req, res) => {
  try {
    const { recipes_id, photo } = req.body
    const checkRecipesID = await models.checkRecipesIDbyRecipesID({
      recipes_id,
    })

    const roleValidator = req.accounts_id || null // middleware for roleValidator
    const getRole = await models.getRoles({ roleValidator })
    const isAdmin = getRole[0]?.role

    const validateRecipesId = await models.validateRecipesId({ recipes_id })
    const recipesIdvalidator = validateRecipesId[0]?.accounts_id

    if (isAdmin == 'ADMIN' || roleValidator == recipesIdvalidator) {
      if (req.files) {
        let file = req.files.photo

        cloudinary.v2.uploader.upload(
          file.tempFilePath,
          { public_id: uuidv4() },
          async function (error, result) {
            try {
              if (error) {
                throw 'Upload failed'
              }

              await models.addPhotos({
                recipes_id,
                photo: result.public_id,
                accounts_id: roleValidator,
              })
              res.json({
                message: 'photo uploaded',
                data: req.body,
              })
            } catch (error) {
              res.status(error?.code ?? 500).json({
                message: error,
              })
            }
          }
        )
      }
    } else {
      throw {
        code: 401,
        message:
          'Access not granted, only admin & valid user can access this section!',
      }
    }
  } catch (err) {
    res.status(err?.code ?? 500).json({
      message: err,
    })
  }
}

const addComments = async (req, res) => {
  try {
    const { recipes_id, comment } = req.body
    const checkRecipesID = await models.checkRecipesIDbyRecipesID({
      recipes_id,
    })

    if (checkRecipesID.length == 0) {
      throw { code: 400, message: 'Recipes not identified' }
    }

    const roleValidator = req.accounts_id || null // middleware for roleValidator

    const addcomment = await models.addComments({
      recipes_id,
      comment,
      accounts_id: roleValidator,
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

const updateRecipes = async (req, res) => {
  try {
    const { recipes_id } = req.params
    const { title, ingredients, photo, video, slug } = req.body

    const getAllData = await models.getRecipesByRecipesID({ recipes_id })

    const roleValidator = req.accounts_id || null // middleware for roleValidator

    const getRole = await models.getRoles({ roleValidator })
    const isAdmin = getRole[0]?.role

    const validateRecipesId = await models.validateRecipesId({
      recipes_id,
    })

    const recipesIdvalidator = validateRecipesId[0]?.accounts_id

    let titleConvert
    if (title) {
      titleConvert = title.replace(/ /g, '-').toLowerCase()
    }
    const getTitle = await models.checkRecipesByTitle({ title })

    if (getTitle.length !== 0) {
      throw { code: 403, message: 'Title already exist' }
    }

    if (isAdmin == 'ADMIN' || roleValidator == recipesIdvalidator) {
      if (!req.files) {
        if (getAllData.length == 0) {
          throw { code: 400, message: 'recipes_id not identified' }
        }

        const editRecipes = await models.editRecipes({
          title,
          ingredients,
          recipes_id,
          slug: title ? titleConvert : null,
          getAllData: getAllData[0],
        })

        res.json({
          message: 'Data updated',
          data: {
            recipes_id,
            ...req.body,
          },
        })
      } else {
        const checkPhtID = await models.checkPhotosByID({ recipes_id })
        console.log(checkPhtID[0].photo)
        let file = req.files.photo
        let mimeType = file.mimetype.split('/')[1]
        let allowedFile = ['png', 'jpg', 'jpeg', 'PNG', 'JPG', 'JPEG']
        let MB = 2

        if (allowedFile.find((item) => item == mimeType)) {
          if (file.size > MB * 1024 * 1024) {
            const message =
              `Upload failed. ${file.name.toString()} is over the file size limit of ${MB} MB.`.replaceAll(
                ',',
                ', '
              )
            throw { code: 413, message }
          }

          cloudinary.v2.uploader.destroy(
            checkPhtID[0].photo,
            function (error, result) {
              console.log(result, error)
            }
          )

          cloudinary.v2.uploader.upload(
            file.tempFilePath,
            { public_id: uuidv4() },
            async function (error, result) {
              if (error) {
                // throw 'Upload failed'
                throw new Error(400)
              }

              await models.editPhotos({
                title,
                ingredients,
                recipes_id,
                slug: title ? titleConvert : null,
                getAllData: getAllData[0],
                photo: result.public_id,
              })
            }
          )
          res.json({
            status: 'true',
            message: 'photo updated',
            data: {
              recipes_id,
              ...req.body,
              ...req.files,
            },
          })
          return
        } else {
          const message =
            `Upload failed. Only ${allowedFile.toString()} files allowed.`.replaceAll(
              ',',
              ', '
            )
          throw { code: 422, message }
        }
      }
    } else {
      throw {
        code: 400,
        message:
          'Access not granted, only admin & valid user can access this section!',
      }
    }
  } catch (error) {
    res.status(error.code || 500).json({
      message: error,
    })
  }
}

const updateComments = async (req, res) => {
  try {
    const { id } = req.params //recipes_id or comments id
    const { comment } = req.body

    const roleValidator = req.accounts_id || null // middleware for roleValidator

    const getRole = await models.getRoles({ roleValidator })
    const isAdmin = getRole[0]?.role

    const validateCommentsId = await models.checkComment({ id })

    const commentsIdvalidator = validateCommentsId[0]?.accounts_id

    if (isAdmin == 'ADMIN' || roleValidator == commentsIdvalidator) {
      const checkCommID = await models.checkComment({ id })

      if (checkCommID.length !== 1) {
        throw { code: 400, message: 'comments_ID not identified' }
      }

      const editComments = await models.editComments({
        comment,
        checkCommID: checkCommID[0],
        id,
      })

      res.json({
        message: 'Data updated',
        data: {
          id,
          ...req.body,
        },
      })
    } else {
      throw {
        code: 400,
        message:
          'Access not granted, only admin & valid user can access this section!',
      }
    }
  } catch (err) {
    res.status(err.code ?? 500).json({
      message: err,
    })
  }
}

const deleteRecipes = async (req, res) => {
  try {
    const { id } = req.params
    console.log(id)
    const validator = await models.getRecipesByRecipesID({ recipes_id: id })
    console.log(validator)

    if (validator.length !== 0) {
      const checkPhtID = await models.checkPhotosByID({ recipes_id: id })
      console.log(checkPhtID)
      cloudinary.v2.uploader.destroy(
        checkPhtID[0].photo,
        function (error, result) {
          console.log(result, error)
        }
      )

      await models.deleteCommentsByRecipesId({ id })

      await models.deleteRecipes({ id })
    } else {
      res.status(400).json({
        message: 'Recipes_ID not identified',
      })
    }
    res.json({
      status: 'true',
      message: 'DATA DELETED!',
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({
      message: 'Server Error',
      serverMessage: err.message,
    })
  }
}

const deleteVideos = async (req, res) => {
  try {
    const { id } = req.params
    const validator = await models.getRecipesVidByVidID({ id })
    console.log(validator)
    if (validator.length !== 0) {
      cloudinary.v2.uploader.destroy(
        validator[0].video,
        { resource_type: 'video' },
        function (error, result) {
          console.log(result, error)
        }
      )
      await models.deleteVideos({ id })
    } else {
      res.status(400).json({
        message: 'Videos_ID not identified',
      })
    }
    res.json({
      status: 'true',
      message: 'Video successfully deleted',
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

    if (validator.length !== 0) {
      cloudinary.v2.uploader.destroy(
        validator[0].photo,
        function (error, result) {
          console.log(result, error)
        }
      )
      await models.deletePhotos({ id })
    } else {
      res.status(400).json({
        message: 'photos_ID not identified',
      })
    }
    res.json({
      status: 'true',
      message: 'Image successfully deleted',
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
      res.status(400).json({
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

const updateSave = async (req, res) => {
  try {
    const { id } = req.params //recipes_id
    const {
      recipes_id,
      accounts_id,
      title,
      ingredients,
      photo,
      video,
      comment,
      slug,
    } = req.body
    console.log('test1')
    const getAllData = await models.getRecipesByRecipesID({ id })
    // let titleConvert = title.replace(/ /g, '-').toLowerCase()
    console.log('test2')
    const roleValidator = req.accounts_id || null // middleware for roleValidator
    console.log('test3')
    const getRole = await models.getRoles({ roleValidator })
    const isAdmin = getRole[0]?.role

    const validateRecipesId = await models.validateRecipesId({
      recipes_id: id,
    })
    const recipesIdvalidator = validateRecipesId[0]?.accounts_id

    if (isAdmin == 'ADMIN' || roleValidator == recipesIdvalidator) {
      if (!req.files) {
        if (
          (recipes_id || accounts_id || title || ingredients) !== undefined &&
          (photo || video) == undefined &&
          comment == undefined
        ) {
          if (getAllData.length == 0) {
            throw { code: 400, message: 'accounts_ID not identified' }
          }
          const editRecipes = await models.editRecipes({
            title,
            ingredients,
            id,
            slug: titleConvert,
            getAllData: getAllData[0],
          })
        }

        if (
          (recipes_id || accounts_id || title || ingredients) == undefined &&
          (photo || video) == undefined &&
          comment !== undefined
        ) {
          const checkCommID = await models.checkComment({ id })

          if (checkCommID.length !== 1) {
            throw { code: 400, message: 'comments_ID not identified' }
          }

          const editComments = await models.editComments({
            comment,
            checkCommID: checkCommID[0],
            id,
          })
        }
      } else {
        if (
          (recipes_id || accounts_id || title || ingredients) == undefined &&
          (req.files.photo || req.files.video) !== undefined &&
          comment == undefined
        ) {
          const checkPhtID = await models.checkPhotosByID({ id })
          if (req.files.photo !== undefined && req.files.video == undefined) {
            if (checkPhtID.length !== 1) {
              throw { code: 400, message: 'photos_ID not identified' }
            } else {
              let file = req.files.photo
              let mimeType = file.mimetype.split('/')[1]
              let allowedFile = ['png', 'jpg', 'jpeg', 'PNG', 'JPG', 'JPEG']
              let MB = 2

              if (allowedFile.find((item) => item == mimeType)) {
                if (file.size > MB * 1024 * 1024) {
                  const message =
                    `Upload failed. ${file.name.toString()} is over the file size limit of ${MB} MB.`.replaceAll(
                      ',',
                      ', '
                    )
                  throw { code: 413, message }
                }

                cloudinary.v2.uploader.destroy(
                  checkPhtID[0].photo,
                  function (error, result) {
                    console.log(result, error)
                  }
                )

                cloudinary.v2.uploader.upload(
                  file.tempFilePath,
                  { public_id: uuidv4() },
                  async function (error, result) {
                    if (error) {
                      // throw 'Upload failed'
                      throw new Error(400)
                    }

                    await models.editPhotos({
                      photo: result.public_id,
                      checkPhtID,
                      id,
                    })
                  }
                )
                res.json({
                  status: 'true',
                  message: 'photo updated',
                  data: {
                    id,
                    ...req.body,
                  },
                })
              } else {
                const message =
                  `Upload failed. Only ${allowedFile.toString()} files allowed.`.replaceAll(
                    ',',
                    ', '
                  )
                throw { code: 422, message }
              }
            }
          }

          if (req.files.video !== undefined && req.files.photo == undefined) {
            const checkVidID = await models.checkVideosByID({ id })
            if (checkVidID.length !== 1) {
              throw { code: 400, message: 'videos_ID not identified' }
            } else {
              let file = req.files.video
              let mimeType = file.name.split('.')[1]
              let allowedVid = ['mp4', 'mkv', 'MP4', 'MKV']
              let MB = 200

              if (allowedVid.find((item) => item == mimeType)) {
                if (file.size > MB * 1024 * 1024) {
                  const message =
                    `Upload failed. ${file.name.toString()} is over the file size limit of ${MB} MB.`.replaceAll(
                      ',',
                      ', '
                    )
                  throw { code: 413, message }
                }

                cloudinary.v2.uploader.destroy(
                  checkVidID[0].video,
                  { resource_type: 'video' },
                  function (error, result) {
                    console.log(result, error)
                  }
                )

                cloudinary.v2.uploader.upload(
                  file.tempFilePath,
                  { resource_type: 'video', public_id: uuidv4() },
                  async function (error, result) {
                    if (error) {
                      throw 'Upload failed'
                    }
                    const editvideos = await models.editVideos({
                      video: result.public_id,
                      checkVidID,
                      id,
                    })
                  }
                )
                res.json({
                  status: 'true',
                  message: 'video updated',
                  data: {
                    id,
                    ...req.body,
                  },
                })
              } else {
                const message =
                  `Upload failed. Only ${allowedVid.toString()} files allowed.`.replaceAll(
                    ',',
                    ', '
                  )
                throw { code: 422, message }
              }
            }
          }
        }
      }

      res.json({
        message: 'Data updated',
        data: {
          id,
          ...req.body,
        },
      })
    } else {
      throw {
        code: 401,
        message:
          'Access not granted, only admin & valid user can access this section!',
      }
    }
  } catch (err) {
    res.status(err.code ?? 500).json({
      message: err,
    })
  }
}

const updateLoveRecipe = async (req, res) => {
  try {
    const { recipes_id } = req.body

    const id = req.accounts_id || null

    const checkLove = await models.checkLoveRecipe({ recipes_id, id })

    if (checkLove === true) {
      const remove = await models.addUnloveRecipe({ recipes_id, id })
      res.status(201).json({
        code: 201,
        message: 'Success remove love recipes',
        data: req.body,
      })
    } else {
      const add = await models.addLoveRecipe({ recipes_id, id })
      res.status(201).json({
        code: 201,
        message: 'Success add love recipes',
        data: req.body,
      })
    }
  } catch (error) {
    console.error(error)
    res.status(error?.code ?? 500).json({
      message: error,
    })
  }
}

const getLoveRecipe = async (req, res) => {
  try {
    const id = req.accounts_id || null

    const response = await models.getLoveRecipe({ id })

    if (response.length) {
      res.json({
        data: response,
      })
    } else {
      throw { code: 422, message: 'Data not found' }
    }
  } catch (error) {
    res.status(error.code ?? 500).json({
      message: error,
    })
  }
}

const getCountLove = async (req, res) => {
  try {
    const { recipes_id } = req.params

    const response = await models.getLoveRecipeCount({ recipes_id })

    res.json({
      data: response[0]?.love,
    })
  } catch (error) {
    res.status(error.code ?? 500).json({
      message: error,
    })
  }
}

const getValidateLove = async (req, res) => {
  try {
    const { recipes_id } = req.params

    const id = req.accounts_id || null

    const checkLove = await models.checkLoveRecipe({ recipes_id, id })

    res.json({
      data: checkLove,
    })
  } catch (error) {
    res.status(error.code ?? 500).json({
      message: error,
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
  getMyRecipes,
  updateSave,
  getComments,
  updateLoveRecipe,
  getLoveRecipe,
  getCountLove,
  getValidateLove,
  updateComments,
}
