import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import usuarioRoutes from './routes/usuarioRoutes.js'
import healthRoutes from './routes/healthRoutes.js'
import { swaggerUi, swaggerSpec } from './config/swagger.js'
import AppError from './utils/AppError.js'
import { globalErrorHandler } from './middlewares/errorMiddleware.js'

dotenv.config()

const app = express()
app.use(express.json())

app.use(cors({                          
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
const port = process.env.PORT 
const mongoUri = process.env.MONGO_URI 

app.use('/health', healthRoutes)
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use('/api/v1/usuarios', usuarioRoutes)

app.all('/{*path}', (req, res, next) => {  next(new AppError(`No se encontró ${req.originalUrl} en este servidor`, 404))
})

app.use(globalErrorHandler)

const startServer = () => {
  app.listen(port, () =>
    console.log(`MS3-Usuarios corriendo en http://localhost:${port}`)
  )
}

if (!mongoUri) {
  console.error(' MONGO_URI no definido en .env')
  process.exit(1)
} else {
  mongoose.connect(mongoUri)
    .then(() => {
      console.log('MongoDB conectado')
      startServer()
    })
    .catch(err => {
      console.error(' Error al conectar MongoDB:', err.message)
      process.exit(1)
    })
}