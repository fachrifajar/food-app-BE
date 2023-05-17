require('dotenv').config()
const models = require('../models/auth')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const accToken = process.env.ACCESS_TOKEN_SECRET
const refToken = process.env.REFRESH_TOKEN_SECRET

const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const foundUsers = await models.getAllbyEmail({ email })
    const otherUsers = await models.getNotLikeAllUsers({ email })

    if (!foundUsers.length) {
      throw { code: 401, message: `Incorrect Email or Password` }
      // res.redirect('/users/register')
    } else {
      if (await bcrypt.compare(password, foundUsers[0]?.password)) {
        try {
          const accessToken = jwt.sign(
            {
              id: foundUsers[0]?.accounts_id,
              name: foundUsers[0]?.username,
              iat: new Date().getTime(),
            },
            accToken,
            { expiresIn: '20s' }
          )
          const refreshToken = jwt.sign(
            {
              id: foundUsers[0]?.accounts_id,
              name: foundUsers[0]?.username,
              iat: new Date().getTime(),
            },
            refToken,
            { expiresIn: '1d' }
          )
          await models.updateRefToken({ email: email, refreshToken })

          res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
          })

          res.json({
            message: `Success, User ${foundUsers[0].username} is logged in!`,
            data: {
              accessToken,
              refreshToken,
              profilePicture: foundUsers[0]?.profile_picture,
              accounts_id: foundUsers[0]?.accounts_id,
            },
          })
        } catch (error) {
          res.status(error?.code ?? 500).json({
            message: error,
          })
        }
      } else {
        throw { code: 401, message: 'Incorrect Email or Password' }
      }
    }
  } catch (error) {
    res.status(error?.code ?? 500).json({
      message: error,
    })
  }
}

const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) {
      throw { code: 401, message: 'Refresh token not provided' }
    }
    const user = await models.checkRefToken({ refreshToken })
    if (!user[0]) {
      throw { code: 403, message: 'Invalid refresh token' }
    }
    jwt.verify(refreshToken, refToken, (err, decoded) => {
      if (err) {
        console.error(err) // Log the error for debugging
        throw { code: 403, message: 'Failed to verify refresh token' }
      }
      const userId = user[0]?.accounts_id
      const name = user[0]?.username
      const iat = new Date().getTime()
      const accessToken = jwt.sign({ userId, name, iat }, accToken, {
        expiresIn: '12h',
      })
      res.json({ accessToken })
    })
  } catch (error) {
    console.error(error) // Log the error for debugging
    res.status(error?.code ?? 500).json({
      message: error?.message ?? 'Internal server error',
    })
  }
}

module.exports = { login, refreshToken }
