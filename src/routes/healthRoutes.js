import { Router } from 'express'

const router = Router()

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Verifica que la API esté disponible
 *     tags: [Sistema]
 *     responses:
 *       200:
 *         description: API funcionando correctamente
 */
router.get('/', (req, res) => {
  res.status(200).json({ status: 'ok' })
})

export default router