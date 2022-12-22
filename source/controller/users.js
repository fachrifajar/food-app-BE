const db = require('../config/database')
const models = require('../models/users')
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcrypt')
const saltRounds = 10
const { connectRedis } = require('../middleware/redis')
const { cloudinary } = require('../middleware/upload')
const { signedCookie } = require('cookie-parser')

const getReqAccountByID = async (req, res) => {
  try {
    const { id } = req.params
    const { page, limit, sort } = req.query

    const totalDatas = await models.getAllUsers()

    let getUsersData
    let getAllData

    if (id) {
      getUsersData = await models.getUsersByID({ id })
      connectRedis.set('find_users', true, 'ex', 10)
      connectRedis.set('url', req.originalUrl, 'ex', 10)
      connectRedis.set('id_users', id, 'ex', 10)
      connectRedis.set('getReqAccount', JSON.stringify(getUsersData), 'ex', 10)
      if (getUsersData.length > 0) {
        res.json({ message: `Get User With ID: ${id}`, data: getUsersData })
      } else {
        throw { code: 422, message: 'Data not found' }
      }
    }
    if (!id && !page && !limit && !sort) {
      getUsersData = totalDatas
      connectRedis.set('url', req.originalUrl, 'ex', 10)
      connectRedis.set('find_all_users', true, 'ex', 10)
      connectRedis.set('getReqAccount', JSON.stringify(getUsersData), 'ex', 10)
      res.json({
        message: 'Success get all data users',
        total: getUsersData.length,
        data: getUsersData,
      })
    }
    if (page || limit || sort) {
      if (page && limit && sort) {
        getAllData = await models.getAllUsersPaginationSort({
          sort,
          limit,
          page,
        })
      } else if (page && limit) {
        getAllData = await models.getAllUsersPagination({ limit, page })
        connectRedis.set('url', req.originalUrl, 'ex', 10)
        connectRedis.set('page', page, 'ex', 10)
        connectRedis.set('limit', limit, 'ex', 10)
        connectRedis.set('dataPerPage', JSON.stringify(getAllData), 'ex', 10)
        connectRedis.set('getReqAccPagi', JSON.stringify(totalDatas), 'ex', 10)
        connectRedis.set('isPaginated', true, 'ex', 10)
      } else if (sort) {
        getAllData = await models.getAllUsersSort({ sort })
        connectRedis.set('url', req.originalUrl, 'ex', 10)
        connectRedis.set('isSorted', true, 'ex', 10)
        connectRedis.set('sortedData', JSON.stringify(getAllData), 'ex', 10)
        res.json({
          message: 'Success get all data users',
          total: getAllData.length,
          data: getAllData,
        })
      }
    }

    if ((page && limit && sort) || (page && limit)) {
      connectRedis.set('url', req.originalUrl, 'ex', 10)
      connectRedis.set('page', page, 'ex', 10)
      connectRedis.set('limit', limit, 'ex', 10)
      connectRedis.set('dataPerPage', JSON.stringify(getAllData), 'ex', 10)
      connectRedis.set('getReqAccPagi', JSON.stringify(totalDatas), 'ex', 10)
      connectRedis.set('isPaginated', true, 'ex', 10)
      res.json({
        message: 'success get data',
        total: totalDatas.length,
        dataPerPage: getAllData.length,
        page: `${page} from ${Math.ceil(totalDatas.length / limit)}`,
        data: getAllData,
      })
    }
  } catch (error) {
    res.status(error?.code ?? 500).json({
      serverMessage: error,
    })
  }
}

const getReqUsersByName = async (req, res) => {
  try {
    const { page, limit } = req.query
    const { username } = req.params
    const getUsersData = await models.getUsersByName({ username, limit, page })
    if (getUsersData.length !== 0) {
      connectRedis.set('getReqUsersByName_url', req.originalUrl, 'ex', 10)
      connectRedis.set(
        'getReqUsersByName_getUsersData',
        JSON.stringify(getUsersData),
        'ex',
        10
      )
      connectRedis.set('getReqUsersByName_username', username, 'ex', 10)
      res.json({
        message: `Get ${getUsersData.length} User With initial username: ${username}`,
        data: getUsersData,
      })
    } else {
      throw { code: 422, message: 'Data not found' }
    }
  } catch (err) {
    res.status(500).json({
      message: err,
    })
  }
}

const getReqUsersByEmail = async (req, res) => {
  try {
    const { page, limit } = req.query
    const { email } = req.params
    const getUsersData = await models.getUsersByEmail({ email, page, limit })

    if (getUsersData.length !== 0) {
      connectRedis.set('getReqUsersByEmail_url', req.originalUrl, 'ex', 10)
      connectRedis.set(
        'getReqUsersByEmail_getUsersData',
        JSON.stringify(getUsersData),
        'ex',
        10
      )
      connectRedis.set('getReqUsersByEmail_email', email, 'ex', 10)
      res.json({
        message: `Get ${getUsersData.length} email With initial: ${email}`,
        data: getUsersData,
      })
    } else {
      throw { code: 422, message: 'Data not found' }
    }
  } catch (err) {
    res.status(500).json({
      serverMessage: `${err}`,
    })
  }
}

const createUsers = async (req, res) => {
  try {
    const { email, phone_number, username, password, profile_picture } =
      req.body
    const salt = await bcrypt.genSalt(saltRounds)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    const getEmail = await models.getEmail({ email })
    const getUsername = await models.getUsername({ username })
    const getPhoneNumber = await models.getPhoneNumber({ phone_number })
    if (
      getEmail.length !== 0 &&
      getUsername.length !== 0 &&
      getPhoneNumber.length !== 0
    ) {
      throw {
        code: 409,
        message:
          'User with the provided email, username & phoneNumber already exists',
      }
    }
    if (
      getEmail.length == 0 &&
      getUsername.length !== 0 &&
      getPhoneNumber.length !== 0
    ) {
      throw {
        code: 409,
        message:
          'User with the provided phone number & username already exists',
      }
    }
    if (
      getEmail.length !== 0 &&
      getUsername.length == 0 &&
      getPhoneNumber.length !== 0
    ) {
      throw {
        code: 409,
        message: 'User with the provided email & phone number already exists',
      }
    }
    if (
      getEmail.length !== 0 &&
      getUsername.length !== 0 &&
      getPhoneNumber.length == 0
    ) {
      throw {
        code: 409,
        message: 'User with the provided email & username already exists',
      }
    }
    if (
      getEmail.length !== 0 &&
      getUsername.length == 0 &&
      getPhoneNumber.length == 0
    ) {
      throw {
        code: 409,
        message: 'User with the provided email already exists',
      }
    }
    if (
      getEmail.length == 0 &&
      getUsername.length !== 0 &&
      getPhoneNumber.length == 0
    ) {
      throw {
        code: 409,
        message: 'User with the provided username already exists',
      }
    }
    if (
      getEmail.length == 0 &&
      getUsername.length == 0 &&
      getPhoneNumber.length !== 0
    ) {
      throw {
        code: 409,
        message: 'User with the provided phone number already exists',
      }
    }

    if (!req.files) {
      const addData = await models.createUsers({
        email,
        phone_number,
        username,
        password: hashedPassword,
        profile_picture,
        defaultPicture:
          'https://res.cloudinary.com/daouvimjz/image/upload/v1671522875/Instagram_default_profile_kynrq6.jpg',
      })

      res.status(201).json({
        status: 'true',
        message: 'Success Create New Account',
        data: req.body.email,
      })
    } else {
      // The name of the input field (i.e. "file") is used to retrieve the uploaded file
      let file = req.files.profile_picture
      // let fileName = `${uuidv4()}-${file.name}`
      // let rootDir = path.dirname(require.main.filename)
      // console.log(file)
      // let uploadPath = `${rootDir}/images/users/${fileName}`

      cloudinary.v2.uploader.upload(
        file.tempFilePath,
        { public_id: uuidv4() },
        function (error, result) {
          if (error) {
            throw 'Upload failed'
          }

          // Use the mv() method to place the file somewhere on your server
          // file.mv(uploadPath, async function (err) {
          //   if (err) {
          //     throw { message: 'Upload failed' }
          //   }

          bcrypt.hash(password, saltRounds, async function (err, hash) {
            try {
              if (err) {
                throw 'Failed Authenticate, please try again'
              }

              const addData = await models.createUsers({
                email,
                phone_number,
                username,
                password: hash,
                // profile_picture: `/static/users/${fileName}`,
                profile_picture: result.public_id,
                defaultPicture:
                  'https://res.cloudinary.com/daouvimjz/image/upload/v1671522875/Instagram_default_profile_kynrq6.jpg',
              })

              res.status(201).json({
                status: 'true',
                message: 'Success Create New Account',
                data: req.body.email,
              })
            } catch (error) {
              res.status(error?.code ?? 500).json({
                message: error,
              })
            }
          })
          // })
        }
      )
    }
  } catch (error) {
    res.status(error?.code ?? 500).json({
      message: error,
    })
  }
}

const updateUsersPartial = async (req, res) => {
  try {
    const { id } = req.params
    const { email, phone_number, username, password, profile_picture } =
      req.body

    const checkId = id
    const roleValidator = req.userId

    if (checkId == roleValidator) {
      const getAllData = await models.getUsersByID({ id })

      if (!req.files) {
        if (getAllData.length == 0) {
          throw { code: 400, message: 'ID not identified' }
        } else {
          if (password == undefined) {
            await models.updateUsersPartial({
              email,
              defaultValue: getAllData[0],
              phone_number,
              username,
              password,
              profile_picture,
              id,
            })
          } else {
            bcrypt.hash(password, saltRounds, async function (err, hash) {
              try {
                if (err) {
                  throw 'Failed Authenticate, please try again'
                  // throw new Error(400)
                }
                await models.updateUsersPartial({
                  email,
                  defaultValue: getAllData[0],
                  phone_number,
                  username,
                  password: hash,
                  profile_picture,
                  id,
                })
              } catch (error) {
                res.status(error?.code ?? 500).json({
                  message: error.message ?? error,
                })
              }
            })
          }

          res.json({
            status: 'true',
            message: 'data updated',
            data: {
              id,
              ...req.body,
            },
          })
        }
      } else {
        if (getAllData.length == 0) {
          throw { code: 400, message: 'ID not identified' }
        } else {
          if (password == undefined) {
            let file = req.files.profile_picture

            cloudinary.v2.uploader.destroy(
              getAllData[0].profile_picture,
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

                await models.updateUsersPartial({
                  email,
                  defaultValue: getAllData[0],
                  phone_number,
                  username,
                  password,
                  profile_picture: result.public_id,
                  id,
                })
              }
            )
          } else {
            let file = req.files.profile_picture

            cloudinary.v2.uploader.destroy(
              getAllData[0].profile_picture,
              function (error, result) {
                console.log(result, error)
              }
            )

            cloudinary.v2.uploader.upload(
              file.tempFilePath,
              { public_id: uuidv4() },
              async function (error, result) {
                if (error) {
                  throw 'Upload failed'
                }
                bcrypt.hash(password, saltRounds, async function (err, hash) {
                  try {
                    if (err) {
                      throw 'Failed Authenticate, please try again'
                    }

                    await models.updateUsersPartial({
                      email,
                      defaultValue: getAllData[0],
                      phone_number,
                      username,
                      password: hash,
                      profile_picture: result.public_id,
                      id,
                    })
                  } catch (error) {
                    res.status(500).json({
                      message: error.message,
                    })
                  }
                })
              }
            )
          }

          res.json({
            status: 'true',
            message: 'data updated',
            data: {
              id,
              ...req.body,
            },
            profile_picture: req.files.profile_picture.name,
          })
        }
      }
    } else {
      throw { code: 401 }
    }
  } catch (error) {
    if (error.code !== 500) {
      if (
        error.message ==
        'duplicate key value violates unique constraint "users_email_key"'
      ) {
        res.status(422).json({
          message: 'User with the provided email already exists',
        })
      }
      if (
        error.message ==
        'duplicate key value violates unique constraint "users_username_key"'
      ) {
        res.status(422).json({
          message: 'User with the provided username already exists',
        })
      }
      if (
        error.message ==
        'duplicate key value violates unique constraint "users_phone_number_key"'
      ) {
        res.status(422).json({
          message: 'User with the provided phone number already exists',
        })
      } else {
        res.status(error?.code ?? 500).json({
          message: error.message ?? error,
        })
      }
    } else {
      res.status(500).json({
        message: error.message,
      })
    }
  }
}

//tidak di update, karena tidak digunakan
const updateUsers = async (req, res) => {
  try {
    const { id } = req.params
    const { email, phone_number, username, password, profile_picture } =
      req.body
    const getAllData =
      await db`SELECT * FROM accounts WHERE accounts_id = ${id}`

    const regexPassword =
      /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/
    const regexEmail =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i
    const regexUsername = /^[a-zA-Z0-9]+$/g
    // const regexURL = /(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/g

    if (getAllData) {
      if (profile_picture) {
        if (profile_picture.length < 10) {
          return res.status(403).json({
            message: 'please insert correct link',
          })
        }
      } else if (profile_picture == '') {
        return res.status(403).json({
          message: "Profile_picture can't be empty",
        })
      }

      if (username) {
        if (
          regexUsername.test(username) == false ||
          username.length < 5 ||
          username.length > 11
        ) {
          return res.status(403).json({
            message:
              'Username must have at least 5 characters and lower than 10 characters and contain uppercase letters or lowercase letters or numbers.',
          })
        }
      } else if (username == '') {
        return res.status(403).json({
          message: "Username can't be empty",
        })
      }

      if (email) {
        if (!regexEmail.test(email)) {
          return res.status(403).json({
            message: 'please input correct email address',
          })
        }
      } else if (email == '') {
        return res.status(403).json({
          message: "Email can't be empty",
        })
      }

      if (phone_number) {
        if (isNaN(phone_number)) {
          return res.status(403).json({
            message: "phone numbers can't contain letters",
          })
        }
        if (phone_number.length < 10 || phone_number.toString().length > 14) {
          return res.status(403).json({
            message: 'please input correct phone numbers',
          })
        }
      } else if (phone_number == '') {
        return res.status(403).json({
          message: "Phone number can't empty",
        })
      }

      if (password) {
        if (!regexPassword.test(password)) {
          return res.status(403).json({
            message:
              'Passwords must have at least 8 characters and contain uppercase letters, lowercase letters, numbers, and symbols.',
          })
        }
      } else if (password == '') {
        return res.status(403).json({
          message: "Password can't be empty",
        })
      }

      await db`UPDATE accounts
        SET email = ${email || getAllData[0]?.email},
         phone_number = ${phone_number || getAllData[0]?.phone_number},
         username = ${username || getAllData[0]?.username},
         password =${password || getAllData[0]?.password},
         profile_picture = ${profile_picture || getAllData[0]?.profile_picture}
        WHERE accounts_id = ${id} `
    } else {
      throw 'ID not identified'
    }

    res.json({
      status: 'true',
      message: 'data updated',
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

const deleteUsers = async (req, res) => {
  try {
    const { id } = req.params
    const getAllData = await models.getUsersByID({ id })

    await models.deleteUsers({ id })
    res.json({
      status: 'true',
      message: 'DATA DELETED!',
    })
  } catch (error) {
    res.status(500).json({
      message: error,
    })
  }
}

module.exports = {
  getReqAccountByID,
  getReqUsersByName,
  getReqUsersByEmail,
  createUsers,
  updateUsersPartial,
  updateUsers,
  deleteUsers,
}
