import mongoose from "mongoose";

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
//Hash de contraseña
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

//Comparar la password
userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        const result = await bcrypt.compare(candidatePassword, this.password);
        console.log('Comparación de contraseñas:', result);
        return result;
    } catch (error) {
        throw new Error(error);
    }
};
const usersModel = mongoose.model(userCollection, userSchema);

export default usersModel