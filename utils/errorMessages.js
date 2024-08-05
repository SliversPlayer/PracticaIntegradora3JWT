class CustomError extends Error {
    constructor(message, statusCode, details) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
    }
}

const errorTypes = {
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    MISSING_FIELDS: 'MISSING_FIELDS'
}

const errorDictionary = {
    [errorTypes.VALIDATION_ERROR]: {
        message: 'Invalid data',
        statusCode: 400
    },
    [errorTypes.MISSING_FIELDS]: {
        message: 'Faltan completar campos',
        statusCode: 400
    }
}

function createCustomError(type, details = {}) {
    const error = errorDictionary[type]
    if (!error) {
        throw new Error('Invalid error type')
    }

    let customMessage = error.message
    if (type === errorTypes.MISSING_FIELDS) {
        customMessage += `: ${JSON.stringify(details)}`
    }

    const customError = new CustomError(customMessage, error.statusCode, details)
    return customError
}

export { CustomError, errorTypes, createCustomError }