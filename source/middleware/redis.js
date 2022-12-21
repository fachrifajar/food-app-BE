require('dotenv').config()
const Redis = require('ioredis')
// const { connect } = require('../routes/users')

const connectRedis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
})

const getReqAccountByID_Redis = async (req, res, next) => {
  try {
    const url = await connectRedis.get('url')
    const matchedUrl = url == req.originalUrl
    const find_users = await connectRedis.get('find_users')
    const find_all_users = await connectRedis.get('find_all_users')
    const id = await connectRedis.get('id_users')
    const page = await connectRedis.get('page')
    const limit = await connectRedis.get('limit')
    const isPaginated = await connectRedis.get('isPaginated')
    const isSorted = await connectRedis.get('isSorted')
    const getReqAccPagi = await connectRedis.get('getReqAccPagi')
    const dataPerPage = await connectRedis.get('dataPerPage')
    const sortedData = await connectRedis.get('sortedData')
    const getReqAccount = await connectRedis.get('getReqAccount')

    if (matchedUrl) {
      if (find_users && !find_all_users) {
        res.json({
          REDIS: true,
          message: `Get User With ID: ${id}`,
          total: JSON.parse(getReqAccount).length,
          data: JSON.parse(getReqAccount),
        })
      }
      if (find_all_users) {
        console.log('test bawah')
        res.json({
          REDIS: true,
          message: 'Success get all data users',
          total: JSON.parse(getReqAccount).length,
          data: JSON.parse(getReqAccount),
        })
      }
      if (isSorted) {
        res.json({
          REDIS: true,
          message:
            id !== null
              ? `Get User With ID: ${id}`
              : 'Success get all data users',
          total: JSON.parse(sortedData).length,
          data: JSON.parse(sortedData),
        })
      }
      if (isPaginated && !isSorted) {
        res.json({
          REDIS: true,
          message: 'success get data',
          total: JSON.parse(getReqAccPagi).length,
          dataPerPage: JSON.parse(dataPerPage).length,
          page: `${page} from ${Math.ceil(
            JSON.parse(getReqAccPagi).length / limit
          )}`,
          data: JSON.parse(dataPerPage),
        })
      }
    } else {
      next()
    }
  } catch (error) {
    res.status(500).json({
      message: `${error}`,
    })
  }
}

const getReqUsersByName_Redis = async (req, res, next) => {
  try {
    const getReqUsersByName_url = await connectRedis.get(
      'getReqUsersByName_url'
    )
    const getReqUsersByName_matchedUrl =
      getReqUsersByName_url == req.originalUrl
    const getReqUsersByName_getUsersData = await connectRedis.get(
      'getReqUsersByName_getUsersData'
    )
    const getReqUsersByName_username = await connectRedis.get(
      'getReqUsersByName_username'
    )
    if (getReqUsersByName_matchedUrl) {
      //getReqUsersByName
      res.json({
        REDIS: true,
        message: `Get ${
          JSON.parse(getReqUsersByName_getUsersData).length
        } User With initial username: ${getReqUsersByName_username}`,
        data: JSON.parse(getReqUsersByName_getUsersData),
      })
    } else {
      next()
    }
  } catch (error) {
    res.status(500).json({
      message: error,
    })
  }
}

const getReqUsersByEmail_Redis = async (req, res, next) => {
  try {
    const getReqUsersByEmail_url = await connectRedis.get(
      'getReqUsersByEmail_url'
    )
    const getReqUsersByEmail_matchedUrl =
      getReqUsersByEmail_url == req.originalUrl

    const getReqUsersByEmail_getUsersData = await connectRedis.get(
      'getReqUsersByEmail_getUsersData'
    )
    const getReqUsersByEmail_email = await connectRedis.get(
      'getReqUsersByEmail_email'
    )
    if (getReqUsersByEmail_matchedUrl) {
      res.json({
        REDIS: true,
        message: `Get ${
          JSON.parse(getReqUsersByEmail_getUsersData).length
        } email With initial: ${getReqUsersByEmail_email}`,
        data: JSON.parse(getReqUsersByEmail_getUsersData),
      })
    } else {
      next()
    }
  } catch (error) {
    res.status(500).json({
      message: error,
    })
  }
}

const getAllRecipes_Redis = async (req, res, next) => {
  try {
    const url = await connectRedis.get('url_getAllRecipes')
    const matchedUrl = url == req.originalUrl
    const title = await connectRedis.get('title_getAllRecipes')
    const data_find = await connectRedis.get('data_getAllRecipes')
    const is_title_getAllRecipes = await connectRedis.get(
      'is_title_getAllRecipes'
    )
    const total_find = await connectRedis.get('total_find')
    const is_getAllRecipes = await connectRedis.get('is_getAllRecipes')
    const is_paginated = await connectRedis.get('is_paginated')
    const is_sorted = await connectRedis.get('is_sorted')
    const data_paginated_getAllRecipes = await connectRedis.get(
      'data_paginated_getAllRecipes'
    )
    const total_paginated = await connectRedis.get('total_paginated')
    const dataPerPage = await connectRedis.get('dataPerPage')
    const page = await connectRedis.get('page')
    const limit = await connectRedis.get('limit')
    const data_sort = await connectRedis.get('data_sort')
    const total_data_sort = await connectRedis.get('total_data_sort')

    if (matchedUrl) {
      if (is_title_getAllRecipes) {
        res.json({
          REDIS: true,
          message: `Get Recipes With titles: ${title}`,
          total: total_find,
          data_find: JSON.parse(data_find),
        })
      }
      if (is_getAllRecipes) {
        res.json({
          REDIS: true,
          message: 'success get all data users',
          total: total_find,
          data: JSON.parse(data_find),
        })
      }
      if (is_paginated && is_sorted) {
        res.json({
          REDIS: true,
          message: 'success get all data users',
          total: total_paginated,
          dataPerPage: dataPerPage,
          page: `${page} from ${Math.ceil(total_paginated / limit)}`,
          data: JSON.parse(data_paginated_getAllRecipes),
        })
      }
      if (is_paginated) {
        res.json({
          REDIS: true,
          message: 'success get all data users',
          total: total_paginated,
          dataPerPage: dataPerPage,
          page: `${page} from ${Math.ceil(total_paginated / limit)}`,
          data: JSON.parse(data_paginated_getAllRecipes),
        })
      }
      if (is_sorted && !is_paginated) {
        res.json({
          REDIS: true,
          message: 'success get all data users (Descending)',
          total: total_data_sort,
          data: JSON.parse(data_sort),
        })
      }
    } else {
      next()
    }
  } catch (error) {
    res.status(500).json({
      message: error,
    })
  }
}

module.exports = {
  connectRedis,
  getReqAccountByID_Redis,
  getReqUsersByName_Redis,
  getReqUsersByEmail_Redis,
  getAllRecipes_Redis,
}
