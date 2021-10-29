const notFound = (req, res, next) => {
  const err = new Error(`Not Found - ${req.originalUrl}`)
  res.status(404)
  next(err)
}

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode
  res.status(statusCode)
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV !== 'production' ? err.stack : null,
  })
}

const customErrorHandler = (err, res) => {
  const statusCode = res.statusCode === 200 ? 400 : res.statusCode
  let errors = {}
  if (err) {
    if (err.code === 11000) {
      // duplicate error code
      Object.keys(err.keyValue).forEach((key) => {
        console.log(key)
        errors[key] = `${key === 'name' ? 'Tên' : 'Email'} này đã tồn tại!`
      })
    }
    console.log(Object.values(err.errors))
    // validate errors
    if (err.errors) {
      Object.values(err.errors).forEach(({ properties }) => {
        errors[properties.path] = properties.message
      })
    }

    if (
      errors &&
      Object.keys(errors).length === 0 &&
      errors.constructor === Object
    ) {
      return { statusCode, message: err.message }
    }
    return { statusCode, message: errors }
  }
}

export { notFound, errorHandler, customErrorHandler }
