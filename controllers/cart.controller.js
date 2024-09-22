import CartDAO from '../dao/cart.dao.js';
import userModel from '../models/user.model.js';
import cartRepository from '../repositories/cart.repository.js';
import ProductDAO from '../dao/product.dao.js';


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
      const userId = req.user._id;
      const userRole = req.user.role;

      console.log('Agregando producto al carrito:', { userId, productId, quantity });

      // Verificar si el usuario es premium y si el producto le pertenece
      if (userRole === 'premium') {
        // Obtener el producto por su ID
        const product = await ProductDAO.getById(productId);
        
        // Verificar si el producto pertenece al usuario premium
        if (product.owner === userId.toString()) {
            return res.status(403).json({ 
                status: 'error', 
                message: 'No puedes agregar tus propios productos al carrito.' 
            });
        }
    }

      const result = await CartDAO.addProductToCart(userId, productId, quantity);
      res.status(200).json(result);
  } catch (error) {
      console.error('Error al agregar producto al carrito:', error);
      res.status(500).json({ message: 'Error al agregar producto al carrito' });
  }
};

export const purchaseCart = async (req, res) => {
  try {
      const userId = req.user._id;
      
      // Obtener el carrito del usuario
      const cart = await CartDAO.getCartByUserId(userId);

      if (!cart || cart.products.length === 0) {
          return res.status(400).json({ message: 'El carrito está vacío' });
      }

      // Recorrer los productos en el carrito y restar el stock
      const productUpdates = cart.products.map(async item => {
          const product = await ProductDAO.getById(item.productId._id);

          // Verificar si hay suficiente stock
          if (product.stock < item.quantity) {
              throw new Error(`No hay suficiente stock para el producto: ${product.title}`);
          }

          // Restar la cantidad comprada del stock
          product.stock -= item.quantity;
          await product.save();
      });

      // Esperar a que se completen todas las actualizaciones de stock
      await Promise.all(productUpdates);

      // Vaciar el carrito después de la compra
      await CartDAO.clearCart(userId);

      res.status(200).json({ message: 'Compra realizada con éxito, el carrito ha sido vaciado.' });
  } catch (error) {
      console.error('Error al procesar la compra:', error);
      res.status(500).json({ message: 'Error al procesar la compra' });
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
  purchaseCart,
  removeProductFromCart,
  clearCart
};
