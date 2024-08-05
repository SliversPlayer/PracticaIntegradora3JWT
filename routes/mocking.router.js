import { Router } from 'express';
import generateMockProducts from '../utils/generateMockProducts.js'; // Ajusta la ruta según tu estructura de carpetas

const router = Router();

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