import jwt from 'jsonwebtoken';

export const isAuthenticated = (req, res, next) => {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
        return res.redirect('/login');
    }

    const token = authHeader.replace('Bearer ', '');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.redirect('/login');
    }
};

export const isNotAuthenticated = (req, res, next) => {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
        return next(); // Usuario no autenticado, permitir acceso
    }

    try {
        const token = authHeader.replace('Bearer ', '');
        jwt.verify(token, process.env.JWT_SECRET);
        res.redirect('/profile'); // Usuario ya autenticado, redirigir a otra página
    } catch (error) {
        next(); // Token inválido, tratar como no autenticado
    }
};

export const isAdmin = (req, res, next) => {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
        return res.status(403).json({ message: 'Acceso denegado: No autenticado' });
    }

    const token = authHeader.replace('Bearer ', '');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role === 'admin') {
            req.user = decoded;
            next();
        } else {
            res.status(403).json({ message: 'Acceso denegado: Solo los administradores pueden realizar esta acción.' });
        }
    } catch (error) {
        res.status(403).json({ message: 'Acceso denegado: Token inválido' });
    }
};

export const isUser = (req, res, next) => {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
        return res.status(403).json({ message: 'Acceso denegado: No autenticado' });
    }

    const token = authHeader.replace('Bearer ', '');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role === 'user') {
            req.user = decoded;
            next();
        } else {
            res.status(403).json({ message: 'Acceso denegado: Solo los usuarios pueden realizar esta acción.' });
        }
    } catch (error) {
        res.status(403).json({ message: 'Acceso denegado: Token inválido' });
    }
};