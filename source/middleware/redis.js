require('dotenv').config()
const Redis = require('ioredis')
// const { connect } = require('../routes/users')

const connectRedis = new Redis({
  host: 'redis-14261.c252.ap-southeast-1-1.ec2.cloud.redislabs.com',
  port: 14261,
  password: 'gMb1igrOFt3zCmk71YyJbRzct65fzezh',
})

const useRedis = async (req, res, next) => {
  try {
    //getReqAccountByID
    const url = await connectRedis.get('url')
    const matchedUrl = url == req.originalUrl
    const id = await connectRedis.get('id')
    const page = await connectRedis.get('page')
    const limit = await connectRedis.get('limit')
    const isPaginated = await connectRedis.get('isPaginated')
    const isSorted = await connectRedis.get('isSorted')
    const getReqAccPagi = await connectRedis.get('getReqAccPagi')
    const dataPerPage = await connectRedis.get('dataPerPage')
    const sortedData = await connectRedis.get('sortedData')
    const getReqAccount = await connectRedis.get('getReqAccount')

    //getReqUsersByName
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

    //getReqUsersByEmail
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

    console.log('test atas')

    if (matchedUrl) {
      //getReqAccountByID
      if (getReqAccount) {
        res.json({
          REDIS: true,
          message:
            id !== null
              ? `Get User With ID: ${id}`
              : 'Success get all data users',
          total: JSON.parse(getReqAccount).length,
          data: JSON.parse(getReqAccount),
        })
      }
      if (isPaginated || isSorted) {
        //getReqAccountByID
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
      if (isSorted && !isPaginated) {
        //getReqAccountByID
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
    }
    if (getReqUsersByName_matchedUrl) {
      //getReqUsersByName
      res.json({
        REDIS: true,
        message: `Get ${
          JSON.parse(getReqUsersByName_getUsersData).length
        } User With initial username: ${getReqUsersByName_username}`,
        data: JSON.parse(getReqUsersByName_getUsersData),
      })
    }
    if (getReqUsersByEmail_matchedUrl) {
      //getReqUsersByEmail
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

module.exports = { connectRedis, useRedis }
