
import errorMessages from '../utils/errorMessages.js';

const errorHandler = (err, req, res, next) => {
    console.error(err); // Log de error en el servidor

    const { status = 500, message = 'Error interno del servidor' } = err;
    const errorResponse = {
        status: 'error',
        code: status,
        message: errorMessages[message]?.message || message
    };

    res.status(status).json(errorResponse);
};

export default errorHandler;