import mongoose from 'mongoose';

const cartCollection = "carts";

// const cartSchema = new mongoose.Schema({
//     products: [{
//          // ref debe hacer referencia al nombre de la collection
//         productId: { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true }, 
//         quantity: { type: Number, required: true, min: 1 }
//     }]
// });

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