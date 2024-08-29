import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    // Attempt to retrieve the token from cookies or the Authorization header
    const token = req.cookies.authToken || (req.headers.authorization && req.headers.authorization.split(' ')[1]);

    // Check if the token was found
    if (!token) {
        console.log('Authorization header:', req.headers.authorization);
        return res.status(401).send({ error: 'No token provided, not authenticated' });
    }
    try {
        // Verify the token using the secret
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach decoded data to the request object
        next(); // Continue to the next middleware or route handler
        console.log('Authorization header:', req.headers.authorization);
    } catch (error) {
        console.error('Error decoding JWT:', error);
        res.status(401).send({ error: 'Invalid token' });
        console.log('Authorization header:', req.headers.authorization);

    }
};

export default authMiddleware;


// import jwt from 'jsonwebtoken';

// const authMiddleware = (req, res, next) => {
//     const token = req.cookies.authToken || req.headers.authorization.split(' ')[1];
//     if (!token) {
//         return res.status(401).send({ error: 'No token, No autenticado' });
//     }
//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded;
//         next();
//     } catch (error) {
//         console.error('Error decoding JWT:', error);
//         res.status(401).send({ error: 'Token inválido' });
//     }
// };

// export default authMiddleware;