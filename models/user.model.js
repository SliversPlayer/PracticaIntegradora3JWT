import mongoose from "mongoose";

const userCollection = "Users";

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
            // Crea un nuevo carrito vacío
            const newCart = await Cart.create({});
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
userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password') && user.password) {
        user.password = await bcrypt.hash(user.password, 10)
    }
    next()
})

const User = mongoose.model(userCollection, userSchema);

export default User;