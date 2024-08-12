import UserRepository from './user.repository.js';
import UserModel from '../models/user.model.js';

export default class UserRepositoryImpl extends UserRepository {
    async findUserByEmail(email) {
        try {
            const user = await UserModel.findOne({ email: email.trim() });
            console.log(`Buscando usuario con el correo: ${email}. Encontrado: ${user}`);
            return user;
        } catch (error) {
            console.error('Error en findUserByEmail:', error);
            throw error;
        }
    }

    async createUser(user) {
        try {
            const newUser = new UserModel(user);
            await newUser.save();
            console.log(`Usuario creado: ${newUser}`);
            return newUser;
        } catch (error) {
            console.error('Error en createUser:', error);
            throw error;
        }
    }

    async updateUser(user) {
        try {
            await UserModel.findByIdAndUpdate(user._id, user);
            console.log(`Usuario actualizado: ${user}`);
        } catch (error) {
            console.error('Error en updateUser:', error);
            throw error;
        }
    }
}