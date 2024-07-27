import { Router } from 'express';
import {
    listProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
} from '../controllers/product.controller.js';
import { isAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', listProducts);
router.get('/:pid', getProductById);
router.post('/', isAdmin, addProduct);
router.put('/:pid', isAdmin, updateProduct);
router.delete('/:pid', isAdmin, deleteProduct);

export default router;