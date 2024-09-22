import userModel from '../models/user.model.js';
import { sendDeletionEmail } from '../services/deletionEmail.js';

// Cambiar el rol de un usuario
export const changeUserRole = async (req, res) => {
    try {
        const { uid } = req.params;
        const { role } = req.body;

        if (!['user', 'premium', 'admin'].includes(role)) {
            return res.status(400).json({ status: 'error', message: 'Rol no válido' });
        }

        const user = await userModel.findById(uid);
        if (!user) {
            return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
        }

        user.role = role;
        await user.save();

        res.status(200).json({ status: 'success', message: `Rol actualizado a ${role}` });
    } catch (error) {
        console.error('Error al cambiar el rol del usuario:', error);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
};

// Eliminar un usuario específico
export const deleteUser = async (req, res) => {
    try {
        const { uid } = req.params;

        const user = await userModel.findByIdAndDelete(uid);
        if (!user) {
            return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
        }

        res.status(200).json({ status: 'success', message: 'Usuario eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
};

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

        // Si el rol es 'premium', validamos los documentos necesarios
        if (user.role === 'user') {
            // Verificar que el usuario haya subido los documentos requeridos
            const requiredDocuments = ['Identificación', 'Comprobante de domicilio', 'Comprobante de estado de cuenta'];

            // Filtrar los documentos cargados por el usuario
            const uploadedDocuments = user.documents.map(doc => doc.name);

            // Verificar si el usuario tiene todos los documentos necesarios
            const hasAllDocuments = requiredDocuments.every(doc => uploadedDocuments.includes(doc));

            if (!hasAllDocuments) {
                return res.status(400).json({ 
                    status: 'error', 
                    message: 'No se puede cambiar el rol a premium hasta que se carguen todos los documentos requeridos: Identificación, Comprobante de domicilio, Comprobante de estado de cuenta.' 
                });
            }

            // Cambiar el rol a 'premium'
            user.role = 'premium';
        } else if (user.role === 'premium') {
            // Permitir cambiar de premium a user sin restricciones
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

// Eliminar usuarios que no hayan iniciado sesión en los últimos 2 días
export const deleteInactiveUsers = async (req, res) => {
    try {
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

        // Buscar usuarios inactivos
        const inactiveUsers = await userModel.find({
            last_connection: { $lt: twoDaysAgo },
        });

        if (inactiveUsers.length === 0) {
            return res.status(200).json({ status: 'success', message: 'No hay usuarios inactivos para eliminar.' });
        }

        // Enviar correos y eliminar usuarios
        const deletionPromises = inactiveUsers.map(async (user) => {
            await sendDeletionEmail(user.email);
            await userModel.findByIdAndDelete(user._id);
        });

        await Promise.all(deletionPromises);

        res.status(200).json({ status: 'success', message: `Se eliminaron ${inactiveUsers.length} usuarios inactivos.` });
    } catch (error) {
        console.error('Error al eliminar usuarios inactivos:', error);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
};

// Obtener todos los usuarios con nombre, correo y tipo de cuenta
export const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find({}, 'first_name last_name email role last_connection');  // Solo obtenemos los campos que queremos
        res.status(200).json({ status: 'success', users });
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
};