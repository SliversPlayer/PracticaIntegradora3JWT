

import { Router } from 'express';
import express from 'express';
import { getCart, addProductToCart, removeProductFromCart, clearCart } from '../controllers/cart.controller.js';
import authMiddleware from '../middleware/authMiddleware.js';  // Middleware para verificar autenticación

const router = Router();

// Ruta para obtener el carrito del usuario autenticado
router.get('/', authMiddleware, getCart);

// Ruta para agregar un producto al carrito
router.post('/', authMiddleware, addProductToCart);

// Ruta para eliminar un producto del carrito
router.delete('/remove/:productId', authMiddleware, removeProductFromCart);

// Ruta para vaciar el carrito
router.delete('/clear', authMiddleware, clearCart);

export default router;
