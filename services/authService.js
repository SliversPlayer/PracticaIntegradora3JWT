import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Función para hashear la contraseña
export const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

// Función para comparar la contraseña con el hash almacenado
export const comparePassword = async (candidatePassword, hashedPassword) => {
    return await bcrypt.compare(candidatePassword, hashedPassword);
};

// Función para generar un token JWT
export const generateAuthToken = (user) => {
    return jwt.sign(
        { _id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );
};

