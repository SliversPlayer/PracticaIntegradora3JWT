// import express from 'express';
// import handlebars from 'express-handlebars';
// import path from 'path';
// import { __dirname } from './utils.js';
// import { Server } from 'socket.io';
// import passport from 'passport';
// import initializePassport from './config/passport.config.js';
// import dotenv from 'dotenv';
// import cookieParser from 'cookie-parser';
// import mongoose from 'mongoose';

// // Importar routers y otros módulos necesarios
// import productsRouter from './routes/products.router.js';
// import cartsRouter from './routes/carts.router.js';
// import messagesRouter from './routes/messages.router.js';
// import viewsRouter from './routes/views.router.js';
// import socketProducts from './listener/socketProducts.js';
// import authRouter from './routes/authRouter.js'; // Importa el router de autenticación JWT
// import mockingRouter from './routes/mocking.router.js';

// // Cargar variables de entorno
// dotenv.config();
// const app = express();
// initializePassport();
// app.use(passport.initialize());

// const PORT = process.env.PORT || 8080;

// // Conexión a MongoDB
// const conString = process.env.MONGO_URI;
// mongoose.connect(conString, {
// }).then(() => {
//     console.log('Conectado a MongoDB');
// }).catch((error) => {
//     console.error('Error conectándose a MongoDB', error);
// });

// // Configuración de archivos estáticos
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static(__dirname + "/src/public"));

// // Configuración de Handlebars
// app.engine('handlebars', handlebars.engine());
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'handlebars');

// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Middleware para manejar cookies
// app.use(cookieParser());

// // Montar el router de autenticación JWT en /auth
// app.use('/auth', authRouter);

// // Middleware para manejar las rutas
// app.use('/', viewsRouter);
// app.use('/api/messages', messagesRouter);
// app.use('/api/products', productsRouter);
// app.use('/api/carts', cartsRouter);
// app.use('/api', mockingRouter);

// const httpServer = app.listen(PORT, () => {
//     try {
//         console.log(`Listening to the port ${PORT}\nAcceder a:`);
//         console.log(`\t1). http://localhost:${PORT}/api/products`);
//         console.log(`\t2). http://localhost:${PORT}/api/messages`);
//         console.log(`\t3). http://localhost:${PORT}/login`);
//         console.log(`\t4). http://localhost:${PORT}/api/mockingproducts`);
//     } catch (err) {
//         console.log(err);
//     }
// });

// const socketServer = new Server(httpServer);
// socketProducts(socketServer);

import express from 'express';
import handlebars from 'express-handlebars';
import path from 'path';
import { __dirname } from './utils.js';
import { Server } from 'socket.io';
import passport from 'passport';
import initializePassport from './config/passport.config.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
// Importar routers y otros módulos necesarios
import productsRouter from '../src/routes/products.router.js';
import cartsRouter from '../src/routes/carts.router.js';
import messagesRouter from '../src/routes/messages.router.js';
import viewsRouter from '../src/routes/views.router.js';
import socketProducts from './listener/socketProducts.js';
import authRouter from './routes/authRouter.js'; // Importa el router de autenticación JWT
import mockingRouter from './routes/mocking.router.js';

// Cargar variables de entorno
dotenv.config();
const app = express();
initializePassport();
app.use(passport.initialize());
const PORT = process.env.PORT || 8080;

// Conexión a MongoDB
const conString = process.env.MONGO_URI;
mongoose.connect(conString, {
}).then(() => {
    console.log('Conectado a MongoDB');
}).catch((error) => {
    console.error('Error conectándose a MongoDB', error);
});
// Configuración de archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + "/src/public"));
// Configuración de Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Middleware para manejar cookies
app.use(cookieParser());
// Montar el router de autenticación JWT en /auth
app.use('/', authRouter);
// Middleware para manejar las rutas
app.use('/', viewsRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api', mockingRouter);
const httpServer = app.listen(PORT, () => {
    try {
        console.log(`Listening to the port ${PORT}\nAcceder a:`);
        console.log(`\t1). http://localhost:${PORT}/api/products`);
        console.log(`\t2). http://localhost:${PORT}/api/messages`);
        console.log(`\t3). http://localhost:${PORT}/login`);
        console.log(`\t4). http://localhost:${PORT}/api/mockingproducts`);
    } catch (err) {
        console.log(err);
    }
});
const socketServer = new Server(httpServer);// Remove this part
socketProducts(socketServer);