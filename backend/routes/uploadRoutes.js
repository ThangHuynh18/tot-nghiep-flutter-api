import path from 'path'
import { Storage } from '@google-cloud/storage'
import express from 'express'
import multer from 'multer'
import asyncHandler from 'express-async-handler'

const router = express.Router()

const storage = new Storage({
  projectId: process.env.GCLOUD_PROJECT_ID,
  keyFilename:
    'backend/config/shoppu-60e90-firebase-adminsdk-jdjmn-f97a50a6a5.json',
})

const bucket = storage.bucket('gs://shoppu-60e90.appspot.com')

const checkFileType = (file) => {
  const filetypes = /jpg|jpeg|png/
  const mimetype = filetypes.test(file.mimetype)
  if (!mimetype) {
    return true
  }
  return false
}

const uploader = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // keep images size < 5 MB
  },
})

const uploadToFirebase = asyncHandler(async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400)
      throw new Error('Không có file nào được chọn.')
    }
    if (checkFileType(req.file)) {
      res.status(400)
      throw new Error('Chỉ chọn file ảnh!')
    }
    // This is where we'll upload our file to Cloud Storage
    console.log(req.file)
    // Create new blob in the bucket referencing the file
    const blob = bucket.file(req.file.originalname)

    // Create writable stream and specifying file mimetype
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
    })

    // If there's an error
    blobStream.on('error', (err) => next(err))

    // If all is good and done
    blobStream.on('finish', () => {
      // Assemble the file public URL
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${
        bucket.name
      }/o/${encodeURI(blob.name)}?alt=media`
      // Return the file name and its public URL
      // for you to store in your own database
      res.status(200).send({
        fileName: req.file.originalname,
        fileLocation: publicUrl,
      })
    })
    // When there is no more data to be consumed from the stream the end event gets emitted
    blobStream.end(req.file.buffer)
  } catch (error) {
    res.status(400)
    throw new Error(`${error}`)
  }
})

router.post('/', uploader.single('image'), uploadToFirebase)

export default router
