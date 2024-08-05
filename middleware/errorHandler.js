import { CustomError } from '../utils/errors.js'
import logger from '../utils/logger.js'

function errorHandler(err, req, res, next) {
    logger.error(err.message)

    if (err instanceof CustomError) {
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
            details: err.details,
        })
    }

    res.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
    })
}

export default errorHandler;