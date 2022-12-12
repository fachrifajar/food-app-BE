const { Validator, addCustomMessages, extend } = require('node-input-validator')

const createRecipesValidator = (req, res, next) => {
  const rules = new Validator(req.body, {
    accounts_id: 'required',
    title: 'required|minLength:4|maxLength:20',
    ingredients: 'required|minLength:5',
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

const addVideosValidator = (req, res, next) => {
  const rules = new Validator(req.body, {
    recipes_id: 'required',
    video: 'required|url',
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

const addPhotoValidator = (req, res, next) => {
  const rules = new Validator(req.body, {
    recipes_id: 'required',
    photo: 'required|url',
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

const addCommentValidator = (req, res, next) => {
  const rules = new Validator(req.body, {
    recipes_id: 'required',
    comment: 'required',
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

const updateRecipesValidator = (req, res, next) => {
  const { recipes_id, accounts_id, title, ingredients, photo, video, comment } =
    req.body

  extend('recipesIDValidator', () => {
    if (req.body.recipes_id.length > 0) {
      return false
    }
    return true
  })

  extend('accountsIDValidator', () => {
    if (req.body.accounts_id.length > 0) {
      return false
    }
    return true
  })

  extend('titleValidator', () => {
    if (req.body.title.length == 0) {
      return false
    }
    return true
  })

  addCustomMessages({
    'recipes_id.recipesIDValidator': `CAN'T CHANGE THIS CONTENT`,
    'accounts_id.accountsIDValidator': `CAN'T CHANGE THIS CONTENT`,
  })

  const rules = new Validator(req.body, {
    recipes_id: recipes_id == '' ? 'recipesIDValidator' : 'recipesIDValidator',
    accounts_id:
      accounts_id == '' ? 'accountsIDValidator' : 'accountsIDValidator',
    title:
      title == ''
        ? 'required|minLength:5|maxLength:20'
        : 'minLength:5|maxLength:20',
    ingredients: ingredients == '' ? 'required|minLength:10' : 'minLength:10',
    photo: photo == '' ? 'required|url' : 'url',
    video: video == '' ? 'required|url' : 'url',
    comment: comment == '' ? 'required|minLength:5' : 'minLength:5',
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

const deleteValidator = (req, res, next) => {
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
  createRecipesValidator,
  addVideosValidator,
  addPhotoValidator,
  addCommentValidator,
  updateRecipesValidator,
  deleteValidator,
}
