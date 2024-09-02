import crypto from 'crypto';
import bcrypt from 'bcrypt';
import UserModel from '../models/user.model.js';
import transporter from '../config/nodemailer.config.js';
import { hashPassword } from './authService.js';

export const sendPasswordResetEmail = async (email) => {
    const user = await UserModel.findOne({ email });
    if (!user) {
        throw new Error('Usuario no encontrado');
    }

    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hora
    await user.save();

    const resetUrl = `http://localhost:8080/reset-password/${token}`;

    const mailOptions = {
        to: user.email,
        from: process.env.EMAIL_USER,
        subject: 'Recuperación de contraseña',
        text: `Recibiste este correo porque tú (o alguien más) solicitó restablecer la contraseña de tu cuenta.\n\n
        Haz clic en el siguiente enlace o pégalo en tu navegador para completar el proceso:\n\n
        ${resetUrl}\n\n
        Si no solicitaste esto, ignora este correo y tu contraseña permanecerá sin cambios.\n`,
    };

    await transporter.sendMail(mailOptions);
};

export const resetPassword = async (token, newPassword) => {
    const user = await UserModel.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
        throw new Error('Token de restablecimiento de contraseña inválido o expirado');
    }

    const hashedPassword = await hashPassword(newPassword);
    if (await bcrypt.compare(newPassword, user.password)) {
        throw new Error('No puedes usar la misma contraseña anterior');
    }

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
};