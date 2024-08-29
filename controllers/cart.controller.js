import CartDAO from '../dao/cart.dao.js';
import productModel from '../models/product.model.js';
import userModel from '../models/user.model.js';
import cartRepository from '../repositories/cart.repository.js';

//El controlador maneja la lógica para agregar productos al carrito:

export const getCart = async (req, res) => {
  try {
    const userId = req.user._id; // Obtiene el ID del usuario logueado
    console.log(userId);
    const user = await userModel.findById(userId).populate('cart');
    if (user.cart) {
      return res.render('cart', { cart: user.cart.toObject() });
    }
    const newCart = await cartRepository.createCartForUser(userId); // Crea el carrito y lo asocia al usuario
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: 'Error creando el carrito.' });
  }
};
export const addProductToCart = async (req, res) => {
  try {
      const { productId, quantity } = req.body;
      const userId = req.user._id; // Corregido para obtener el ID del usuario desde req.user
      console.log('Agregando producto al carrito:', { userId, productId, quantity });
      const result = await CartDAO.addProductToCart(userId, productId, quantity);
      res.status(200).json(result);
  } catch (error) {
      console.error('Error al agregar producto al carrito:', error);
      res.status(500).json({ message: 'Error al agregar producto al carrito' });
  }
};


export const removeProductFromCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId } = req.params;

        const cart = await CartDAO.removeProductFromCart(userId, productId);
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error al remover producto del carrito', error });
    }
};

export const clearCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const cart = await CartDAO.clearCart(userId);
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error al vaciar el carrito', error });
    }
};


// Exportar todo como un objeto predeterminado
export default {
  getCart,
  addProductToCart,
  removeProductFromCart,
  clearCart
};
