require('dotenv').config()
const { JsonWebTokenError } = require('jsonwebtoken')
const { Validator } = require('node-input-validator')
const jwt = require('jsonwebtoken')
const accToken = process.env.ACCESS_TOKEN_SECRET
const refToken = process.env.REFRESH_TOKEN_SECRET

const loginValidator = (req, res, next) => {
  const rules = new Validator(req.body, {
    email: 'required|email',
    password: 'required',
  })

  rules.check().then((matched) => {
    if (matched) {
      next()
    } else {
      res.status(422).json({
        message: rules.errors,
      })
    }
  })
}

const validateToken = (req, res, next) => {
  try {
    const authHeaders = req.headers['authorization']
    const token = authHeaders && authHeaders.split(' ')[1]
    // const { authorization } = req.headers

    if (authHeaders) {
      jwt.verify(token, accToken, (err, decoded) => {
        // console.log(decoded)
        if (err) {
          throw { code: 401, message: 'Token error, please try again!' }
        }
        // req.email = decoded.email
        next()
        // if (Date.now() - 100000 > decoded.exp) {
        //   throw { code: 401, message: 'Token Expired' }
        // }
      })
    } else {
      throw { code: 401, message: 'No Token Provide' }
    }
  } catch (error) {
    res.status(error?.code ?? 500).json({
      message: error?.message ?? error,
    })
  }
}

const validateRole = (req, res, next) => {
  try {
    const authHeaders = req.headers['authorization']
    const token = authHeaders && authHeaders.split(' ')[1]
    // const { authorization } = req.headers

    if (authHeaders) {
      jwt.verify(token, accToken, (err, decoded) => {
        if (err) throw { code: 401 }
        else {
          // return decoded.id
          req.userId = decoded.id
          next()
        }
      })
    } else {
      throw { code: 401, message: 'No Token Provide' }
    }
  } catch (error) {
    res.status(error?.code ?? 500).json({
      message: error?.message ?? error,
    })
  }
}

module.exports = { loginValidator, validateToken, validateRole }
