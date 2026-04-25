const handleDuplicateFieldsDB = (err) => {
  const field = Object.keys(err.keyValue)[0]
  const message = `El valor del campo '${field}' ya está en uso. Por favor usa otro.`
  return { statusCode: 400, status: 'fail', message }
}

const handleCastErrorDB = (err) => {
  const message = `ID inválido: ${err.value}`
  return { statusCode: 400, status: 'fail', message }
}

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map(el => el.message)
  const message = `Datos inválidos: ${errors.join('. ')}`
  return { statusCode: 400, status: 'fail', message }
}

const handleJWTError = () => ({
  statusCode: 401,
  status: 'fail',
  message: 'Token inválido. Por favor inicia sesión nuevamente.'
})

const handleJWTExpiredError = () => ({
  statusCode: 401,
  status: 'fail',
  message: 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.'
})

export const globalErrorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500
  let status = err.status || 'error'
  let message = err.message || 'Error Interno del Servidor'

  if (err.code === 11000) {
    const handled = handleDuplicateFieldsDB(err)
    statusCode = handled.statusCode
    status = handled.status
    message = handled.message
  } else if (err.name === 'CastError') {
    const handled = handleCastErrorDB(err)
    statusCode = handled.statusCode
    status = handled.status
    message = handled.message
  } else if (err.name === 'ValidationError') {
    const handled = handleValidationErrorDB(err)
    statusCode = handled.statusCode
    status = handled.status
    message = handled.message
  } else if (err.name === 'JsonWebTokenError') {
    const handled = handleJWTError()
    statusCode = handled.statusCode
    status = handled.status
    message = handled.message
  } else if (err.name === 'TokenExpiredError') {
    const handled = handleJWTExpiredError()
    statusCode = handled.statusCode
    status = handled.status
    message = handled.message
  }

  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err)
  }

  res.status(statusCode).json({
    status,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
}