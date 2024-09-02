import mongoose from "mongoose";
import cartModel from './cart.model.js';

const userCollection = "users";

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - first_name
 *         - last_name
 *         - email
 *         - password
 *       properties:
 *         first_name:
 *           type: string
 *           description: El nombre del usuario
 *         last_name:
 *           type: string
 *           description: El apellido del usuario
 *         email:
 *           type: string
 *           description: El correo electrónico del usuario
 *         age:
 *           type: number
 *           description: La edad del usuario
 *         password:
 *           type: string
 *           description: La contraseña del usuario
 *         role:
 *           type: string
 *           enum: [admin, user, premium]
 *           description: El rol del usuario
 *         cart:
 *           type: string
 *           description: El ID del carrito asociado al usuario
 *         resetPasswordToken:
 *           type: string
 *           description: Token para restablecer la contraseña
 *         resetPasswordExpires:
 *           type: string
 *           format: date-time
 *           description: Fecha de expiración del token de restablecimiento de contraseña
 */

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: { type: String, unique: true },
    age: Number,
    password: String,
    role: { type: String, enum: ['admin', 'user', 'premium'], default: 'user' },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'carts' },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
});

userSchema.pre('save', async function (next) {
    if (!this.cart) {
        try {
            const newCart = await cartModel.create({ user: this._id });
            this.cart = newCart._id;
            next();
        } catch (err) {
            next(err);
        }
    } else {
        next();
    }
});

const User = mongoose.model(userCollection, userSchema);

export default User;