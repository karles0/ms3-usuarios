import { Router } from 'express'
import * as authController from '../controllers/authController.js'
import * as usuarioController from '../controllers/usuarioController.js'
import { protect, restrictTo, esPropioOAdmin } from '../middlewares/authMiddleware.js'

const router = Router()

// ================= RUTAS PÚBLICAS =================

/**
 * @swagger
 * /usuarios/signup:
 *   post:
 *     summary: Crear una nueva cuenta (Registro)
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, apellido, email, contraseña]
 *             properties:
 *               nombre:     { type: string, example: "Carlos" }
 *               apellido:   { type: string, example: "García" }
 *               email:      { type: string, example: "carlos@email.com" }
 *               password: { type: string, example: "mi_password_123" }
 *               telefono:   { type: string, example: "999888777" }
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente con su token
 *       400:
 *         description: Email ya en uso o datos inválidos
 */
router.post('/signup', authController.signup)

/**
 * @swagger
 * /usuarios/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, contraseña]
 *             properties:
 *               email:      { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Login exitoso, devuelve el token JWT
 *       401:
 *         description: Credenciales incorrectas
 */
router.post('/login', authController.login)

// ================= RUTAS PROTEGIDAS =================
router.use(protect)

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Lista usuarios con paginación
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *       401:
 *         description: No autorizado
 */
router.get('/', usuarioController.getAllUsuarios)

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Obtener perfil de un usuario
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/:id', usuarioController.getUsuario)

/**
 * @swagger
 * /usuarios/{id}/direccion:
 *   put:
 *     summary: Actualizar dirección del usuario
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               direccion:
 *                 type: object
 *                 properties:
 *                   calle:  { type: string }
 *                   ciudad: { type: string }
 *                   pais:   { type: string }
 *     responses:
 *       200:
 *         description: Dirección actualizada
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 */
router.put('/:id/direccion', esPropioOAdmin, usuarioController.actualizarDireccion)
/**
 * @swagger
 * /usuarios/{id}/rol:
 *   patch:
 *     summary: Asignar rol a un usuario (solo admin)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [rol]
 *             properties:
 *               rol:
 *                 type: string
 *                 enum: [user, admin]
 *     responses:
 *       200:
 *         description: Rol actualizado
 *       403:
 *         description: No autorizado (no eres admin)
 *       404:
 *         description: Usuario no encontrado
 */
router.patch('/:id/rol', restrictTo('admin'), usuarioController.asignarRol)

/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Eliminar cuenta de usuario (solo admin)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Usuario eliminado
 *       403:
 *         description: No autorizado (no eres admin)
 *       404:
 *         description: Usuario no encontrado
 */
router.delete('/:id', restrictTo('admin'), usuarioController.eliminarUsuario)

export default router