const db = require('../config/database')

const getAllbyEmail = async (params) => {
  const { email } = params

  return await db`SELECT * FROM accounts WHERE email = ${email}`
}

const getNotLikeAllUsers = async (params) => {
  const { email } = params

  return await db`SELECT * FROM accounts WHERE email NOT LIKE ${email}`
}

const updateRefToken = async (params) => {
  const { email, refreshToken } = params

  return await db`UPDATE accounts SET refresh_token = ${refreshToken} WHERE email = ${email}`
}

const checkRefToken = async (params) => {
  const { refreshToken } = params

  return await db`SELECT * FROM accounts WHERE refresh_token = ${refreshToken}`
}

module.exports = {
  getAllbyEmail,
  getNotLikeAllUsers,
  updateRefToken,
  checkRefToken,
}
