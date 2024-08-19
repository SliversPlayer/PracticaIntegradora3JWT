import mongoose from 'mongoose';

const cartCollection = "carts";

const cartsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",  // Asegúrate de que coincide con el nombre de tu modelo de usuario
        required: true
    },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Products",  // Asegúrate de que coincide con el nombre de tu modelo de producto
            },
            quantity: {
                type: Number,
                required: true,
                default: 1
            }
        }
    ]
});

const cartModel = mongoose.model(cartCollection, cartsSchema);

export default cartModel;
