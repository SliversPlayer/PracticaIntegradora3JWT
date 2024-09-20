import jwt from 'jsonwebtoken';

// Función auxiliar para obtener el token desde la cabecera o cookies
const getToken = (req) => {
    return req.cookies.authToken || (req.header('Authorization') && req.header('Authorization').replace('Bearer ', ''));
};
export const isAuthenticated = (req, res, next) => {
    const token = getToken(req);
    
    if (!token) {
        console.log('Authorization header or authToken cookie not found.');
        return res.redirect('/login');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Error decoding JWT:', error);
        res.redirect('/login');
    }
};

export const isNotAuthenticated = (req, res, next) => {
    const token = getToken(req);
    
    if (!token) {
        return next(); // Usuario no autenticado, permitir acceso
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET);
        res.redirect('/current'); // Usuario ya autenticado, redirigir a otra página
    } catch (error) {
        next(); // Token inválido, tratar como no autenticado
    }
};

export const isAdmin = (req, res, next) => {
    const token = getToken(req);

    if (!token) {
        return res.status(403).json({ message: 'Acceso denegado: No autenticado' });
    }

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
    const token = getToken(req);

    if (!token) {
        return res.status(403).json({ message: 'Acceso denegado: No autenticado' });
    }

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

export const isAdminOrPremium = (req, res, next) => {
    const token = getToken(req);

    if (!token) {
        return res.status(403).json({ message: 'Acceso denegado: No autenticado' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Decodifica y guarda el usuario

        // Permitir si es admin o premium
        if (decoded.role === 'admin' || decoded.role === 'premium') {
            return next();
        }

        return res.status(403).json({ message: 'Acceso denegado: Solo administradores o usuarios premium pueden realizar esta acción.' });

    } catch (error) {
        res.status(403).json({ message: 'Acceso denegado: Token inválido' });
    }
};
