const db = require('../config/database')

const checkValidUsers = async (params) => {
  const { checkLoggedEmail } = params

  return await db`SELECT email FROM accounts WHERE email = ${checkLoggedEmail}`
}

const checkRole = async (params) => {
  const { email } = params

  return await db`SELECT role FROM accounts WHERE email = ${email}`
}

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

  return await db`SELECT email FROM accounts WHERE email = ${email}`
}

const getUsername = async (params) => {
  const { username } = params

  return await db`SELECT username FROM accounts WHERE username = ${username}`
}

const getPhoneNumber = async (params) => {
  const { phone_number } = params

  return await db`SELECT phone_number FROM accounts WHERE phone_number = ${phone_number}`
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

const getUsersByEmail = async (params) => {
  const { email, limit, page } = params

  return await db`SELECT * FROM accounts WHERE email LIKE ${
    '%' + email + '%'
  } LIMIT ${limit} OFFSET ${limit * (page - 1)}`
}

const updateUsersPartial = async (params) => {
  const {
    email,
    phone_number,
    username,
    password,
    profile_picture,
    defaultValue,
    id,
  } = params

  return await db`UPDATE accounts
  SET email = ${email || defaultValue?.email},
   phone_number = ${phone_number || defaultValue?.phone_number},
   username = ${username || defaultValue?.username},
   password =${password || defaultValue?.password},
   profile_picture = ${profile_picture || defaultValue?.profile_picture},
   updated_at = NOW() AT TIME ZONE 'Asia/Jakarta'
  WHERE accounts_id = ${id} `
}

const deleteUsers = async (params) => {
  const { id } = params

  return await db`DELETE FROM accounts WHERE accounts_id = ${id}`
}

const createUsers = async (params) => {
  const {
    email,
    phone_number,
    username,
    password,
    profile_picture,
    defaultPicture,
  } = params

  return await db`INSERT INTO accounts ("email", "phone_number", "username", "password", "profile_picture") VALUES
  (${email}, ${phone_number}, ${username}, ${password}, ${
    profile_picture || defaultPicture
  })`
}

const getRoles = async (params) => {
  const { roleValidator } = params

  return await db`SELECT role from accounts WHERE accounts_id = ${roleValidator}`
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
  deleteUsers,
  getUsersByEmail,
  createUsers,
  checkRole,
  checkValidUsers,
  getRoles,
}
