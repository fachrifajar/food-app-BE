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
    const token = authHeaders.split(' ')[1]

    if (authHeaders) {
      jwt.verify(token, accToken, (err, decoded) => {
        if (err) {
          const refreshToken = req.cookies.refreshToken

          if (refreshToken) {
            jwt.verify(refreshToken, refToken, (err, decodedToken) => {
              if (err) {
                throw { code: 401, message: 'Refresh Token has expired' }
              }
              next()
            })
          } else {
            throw { code: 401, message: 'Token has expired' }
          }
        } else {
          const currentTimestamp = Date.now()
          const expirationTimestamp = decoded.iat + 20000 // 20 seconds
          // const expirationTimestamp = decoded.iat + 86400000 // 1 day
          if (currentTimestamp > expirationTimestamp) {
            throw { code: 401, message: 'Token has expired' }
          }

          next()
        }
      })
    } else {
      throw { code: 401, message: 'No Token Provided' }
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
          req.accounts_id = decoded.id
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

// const validateToken = (req, res, next) => {
//   try {
//     const authHeaders = req.headers['authorization']
//     const token = authHeaders && authHeaders.split(' ')[1]

//     if (authHeaders) {
//       jwt.verify(token, accToken, (err, decoded) => {
//         if (err) {
//           throw { code: 401, message: 'Token error, please try again!' }
//         }

//         const currentTimestamp = Date.now()

//         const expirationTimestamp = decoded.iat + 20000

//         console.log({ currentTimestamp, expirationTimestamp })

//         if (currentTimestamp > expirationTimestamp) {
//           const refreshToken = req.cookies.refreshToken
//           if (!refreshToken) {
//             throw { code: 401, message: 'Token has expired and refresh token is not provided' }
//           }

//           // Verify the refresh token
//           jwt.verify(refreshToken, refToken, (refreshErr, refreshDecoded) => {
//             if (refreshErr) {
//               throw { code: 401, message: 'Token has expired and refresh token is invalid' }
//             }

//             // Here, you can perform any additional checks on the refresh token, such as checking if it is associated with the user or if it's revoked.

//             // Generate a new access token
//             const newAccessToken = jwt.sign(
//               {
//                 id: refreshDecoded.id,
//                 name: refreshDecoded.name,
//                 email: refreshDecoded.email,
//               },
//               accToken,
//               { expiresIn: '20s' }
//             )

//             // Set the new access token in the request headers or response, depending on your implementation

//             next()
//           })
//         } else {
//           next()
//         }
//       })
//     } else {
//       throw { code: 401, message: 'No Token Provided' }
//     }
//   } catch (error) {
//     res.status(error?.code ?? 500).json({
//       message: error?.message ?? error,
//     })
//   }
// }
