import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const apiBaseUrl = process.env.API_BASE_URL 

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'MS3 - Usuarios API', version: '1.0.0' },
    servers: [{ url: apiBaseUrl }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    tags: [
      { name: 'Autenticación', description: 'Registro e inicio de sesión' },
      { name: 'Usuarios', description: 'Gestión de usuarios (requiere token)' }
    ]
  },
  apis: ['./src/routes/*.js']
})

export { swaggerUi, swaggerSpec }