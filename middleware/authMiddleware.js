import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    const token = req.cookies.authToken || req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(401).send({ error: 'No token, No autenticado' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Error decoding JWT:', error);
        res.status(401).send({ error: 'Token inválido' });
    }
};

export default authMiddleware;