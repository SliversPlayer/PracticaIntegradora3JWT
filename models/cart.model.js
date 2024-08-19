import mongoose from 'mongoose';

const cartCollection = "carts";

const cartsSchema = new mongoose.Schema({
    products: {
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Products"
                },
                quantity: {
                    type: Number,
                    default: 1
                }
            }
        ],
        default: []
    }
});

const cartModel = mongoose.model(cartCollection, cartsSchema);

export default cartModel;