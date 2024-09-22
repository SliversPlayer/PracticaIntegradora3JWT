

import { Router } from 'express';
import ProductManager from '../dao/ProductManager.js'
import { __dirname } from '../utils.js'
import { isAuthenticated, isNotAuthenticated, isAdmin } from '../middleware/auth.js';

const pm=new ProductManager(__dirname+'/src/bbdd.json')
const router = Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Renderizar la vista principal con productos
 *     tags: [Views]
 *     responses:
 *       200:
 *         description: Vista principal renderizada
 */

/**
 * @swagger
 * /login:
 *   get:
 *     summary: Renderizar la vista de login
 *     tags: [Views]
 *     responses:
 *       200:
 *         description: Vista de login renderizada
 */

/**
 * @swagger
 * /register:
 *   get:
 *     summary: Renderizar la vista de registro
 *     tags: [Views]
 *     responses:
 *       200:
 *         description: Vista de registro renderizada
 */

/**
 * @swagger
 * /current:
 *   get:
 *     summary: Renderizar la vista del usuario actual
 *     tags: [Views]
 *     responses:
 *       200:
 *         description: Vista del usuario actual renderizada
 */

/**
 * @swagger
 * /forgot-password:
 *   get:
 *     summary: Renderizar la vista de recuperación de contraseña
 *     tags: [Views]
 *     responses:
 *       200:
 *         description: Vista de recuperación de contraseña renderizada
 */

/**
 * @swagger
 * /reset-password/{token}:
 *   get:
 *     summary: Renderizar la vista de restablecimiento de contraseña
 *     tags: [Views]
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Token de restablecimiento de contraseña
 *     responses:
 *       200:
 *         description: Vista de restablecimiento de contraseña renderizada
 */

/**
 * @swagger
 * /realTimeProducts:
 *   get:
 *     summary: Renderizar la vista de productos en tiempo real
 *     tags: [Views]
 *     responses:
 *       200:
 *         description: Vista de productos en tiempo real renderizada
 */

router.get("/",async(req,res)=>{
    const listadeproductos=await pm.getProductsView()
    res.render("home",{listadeproductos})
})
router.get('/login', isNotAuthenticated, (req, res) => {
    res.render('login');
});
router.get('/register', isNotAuthenticated, (req, res) => {
    res.render('register');
});
router.get('/current', isAuthenticated, (req, res) => {
    res.render('current', { user: req.session.user });
});

// Vista de administración de usuarios, protegida por isAdmin
router.get('/adminUsers', isAdmin, (req, res) => {
    res.render('adminUsers', { user: req.user });  // Enviar información del usuario autenticado
});

router.get('/forgot-password', (req, res) => {
    res.render('forgotPassword');
});

router.get('/reset-password/:token', (req, res) => {
    res.render('resetPassword', { token: req.params.token });
});
router.get("/realTimeProducts",(req,res)=>{
    res.render("realTimeProducts")
});

export default router