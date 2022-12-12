const db = require('../config/database')
const models = require('../models/users')

const getReqAccountByID = async (req, res) => {
  try {
    const { id } = req.params
    const { page, limit, sort } = req.query
    const totalDatas = await models.getAllUsers()
    let getUsersData
    let getAllData

    if (id) {
      getUsersData = await models.getUsersByID({ id })
      if (getUsersData.length > 0) {
        res.json({ message: `Get User With ID: ${id}`, data: getUsersData })
      } else {
        throw { code: 422, message: 'Data not found' }
      }
    }
    if (!id && !page && !limit && !sort) {
      getUsersData = totalDatas
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
      } else if (sort) {
        getAllData = await models.getAllUsersSort({ sort })
        res.json({
          message: 'Success get all data users',
          total: getAllData.length,
          data: getAllData,
        })
      }
    }
    if ((page && limit && sort) || (page && limit)) {
      res.json({
        message: 'success get data',
        total: totalDatas.length,
        dataPerPage: getAllData.length,
        page: `${page} from ${Math.ceil(totalDatas.length / limit)}`,
        data: getAllData,
      })
    }
  } catch (err) {
    res.status(err?.code).json({
      serverMessage: err,
    })
  }
}

const getReqUsersByName = async (req, res) => {
  try {
    const { page, limit } = req.query
    const { username } = req.params
    const getUsersData = await models.getUsersByName({ username, limit, page })
    if (getUsersData.length !== 0) {
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
    const { email, phone_number, username, password } = req.body

    const addData = await models.createUsers({
      email,
      phone_number,
      username,
      password,
    })

    res.json({
      status: 'true',
      message: 'data collected',
      data: req.body,
    })
    console.log(req.body)
  } catch (error) {
    const { email, phone_number, username } = req.body

    if (error.code == 23505) {
      const getEmail = await models.getEmail({ email })
      const getUsername = await models.getUsername({ username })
      const getPhoneNumber = await models.getPhoneNumber({ phone_number })
      if (
        getEmail.length !== 0 &&
        getUsername.length !== 0 &&
        getPhoneNumber.length !== 0
      ) {
        res.status(409).json({
          message: 'email, username & phoneNumber taken!',
        })
      }
      if (
        getEmail.length == 0 &&
        getUsername.length !== 0 &&
        getPhoneNumber.length !== 0
      ) {
        res.status(409).json({
          message: 'phone number & username taken!',
        })
      }
      if (
        getEmail.length !== 0 &&
        getUsername.length == 0 &&
        getPhoneNumber.length !== 0
      ) {
        res.status(409).json({
          message: 'email & phone number taken!',
        })
      }
      if (
        getEmail.length !== 0 &&
        getUsername.length !== 0 &&
        getPhoneNumber.length == 0
      ) {
        res.status(409).json({
          message: 'email & username taken!',
        })
      }
      if (
        getEmail.length !== 0 &&
        getUsername.length == 0 &&
        getPhoneNumber.length == 0
      ) {
        res.status(409).json({
          message: 'email taken!',
        })
      }
      if (
        getEmail.length == 0 &&
        getUsername.length !== 0 &&
        getPhoneNumber.length == 0
      ) {
        res.status(409).json({
          message: 'username taken!',
        })
      }
      if (
        getEmail.length == 0 &&
        getUsername.length == 0 &&
        getPhoneNumber.length !== 0
      ) {
        res.status(409).json({
          message: 'phone number taken!',
        })
      }
    }
  }
}

const updateUsersPartial = async (req, res) => {
  try {
    const { id } = req.params
    const { email, phone_number, username, password, profile_picture } =
      req.body
    const getAllData = await models.getUsersByID({ id })

    if (getAllData.length == 0) {
      throw { code: 422, message: 'ID not identified' }
    }

    await models.updateUsersPartial({
      email,
      phone_number,
      username,
      password,
      profile_picture,
      id,
      getAllData,
    })

    res.json({
      status: 'true',
      message: 'data updated',
      data: {
        id,
        ...req.body,
      },
    })
  } catch (error) {
    const { email, phone_number, username } = req.body

    if (error.code == 23505) {
      const getEmail = await models.getEmail({ email })
      const getUsername = await models.getUsername({ username })
      const getPhoneNumber = await models.getPhoneNumber({ phone_number })

      if (
        getEmail.length !== 0 &&
        getUsername.length !== 0 &&
        getPhoneNumber.length !== 0
      ) {
        res.status(409).json({
          message: 'email, username & phoneNumber taken!',
        })
      }

      if (
        getEmail.length == 0 &&
        getUsername.length !== 0 &&
        getPhoneNumber.length !== 0 &&
        getEmail[0].email == email
      ) {
        res.status(409).json({
          message: 'phone number & username taken!',
        })
      }
      if (
        getEmail.length !== 0 &&
        getUsername.length == 0 &&
        getPhoneNumber.length !== 0 &&
        getUsername[0].username == username
      ) {
        res.status(409).json({
          message: 'email & phone number taken!',
        })
      }
      if (
        getEmail.length !== 0 &&
        getUsername.length !== 0 &&
        getPhoneNumber.length == 0
      ) {
        res.status(409).json({
          message: 'email & username taken!',
        })
      }
      if (
        getEmail.length !== 0 &&
        getUsername.length == 0 &&
        getPhoneNumber.length == 0
      ) {
        res.status(409).json({
          message: 'email taken!',
        })
      }
      if (
        getEmail.length == 0 &&
        getUsername.length !== 0 &&
        getPhoneNumber.length == 0
      ) {
        res.status(409).json({
          message: 'username taken!',
        })
      } else if (
        getEmail.length == 0 &&
        getUsername.length == 0 &&
        getPhoneNumber.length !== 0
      ) {
        res.status(409).json({
          message: 'phone number taken!',
        })
      }
    }
  }
}

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
    console.log(req.body)
    if (getAllData.length !== 0) {
      await models.deleteUsers({ id })
      res.json({
        status: 'true',
        message: 'DATA DELETED!',
      })
    } else {
      throw { code: 422, message: 'id not identified' }
    }

    console.log(req.body)
  } catch (err) {
    res.status(err.code ?? 500).json({
      message: err,
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
