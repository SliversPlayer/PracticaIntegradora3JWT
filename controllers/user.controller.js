import userModel from '../models/user.model.js';

export const toggleUserRole = async (req, res) => {
    try {
        const { uid } = req.params;  // Obtener el ID del usuario de los parámetros de la ruta

        // Buscar el usuario por su ID
        const user = await userModel.findById(uid);

        if (!user) {
            return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
        }

        // Cambiar el rol de 'user' a 'premium' y viceversa
        if (user.role === 'user') {
            user.role = 'premium';
        } else if (user.role === 'premium') {
            user.role = 'user';
        } else {
            return res.status(400).json({ status: 'error', message: 'Rol del usuario no válido para cambiar' });
        }

        // Guardar los cambios en el usuario
        await user.save();

        res.status(200).json({ status: 'success', message: `Rol actualizado a ${user.role}`, user });
    } catch (error) {
        console.error('Error al cambiar el rol del usuario:', error);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
};
