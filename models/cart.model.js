import mongoose from 'mongoose';

const cartCollection = "carts";

/**
 * @swagger
 * components:
 *   schemas:
 *     Cart:
 *       type: object
 *       required:
 *         - user
 *         - products
 *       properties:
 *         user:
 *           type: string
 *           description: El ID del usuario asociado al carrito
 *         products:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 description: El ID del producto
 *               quantity:
 *                 type: number
 *                 description: La cantidad del producto
 */

const cartsSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    products: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true },
        quantity: { type: Number, default: 1, required: true }
    }],
});

const cartModel = mongoose.model(cartCollection, cartsSchema);

export default cartModel;

