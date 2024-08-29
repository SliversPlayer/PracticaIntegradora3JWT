import mongoose from 'mongoose';
import productModel from './product.model.js';

const cartCollection = "carts";

const cartsSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    products: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true },
        quantity: { type: Number, default: 1, required: true }  // Corregido "requiered" a "required"
    }],
});

const cartModel = mongoose.model(cartCollection, cartsSchema);

export default cartModel;

