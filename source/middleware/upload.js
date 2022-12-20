const cloudinary = require('cloudinary')
const path = require('path')
const MB = 2
const FILE_SIZE_LIMIT = MB * 1024 * 1024
const MBVID = 500
const VID_SIZE_LIMIT = MBVID * 1024 * 1024

const filesPayLoadExist = (req, res, next) => {
  try {
    if (!req.files) {
      throw { code: 400, message: 'Missing files' }
    }
    next()
  } catch (error) {
    res.status(error?.code ?? 500).json({
      message: error,
    })
  }
}

const fileSizeLimiter = (req, res, next) => {
  try {
    if (!req.files) {
      next()
    } else {
      const files = req.files

      const filesOverLimit = []
      // Which files are over the limit?
      Object.keys(files).forEach((key) => {
        if (files[key].size > FILE_SIZE_LIMIT) {
          filesOverLimit.push(files[key].name)
        }
      })

      if (filesOverLimit.length) {
        const properVerb = filesOverLimit.length > 1 ? 'are' : 'is'

        const sentence =
          `Upload failed. ${filesOverLimit.toString()} ${properVerb} over the file size limit of ${MB} MB.`.replaceAll(
            ',',
            ', '
          )

        const message =
          filesOverLimit.length < 3
            ? sentence.replace(',', ' and')
            : sentence.replace(/,(?=[^,]*$)/, ' and')

        //   return res.status(413).json({ status: 'error', message })
        throw { code: 413, message }
      }

      next()
    }
  } catch (error) {
    res.status(error?.code ?? 500).json({
      message: error,
    })
  }
}

const fileExtLimiter = (allowedExtArray) => {
  return (req, res, next) => {
    if (!req.files) {
      next()
    } else {
      const files = req.files

      const fileExtensions = []
      Object.keys(files).forEach((key) => {
        fileExtensions.push(path.extname(files[key].name))
      })

      // Are the file extension allowed?
      const allowed = fileExtensions.every((ext) =>
        allowedExtArray.includes(ext)
      )

      if (!allowed) {
        const message =
          `Upload failed. Only ${allowedExtArray.toString()} files allowed.`.replaceAll(
            ',',
            ', '
          )

        return res.status(422).json({ status: 'error', message })
      }

      next()
    }
  }
}

// seterusnya validasi untuk video
const vidSizeLimiter = (req, res, next) => {
  try {
    if (!req.files) {
      next()
    } else {
      const files = req.files

      const filesOverLimit = []
      // Which files are over the limit?
      Object.keys(files).forEach((key) => {
        if (files[key].size > VID_SIZE_LIMIT) {
          filesOverLimit.push(files[key].name)
        }
      })

      if (filesOverLimit.length) {
        const properVerb = filesOverLimit.length > 1 ? 'are' : 'is'

        const sentence =
          `Upload failed. ${filesOverLimit.toString()} ${properVerb} over the file size limit of ${MBVID} MB.`.replaceAll(
            ',',
            ', '
          )

        const message =
          filesOverLimit.length < 3
            ? sentence.replace(',', ' and')
            : sentence.replace(/,(?=[^,]*$)/, ' and')

        //   return res.status(413).json({ status: 'error', message })
        throw { code: 413, message }
      }

      next()
    }
  } catch (error) {
    res.status(error?.code ?? 500).json({
      message: error,
    })
  }
}

const vidExtLimiter = (allowedExtArray) => {
  return (req, res, next) => {
    if (!req.files) {
      next()
    } else {
      const files = req.files

      const fileExtensions = []
      Object.keys(files).forEach((key) => {
        fileExtensions.push(path.extname(files[key].name))
      })

      // Are the file extension allowed?
      const allowed = fileExtensions.every((ext) =>
        allowedExtArray.includes(ext)
      )

      if (!allowed) {
        const message =
          `Upload failed. Only ${allowedExtArray.toString()} files allowed.`.replaceAll(
            ',',
            ', '
          )

        return res.status(422).json({ status: 'error', message })
      }

      next()
    }
  }
}

cloudinary.config({
  cloud_name: 'daouvimjz',
  api_key: '549719657447986',
  api_secret: 'RPLtU02NLI2HxgwH2j29P4mHw7Y',
})

module.exports = {
  filesPayLoadExist,
  fileSizeLimiter,
  fileExtLimiter,
  vidSizeLimiter,
  vidExtLimiter,
  cloudinary,
}
