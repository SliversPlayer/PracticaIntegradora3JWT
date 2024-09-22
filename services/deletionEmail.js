import transporter from '../config/nodemailer.config.js';

// Función para enviar un correo
export const sendDeletionEmail = async (email) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Cuenta eliminada por inactividad',
        text: 'Tu cuenta ha sido eliminada debido a que no has iniciado sesión en los últimos 2 días.',
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Correo de eliminación enviado a: ${email}`);
    } catch (error) {
        console.error(`Error al enviar correo a ${email}:`, error);
    }
};