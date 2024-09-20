import { Router } from 'express';
import { toggleUserRole, uploadUserDocuments } from '../controllers/user.controller.js';
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

// Endpoint para subir documentos de usuario
router.post('/:uid/documents', upload.fields([
    { name: 'profile', maxCount: 1 },
    { name: 'product', maxCount: 10 },
    { name: 'document', maxCount: 10 }
]), uploadUserDocuments);

// Ruta para cambiar el rol del usuario
router.put('/premium/:uid', toggleUserRole);

export default router;
