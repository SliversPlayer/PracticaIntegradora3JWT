import { Router } from 'express';
import generateMockProducts from '../utils/generateMockProducts.js'; // Ajusta la ruta según tu estructura de carpetas

const router = Router();

/**
 * @swagger
 * /api/mockingproducts:
 *   get:
 *     summary: Obtener productos de prueba
 *     tags: [Mocking]
 *     responses:
 *       200:
 *         description: Lista de productos de prueba
 *       500:
 *         description: Error interno del servidor
 */

// Endpoint para obtener productos de prueba
router.get('/mockingproducts', (req, res) => {
    try {
        const mockProducts = generateMockProducts();
        res.json({ status: 'success', payload: mockProducts });
    } catch (error) {
        console.error('Error getting mock products:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
});

export default router;