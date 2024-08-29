import mongoose from 'mongoose';

const cartCollection = "carts";

const cartsSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    products: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true },
        quantity: { type: Number, default: 1, required: true }
    }],
});

const cartModel = mongoose.model(cartCollection, cartsSchema);

export default cartModel;

