import { Router } from 'express';
import ProductManager from '../dao/ProductManager.js'
import { __dirname } from "../utils.js"
import { isAuthenticated, isNotAuthenticated } from '../middleware/auth.js';

const pm=new ProductManager(__dirname+'/src/bbdd.json')
const router = Router();

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

router.get("/realTimeProducts",(req,res)=>{
    res.render("realTimeProducts")
    })
 
    export default router