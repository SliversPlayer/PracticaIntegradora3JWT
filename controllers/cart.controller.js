import CartDAO from '../dao/cart.dao.js';
import productModel from '../models/product.model.js';

export const getCart = async (req, res) => {
  try {
    const userId = req.user._id; // Obtiene el ID del usuario logueado
    console.log(userId);
    const user = await userModel.findById(userId).populate('cart');
    if (user.cart) {
      return res.status(400).json({ error: 'El usuario ya tiene un carrito asociado.' });
    }

    const newCart = await cartRepository.createCartForUser(userId); // Crea el carrito y lo asocia al usuario
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: 'Error creando el carrito.' });
  }
};

export const addProductToCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId, quantity } = req.body;

        // Verifica si el producto existe
        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        const cart = await CartDAO.addProductToCart(userId, productId, quantity);
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error al agregar producto al carrito', error });
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
