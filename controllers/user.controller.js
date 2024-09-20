import userModel from '../models/user.model.js';

export const uploadUserDocuments = async (req, res) => {
    try {
        const { uid } = req.params;
        const user = await userModel.findById(uid);

        if (!user) {
            return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
        }

        // Actualizar la lista de documentos del usuario
        if (req.files) {
            if (req.files.document) {
                req.files.document.forEach(file => {
                    user.documents.push({ name: file.fieldname, reference: file.path });
                });
            }
        }

        await user.save();
        res.status(200).json({ status: 'success', message: 'Documentos subidos y actualizados', user });
    } catch (error) {
        console.error('Error al subir documentos:', error);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
};

// Función para actualizar la última conexión
export const updateLastConnection = async (userId) => {
    try {
        const user = await userModel.findById(userId);
        if (user) {
            user.last_connection = new Date();
            await user.save();
        }
    } catch (error) {
        console.error('Error actualizando la última conexión:', error);
    }
};

// Controlador para cambiar el rol del usuario
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

        // Actualizar la propiedad last_connection
        await updateLastConnection(user._id);

        // Guardar los cambios en el usuario
        await user.save();

        res.status(200).json({ status: 'success', message: `Rol actualizado a ${user.role}`, user });
    } catch (error) {
        console.error('Error al cambiar el rol del usuario:', error);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
};
