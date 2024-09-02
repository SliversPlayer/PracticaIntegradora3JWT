import { Router } from 'express';
import {
    listProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
} from '../controllers/product.controller.js';
import { isAuthenticated, isAdminOrPremium, isAdmin } from '../middleware/auth.js';

const router = Router();

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Listar productos
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Lista de productos
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /api/products/{pid}:
 *   get:
 *     summary: Obtener un producto por ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: pid
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto obtenido
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Agregar un producto
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Producto agregado
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /api/products/{pid}:
 *   put:
 *     summary: Actualizar un producto
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: pid
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del producto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Producto actualizado
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /api/products/{pid}:
 *   delete:
 *     summary: Eliminar un producto
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: pid
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto eliminado
 *       401:
 *         description: No autorizado
 */

router.get('/', isAuthenticated, listProducts);
router.get('/:pid', isAuthenticated, getProductById);
router.post('/', isAdmin, addProduct); // Solo admin puede agregar productos
router.put('/:pid', isAdminOrPremium, updateProduct); // Admin o Premium pueden modificar productos según la lógica en el controlador
router.delete('/:pid', isAdminOrPremium, deleteProduct); // Admin o Premium pueden eliminar productos según la lógica en el controlador

export default router;
