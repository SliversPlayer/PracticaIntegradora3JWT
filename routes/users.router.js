import { Router } from 'express';
import { toggleUserRole } from '../controllers/user.controller.js';
import { isAuthenticated, isAdmin } from '../middleware/auth.js';

const router = Router();

/**
 * @swagger
 * /api/users/premium/{uid}:
 *   put:
 *     summary: Cambiar el rol de un usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: uid
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Rol de usuario actualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */

// Ruta para cambiar el rol del usuario entre 'user' y 'premium'
router.put('/premium/:uid', isAuthenticated, isAdmin, toggleUserRole);

export default router;
