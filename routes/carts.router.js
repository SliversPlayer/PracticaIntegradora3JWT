import { Router } from 'express';
import { getCart, addProductToCart, removeProductFromCart, clearCart } from '../controllers/cart.controller.js';
import authMiddleware from '../middleware/authMiddleware.js';  // Middleware para verificar autenticación

const router = Router();

/**
 * @swagger
 * /api/carts:
 *   get:
 *     summary: Obtener el carrito del usuario autenticado
 *     tags: [Carts]
 *     responses:
 *       200:
 *         description: Carrito del usuario
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /api/carts/add:
 *   post:
 *     summary: Agregar un producto al carrito
 *     tags: [Carts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Producto agregado al carrito
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /api/carts/remove/{productId}:
 *   delete:
 *     summary: Eliminar un producto del carrito
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto eliminado del carrito
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /api/carts/clear:
 *   delete:
 *     summary: Vaciar el carrito
 *     tags: [Carts]
 *     responses:
 *       200:
 *         description: Carrito vaciado
 *       401:
 *         description: No autorizado
 */

// Ruta para obtener el carrito del usuario autenticado
router.get('/', authMiddleware, getCart);

// Ruta para agregar un producto al carrito (Update path to '/add')
router.post('/add', authMiddleware, addProductToCart);

// Ruta para eliminar un producto del carrito
router.delete('/remove/:productId', authMiddleware, removeProductFromCart);

// Ruta para vaciar el carrito
router.delete('/clear', authMiddleware, clearCart);

export default router;

