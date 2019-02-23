const express = require('express')
var multer = require('multer')

const app = express()
const port = 5000

// This should be after any other middleware ( we don't have any )
const ErrorHandler = (error, req, res, next) => {
  return res.status(400).json({ message: error.message })
}

const getExtensionString = mimeType => {
  // MIME Types
  const jpg = 'image/jpeg'
  const png = 'image/png'
  const gif = 'image/gif'
  switch (mimeType) {
    case jpg:
      return '.jpg'
      break
    case png:
      return '.png'
      break
    case gif:
      return '.gif'
      break
    default:
      ''
  }
}

// rejects any non-image files by mime type
const fileFilter = (req, file, cb) => {
  const { mimetype } = file
  const extension = getExtensionString(mimetype)
  if (extension) {
    cb(null, true)
  } else {
    cb(new Error('File must be an image'), false)
  }
}

// store the file by username, reject if no username was provided
const storage = multer.diskStorage({
  destination: './avatars/',
  filename: (req, file, cb) => {
    const extension = getExtensionString(file.mimetype)
    if (!req.params.username) {
      cb(new Error('No username provided'))
    } else {
      cb(null, req.params.username + extension)
    }
  }
})

// "avatars/" will be created for us by multer since we're not specifying
// a function for "dest"
const upload = multer({ fileFilter, storage: storage })

app.post('/:username', upload.single('avatar'), (req, res, next) => {
  if (!req.file) {
    return next(new Error('No file provided'))
  }
  const success = 'Uploaded the file successfully!'
  return res.status(200).json({ message: success })
})

app.use(ErrorHandler)
app.listen(port, () => console.log(`Server running on port ${port}!`))
