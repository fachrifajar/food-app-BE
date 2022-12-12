const db = require('../config/database')

const getAllUsers = async () => {
  return await db`SELECT * FROM accounts ORDER BY created_at ASC`
}

const getAllUsersSort = async (params) => {
  const { sort } = params

  return await db`SELECT * FROM accounts ${
    sort ? db`ORDER BY created_at DESC` : db`ORDER BY created_at ASC`
  } `
}

const getUsersByID = async (params) => {
  const { id } = params

  return await db`SELECT * FROM accounts WHERE accounts_id = ${id}`
}

const getEmail = async (params) => {
  const { email } = params

  return await db`SELECT * FROM accounts WHERE email = ${email}`
}

const getUsername = async (params) => {
  const { username } = params

  return await db`SELECT * FROM accounts WHERE username = ${username}`
}

const getPhoneNumber = async (params) => {
  const { phone_number } = params

  return await db`SELECT * FROM accounts WHERE phone_number = ${phone_number}`
}

const getAllUsersPaginationSort = async (params) => {
  const { limit, page, sort } = params

  return await db`SELECT * FROM accounts ${
    sort ? db`ORDER BY created_at DESC` : db`ORDER BY created_at ASC`
  } LIMIT ${limit} OFFSET ${limit * (page - 1)}`
}

const getAllUsersPagination = async (params) => {
  const { limit, page } = params

  return await db`SELECT * FROM accounts ORDER BY created_at ASC LIMIT ${limit} OFFSET ${
    limit * (page - 1)
  }`
}

const getUsersByName = async (params) => {
  const { username, limit, page } = params

  return await db`SELECT * FROM accounts WHERE username LIKE ${
    '%' + username + '%'
  } LIMIT ${limit} OFFSET ${limit * (page - 1)}`
}

const updateUsersPartial = async (params) => {
  const {
    email,
    phone_number,
    username,
    password,
    profile_picture,
    id,
    getAllData,
  } = params

  return await db`UPDATE accounts
  SET email = ${email || getAllData[0]?.email},
   phone_number = ${phone_number || getAllData[0]?.phone_number},
   username = ${username || getAllData[0]?.username},
   password =${password || getAllData[0]?.password},
   profile_picture = ${profile_picture || getAllData[0]?.profile_picture}
  WHERE accounts_id = ${id} `
}

module.exports = {
  getAllUsers,
  getUsersByID,
  getAllUsersPaginationSort,
  getAllUsersPagination,
  getAllUsersSort,
  getUsersByName,
  updateUsersPartial,
  getEmail,
  getUsername,
  getPhoneNumber,
}
