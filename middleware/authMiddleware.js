import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    const token = req.cookies.authToken; // Obtener el token de la cookie

    if (!token) {
        return res.status(401).send({ error: 'No autenticado' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).send({ error: 'Token inválido' });
    }
};

export default authMiddleware;