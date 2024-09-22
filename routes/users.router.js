import { Router } from 'express';
import { toggleUserRole, uploadUserDocuments, getAllUsers, deleteInactiveUsers, changeUserRole, deleteUser } from '../controllers/user.controller.js';
import upload from '../config/multer.config.js'; // Importar la configuración de Multer

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

// Obtener todos los usuarios (GET /api/users)
router.get('/', getAllUsers);

// Eliminar usuarios inactivos (DELETE /api/users)
router.delete('/', deleteInactiveUsers);

// Cambiar rol de usuario
router.put('/role/:uid', changeUserRole);  // Nueva ruta para cambiar el rol de un usuario

// Eliminar un usuario específico
router.delete('/:uid', deleteUser);  // Nueva ruta para eliminar un usuario específico

// Endpoint para subir documentos de usuario
router.post('/:uid/documents', upload.fields([
    { name: 'profile', maxCount: 1 },
    { name: 'product', maxCount: 10 },
    { name: 'document', maxCount: 10 }
]), uploadUserDocuments);

// Ruta para cambiar el rol del usuario
router.put('/premium/:uid', toggleUserRole);

export default router;
