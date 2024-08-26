import mongoose from "mongoose";
import cartModel from './cart.model.js'; // Import the cart model

const userCollection = "users";

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: { type: String, unique: true },
    age: Number,
    password: String,
    role: { type: String, enum: ['admin', 'user', 'premium'], default: 'user' },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'carts' }
});

userSchema.pre('save', async function (next) {
    // Verifica si el usuario ya tiene un carrito asignado
    if (!this.cart) {
        try {
            // Crea un nuevo carrito vacío con el ID del usuario
            const newCart = await cartModel.create({ user: this._id });
            // Asigna el ID del carrito al usuario
            this.cart = newCart._id;
            next();
        } catch (err) {
            next(err);
        }
    } else {
        // Si el usuario ya tiene un carrito, pasa al siguiente middleware
        next();
    }
});

const User = mongoose.model(userCollection, userSchema);

export default User;