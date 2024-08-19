import express from 'express';
import cartModel from '../models/cart.model.js';
import productModel from '../models/product.model.js';
import authMiddleware from '../middleware/authMiddleware.js';

const cartRouter = express.Router();

// Crear un carrito (opcional si lo haces al registrar usuario)
cartRouter.post('/', authMiddleware, async (req, res) => {
    try {
        const newCart = await cartModel.create({ products: [] });
        res.status(201).send(newCart);
    } catch (error) {
        res.status(500).send({ error: 'Error al crear el carrito' });
    }
});

// Obtener el carrito del usuario
cartRouter.get('/:cartId', authMiddleware, async (req, res) => {
    try {
        //const cart = await cartModel.findById(req.params.cartId).populate('products.product');
        const cart = await cartModel.findById(req.params.cartId).populate('products.product');
        if (!cart) return res.status(404).send({ error: 'Carrito no encontrado' });
        res.render('cart', { cart });
    } catch (error) {
        console.error('Error al mostrar el carrito:', error);
        res.status(500).send({ error: 'Error en el servidor' });
    }
});

// cartRouter.get('/:cartId', authMiddleware, async (req, res) => {
//     try {
//         const cart = await cartModel.findById(req.params.cartId).populate('products.product');
//         if (!cart) return res.status(404).send({ error: 'Carrito no encontrado' });
//         res.status(200).send(cart);
//     } catch (error) {
//         res.status(500).send({ error: 'Error al obtener el carrito' });
//     }
// });

// Agregar un producto al carrito
cartRouter.post('/:cartId/products/:productId', authMiddleware, async (req, res) => {
    try {
        const { cartId, productId } = req.params;
        const cart = await cartModel.findById(cartId);
        if (!cart) return res.status(404).send({ error: 'Carrito no encontrado' });

        const product = await productModel.findById(productId);
        if (!product) return res.status(404).send({ error: 'Producto no encontrado' });

        const productInCart = cart.products.find(p => p.product.toString() === productId);
        if (productInCart) {
            productInCart.quantity += 1;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }

        await cart.save();
        res.status(200).send(cart);
    } catch (error) {
        res.status(500).send({ error: 'Error al agregar el producto al carrito (Router)' });
    }
});

// Eliminar un producto del carrito
cartRouter.delete('/:cartId/products/:productId', authMiddleware, async (req, res) => {
    try {
        const { cartId, productId } = req.params;
        const cart = await cartModel.findById(cartId);
        if (!cart) return res.status(404).send({ error: 'Carrito no encontrado' });

        cart.products = cart.products.filter(p => p.product.toString() !== productId);

        await cart.save();
        res.status(200).send(cart);
    } catch (error) {
        res.status(500).send({ error: 'Error al eliminar el producto del carrito' });
    }
});

// Vaciar el carrito
cartRouter.delete('/:cartId', authMiddleware, async (req, res) => {
    try {
        const { cartId } = req.params;
        const cart = await cartModel.findById(cartId);
        if (!cart) return res.status(404).send({ error: 'Carrito no encontrado' });

        cart.products = [];

        await cart.save();
        res.status(200).send(cart);
    } catch (error) {
        res.status(500).send({ error: 'Error al vaciar el carrito' });
    }
});

export default cartRouter;


// VERSION 2

// import { Router } from 'express';
// import {
//     createCart,
//     getCartById,
//     addProductToCart,
//     removeProductFromCart,
//     updateProductQuantity,
//     clearCart,
//     purchase
// } from '../controllers/cart.controller.js';
// import { isUser } from '../middleware/auth.js';

// const router = Router();

// router.post('/', createCart);
// router.get('/:cid', getCartById);
// router.post('/:cid/product/:pid', isUser, addProductToCart);
// router.delete('/:cid/product/:pid', removeProductFromCart);
// router.put('/:cid/product/:pid', updateProductQuantity);
// router.delete('/:cid', clearCart);
// router.post('/:cid/purchase', purchase);

// export default router;

// VERSION 1

// import { Router } from 'express';
// import cartDAO from '../dao/cart.dao.js';

// const routerC = Router();

// // Obtener todos los carritos
// routerC.get('/', async (req, res) => {
//     try {
//         const carts = await cartDAO.getAll();
//         res.json({ status: 'success', payload: carts });
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).json({ status: 'error', message: 'Error al obtener los carritos' });
//     }
// });

// // Obtener un carrito por su ID
// routerC.get('/:cid', async (req, res) => {
//     try {
//         const cartId = req.params.cid;
//         const cart = await cartDAO.getById(cartId);
//         if (!cart) {
//             return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
//         }
//         res.json({ status: 'success', payload: cart });
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).json({ status: 'error', message: 'Error al obtener el carrito' });
//     }
// });

// // Crear un nuevo carrito para un usuario específico
// routerC.post('/:uid', async (req, res) => {
//     try {
//         const userId = req.params.uid;
//         const cartData = req.body;
//         const savedCart = await cartDAO.createForUser(userId, cartData);
//         res.status(201).json({ status: 'success', payload: savedCart });
//     } catch (error) {
//         console.error(error.message);
//         res.status(400).json({ status: 'error', message: 'Error al crear el carrito' });
//     }
// });

// // Eliminar un producto del carrito
// routerC.delete('/:cid/products/:pid', async (req, res) => {
//     try {
//         const cartId = req.params.cid;
//         const productId = req.params.pid;
//         const updatedCart = await cartDAO.removeProduct(cartId, productId);
//         res.json({ status: 'success', payload: updatedCart });
//     } catch (error) {
//         console.error(error.message);
//         res.status(400).json({ status: 'error', message: 'Error al eliminar el producto del carrito' });
//     }
// });

// // Actualizar la cantidad de un producto en el carrito
// routerC.put('/:cid/products/:pid/quantity', async (req, res) => {
//     try {
//         const cartId = req.params.cid;
//         const productId = req.params.pid;
//         const quantity = req.body.quantity;
//         const updatedCart = await cartDAO.updateProductQuantity(cartId, productId, quantity);
//         res.json({ status: 'success', payload: updatedCart });
//     } catch (error) {
//         console.error(error.message);
//         res.status(400).json({ status: 'error', message: 'Error al actualizar la cantidad del producto en el carrito' });
//     }
// });

// // Eliminar todos los productos del carrito
// routerC.delete('/:cid', async (req, res) => {
//     try {
//         const cartId = req.params.cid;
//         const updatedCart = await cartDAO.clearProducts(cartId);
//         res.json({ status: 'success', payload: updatedCart });
//     } catch (error) {
//         console.error(error.message);
//         res.status(400).json({ status: 'error', message: 'Error al eliminar los productos del carrito' });
//     }
// });

// // Actualizar un carrito con un arreglo de productos
// routerC.put('/:cid', async (req, res) => {
//     try {
//         const cartId = req.params.cid;
//         const products = req.body.products;
//         const updatedCart = await cartDAO.updateProducts(cartId, products);
//         res.json({ status: 'success', payload: updatedCart });
//     } catch (error) {
//         console.error(error.message);
//         res.status(400).json({ status: 'error', message: 'Error al actualizar el carrito' });
//     }
// });
// // Agregar un producto al carrito o actualizar la cantidad
// routerC.put('/:cid/products/:pid', async (req, res) => {
//     try {
//         const cartId = req.params.cid;
//         const productId = req.params.pid;
//         const quantity = req.body.quantity;
//         const updatedCart = await cartDAO.addOrUpdateProduct(cartId, productId, quantity);
//         res.json({ status: 'success', payload: updatedCart });
//     } catch (error) {
//         console.error(error.message);
//         res.status(400).json({ status: 'error', message: 'Error al agregar o actualizar el producto en el carrito' });
//     }
// });




// export default routerC;
