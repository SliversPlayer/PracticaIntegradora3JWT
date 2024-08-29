import CartDAO from '../dao/cart.dao.js';
import userModel from '../models/user.model.js';
import cartRepository from '../repositories/cart.repository.js';

export const getCart = async (req, res) => {
  try {
    const userId = req.user._id; // Obtiene el ID del usuario logueado
    console.log(`User ID: ${userId}`);

    // Obtener el carrito del usuario poblado con los productos
    const user = await userModel.findById(userId).populate({
      path: 'cart',
      populate: {
        path: 'products.productId',
        model: 'products', // Asegura que coincide con el nombre del modelo
        select: 'title price', // Selecciona solo los campos necesarios del producto
      },
    });

    if (user.cart) {
      // Renderiza la vista del carrito con los productos poblados
      return res.render('cart', { cart: user.cart.toObject() });
    }

    // Crea el carrito y lo asocia al usuario si no existe
    const newCart = await cartRepository.createCartForUser(userId);
    res.status(201).json(newCart);
  } catch (error) {
    console.error('Error al obtener el carrito:', error);
    res.status(500).json({ error: 'Error obteniendo el carrito.' });
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
