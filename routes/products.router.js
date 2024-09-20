import { Router } from 'express';
import {
    listProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
} from '../controllers/product.controller.js';
import { isAuthenticated, isNotAuthenticated,isAdminOrPremium, isAdmin } from '../middleware/auth.js';

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

// Listar productos - accesible para todos
router.get('/', listProducts);

// Obtener un producto por ID - protegido para usuarios autenticados
router.get('/:pid', isAuthenticated, getProductById);

// Agregar un producto - solo para administradores
router.post('/', isAdmin, addProduct);

// Actualizar un producto - para administradores y usuarios premium
router.put('/:pid', isAuthenticated, isAdminOrPremium, updateProduct);

// Eliminar un producto - para administradores y usuarios premium
router.delete('/:pid', isAuthenticated, isAdminOrPremium, deleteProduct);

export default router;
