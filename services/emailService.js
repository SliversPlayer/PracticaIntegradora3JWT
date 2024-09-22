import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Cargar variables de entorno para la configuración del correo
dotenv.config();

// Configurar el transportador de Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail', // O el servicio que estés usando
    auth: {
        user: process.env.EMAIL_USER, // Tu correo
        pass: process.env.EMAIL_PASS  // Tu contraseña o app password
    }
});

// Función para enviar un correo
export const sendEmail = async (to, subject, htmlContent) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER, // Dirección del remitente
            to, // Destinatario
            subject, // Asunto
            html: htmlContent // Contenido en HTML
        });
        console.log(`Correo enviado a ${to}`);
    } catch (error) {
        console.error('Error al enviar el correo:', error);
    }
};
