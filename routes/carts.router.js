import { Router } from 'express';
import cartModel from '../models/cart.model.js';
import userModel from '../models/user.model.js'; // Importa el modelo User
import productModel from '../models/product.model.js'; // Importa el modelo Product

const routerC = Router();

// Obtener todos los carritos
routerC.get('/', async (req, res) => {
    try {
        const carts = await cartModel.find().populate({
            path: 'products.productId',
            select: 'code title description price category stock'
        });
        res.json({ status: 'success', payload: carts });
    } catch (error) {
        console.error('Error al obtener los carritos:', error);
        res.status(500).json({ status: 'error', message: 'Error al obtener los carritos' });
    }
});

// Obtener un carrito por su ID
routerC.get('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartModel.findById(cartId).populate({
            path: 'products.productId',
            select: 'code title description price category stock'
        });
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }
        res.json({ status: 'success', payload: cart });
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).json({ status: 'error', message: 'Error al obtener el carrito' });
    }
});

// // Crear un nuevo carrito
// routerC.post('/', async (req, res) => {
//     try {
//         const newCart = new cartModel(req.body);
//         const savedCart = await newCart.save();
//         res.status(201).json({ status: 'success', payload: savedCart });
//     } catch (error) {
//         console.error('Error al crear el carrito:', error);
//         res.status(400).json({ status: 'error', message: 'Error al crear el carrito' });
//     }
// });

// Crear un nuevo carrito para un usuario específico
routerC.post('/:uid', async (req, res) => {
    try {
        const userId = req.params.uid;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
        }
        const newCart = new cartModel(req.body);
        const savedCart = await newCart.save();
        
        // Asociar el carrito al usuario
        user.cart = savedCart._id;
        await user.save();

        res.status(201).json({ status: 'success', payload: savedCart });
    } catch (error) {
        console.error('Error al crear el carrito:', error);
        res.status(400).json({ status: 'error', message: 'Error al crear el carrito' });
    }
});

// Actualizar un carrito con un arreglo de productos
routerC.put('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const products = req.body.products;
        const updatedCart = await cartModel.findByIdAndUpdate(cartId, { products }, { new: true }).populate({
            path: 'products.productId',
            select: 'code title description price category stock'
        });
        res.json({ status: 'success', payload: updatedCart });
    } catch (error) {
        console.error('Error al actualizar el carrito:', error);
        res.status(400).json({ status: 'error', message: 'Error al actualizar el carrito' });
    }
});

// Eliminar todos los productos del carrito
routerC.delete('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const updatedCart = await cartModel.findByIdAndUpdate(cartId, { products: [] }, { new: true });
        res.json({ status: 'success', payload: updatedCart });
    } catch (error) {
        console.error('Error al eliminar los productos del carrito:', error);
        res.status(400).json({ status: 'error', message: 'Error al eliminar los productos del carrito' });
    }
});

// Agregar un producto al carrito o actualizar la cantidad
routerC.put('/:cid/products/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity;
        const cart = await cartModel.findById(cartId);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }
        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
        }
        const existingProductIndex = cart.products.findIndex(item => item.productId.toString() === productId);
        if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].quantity = quantity;
        } else {
            cart.products.push({ productId, quantity });
        }
        const updatedCart = await cart.save();
        res.json({ status: 'success', payload: updatedCart });
    } catch (error) {
        console.error('Error al agregar o actualizar el producto en el carrito:', error);
        res.status(400).json({ status: 'error', message: 'Error al agregar o actualizar el producto en el carrito' });
    }
});

// Actualizar la cantidad de un producto en el carrito
routerC.put('/:cid/products/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity;
        const cart = await cartModel.findById(cartId);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }
        const existingProductIndex = cart.products.findIndex(item => item.productId.toString() === productId);
        if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].quantity = quantity;
            const updatedCart = await cart.save();
            return res.json({ status: 'success', payload: updatedCart });
        }
        return res.status(404).json({ status: 'error', message: 'Producto no encontrado en el carrito' });
    } catch (error) {
        console.error('Error al actualizar la cantidad del producto en el carrito:', error);
        res.status(400).json({ status: 'error', message: 'Error al actualizar la cantidad del producto en el carrito' });
    }
});

// Eliminar un producto del carrito (funciona - postman)
routerC.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const cart = await cartModel.findById(cartId);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }
        cart.products = cart.products.filter(item => item.productId.toString() !== productId);
        const updatedCart = await cart.save();
        res.json({ status: 'success', payload: updatedCart });
    } catch (error) {
        console.error('Error al eliminar el producto del carrito:', error);
        res.status(400).json({ status: 'error', message: 'Error al eliminar el producto del carrito' });
    }
});

export default routerC;