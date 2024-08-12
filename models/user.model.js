import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userCollection = "Users";

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: { type: String, unique: true },
    age: Number,
    password: String,
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'carts' },
    role: { type: String, default: 'user' } 
});

// Hash de contraseña
userSchema.pre('save', function (next) {
    if (this.isModified('password') || this.isNew) {
        if (!this.password.startsWith('$2a$')) {
            const hashedPassword = createHash(this.password);
            console.log('Contraseña original (pre-save):', this.password);
            console.log('Contraseña hasheada (pre-save):', hashedPassword);
            this.password = hashedPassword;
        }
    }
    next();
});

// Comparar la password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model(userCollection, userSchema);

export default User;