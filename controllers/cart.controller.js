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
    const { productId } = req.body;
    let cart = await Cart.findOne({ user: req.userId });

    if (!cart) {
        cart = new Cart({ user: req.userId, products: [] });
    }

    const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
    if (productIndex > -1) {
        cart.products[productIndex].quantity += 1;
    } else {
        cart.products.push({ productId });
    }

    await cart.save();
    res.status(200).json(cart);
} catch (error) {
    res.status(500).json({ error: 'Failed to add to cart' });
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
