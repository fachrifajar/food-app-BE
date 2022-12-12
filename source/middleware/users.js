const { Validator, addCustomMessages, extend } = require('node-input-validator')

const createUsersValidator = (req, res, next) => {
  extend('namePassswordValidator', () => {
    if (req.body.username !== req.body.password) {
      return true
    }
    return false
  })

  extend('regexUsername', () => {
    if (/^[a-zA-Z0-9]+$/g.test(req.body.username)) {
      return true
    } else {
      return false
    }
  })

  extend('regexPass', () => {
    if (
      /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(
        req.body.password
      )
    ) {
      return true
    } else {
      return false
    }
  })

  addCustomMessages({
    'username.namePassswordValidator': `Password can't contain username`,
    'password.regexUsername': `Username can only contain Alphanumeric Characters`,
    'password.regexPass': `Passwords must have at least 8 characters and contain uppercase letters, lowercase letters, numbers, and symbols`,
  })

  const rules = new Validator(req.body, {
    email: 'required|email|minLength:3|maxLength:30',
    phone_number: 'required|phoneNumber|minLength:7|maxLength:14',
    username:
      'required|minLength:5|maxLength:15|regexUsername|namePassswordValidator',
    password: 'required|regexPass|minLength:8|maxLength:20',
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

const updateUsersPartialValidator = (req, res, next) => {
  const { email, phone_number, username, password, profile_picture, id } =
    req.body

  extend('namePassswordValidator', () => {
    if (req.body.username !== req.body.password) {
      return true
    }
    return false
  })

  extend('regexUsername', () => {
    if (/^[a-zA-Z0-9]+$/g.test(req.body.username)) {
      return true
    } else {
      return false
    }
  })

  extend('regexPass', () => {
    if (
      /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(
        req.body.password
      )
    ) {
      return true
    } else {
      return false
    }
  })

  addCustomMessages({
    'username.namePassswordValidator': `Password can't contain username`,
    'password.regexUsername': `Username can only contain Alphanumeric Characters`,
    'password.regexPass': `Passwords must have at least 8 characters and contain uppercase letters, lowercase letters, numbers, and symbols`,
  })

  const rules = new Validator(req.body, {
    email: email == ''
      ? 'required|email|minLength:3|maxLength:30'
      : 'email|minLength:3|maxLength:20',
    phone_number: phone_number == ''
      ? 'required|phoneNumber|minLength:7|maxLength:14'
      : 'phoneNumber|minLength:7|maxLength:12',
    username: username == ''
      ? 'required|minLength:5|maxLength:15|regexUsername|namePassswordValidator'
      : 'minLength:5|maxLength:11|regexUsername|namePassswordValidator',
    password: password == ''
      ? 'required|regexPass|minLength:8|maxLength:20'
      : 'regexPass|minLength:8|maxLength:20',
    profile_picture: profile_picture ? 'required|url' : 'url',
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

const deleteUsersValidator = (req, res, next) => {
  const { id } = req.params

  const rules = new Validator(req.params, {
    id: 'required',
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

module.exports = {
  createUsersValidator,
  updateUsersPartialValidator,
  deleteUsersValidator,
}
