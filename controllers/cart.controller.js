import CartRepositoryImpl from '../repositories/cart.repository.impl.js';
import ProductRepositoryImpl from '../repositories/product.repository.impl.js';
import TicketRepository from '../repositories/ticket.repository.js';

const cartRepository = new CartRepositoryImpl();
const productRepository = new ProductRepositoryImpl();
const ticketRepository = new TicketRepository();

const createCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await userModel.findById(userId).populate('cart');
    if (user.cart) {
      return res.status(400).json({ error: 'El usuario ya tiene un carrito asociado.' });
    }

    const newCart = await cartRepository.createCartForUser(userId);
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: 'Error creando el carrito.' });
  }
};

const getCartById = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await cartRepository.getCartByUserId(userId);
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado.' });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo el carrito1.' });
  }
};

const addProductToCart = async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.params;
  const { quantity } = req.body;

  try {
    const updatedCart = await cartRepository.addProductToUserCart(userId, productId, quantity);
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removeProductFromCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartRepository.removeProductFromCart(cid, pid);
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Error removing product from cart' });
  }
};

const updateProductQuantity = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (typeof quantity !== 'number' || quantity <= 0) {
      return res.status(400).json({ error: 'Quantity must be a positive number' });
    }

    const cart = await cartRepository.updateProductQuantity(cid, pid, quantity);
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Error updating product quantity in cart' });
  }
};

const clearCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartRepository.clearCart(cid);
    res.status(200).json({ message: 'All products in the cart have been removed', cart });
  } catch (error) {
    res.status(500).json({ error: 'Error clearing cart' });
  }
};

const purchase = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartRepository.getCartById(cartId);

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const purchaseDetails = [];
    const failedProducts = [];
    let totalAmount = 0;

    for (const item of cart.products) {
      const product = await productRepository.findById(item.product._id);

      if (product.stock >= item.quantity) {
        product.stock -= item.quantity;
        await product.save();
        purchaseDetails.push({ product: item.product, quantity: item.quantity });
        totalAmount += product.price * item.quantity;
      } else {
        failedProducts.push(item.product._id);
      }
    }

    if (purchaseDetails.length > 0) {
      const ticketData = {
        amount: totalAmount,
        purchaser: req.user.email
      };
      await ticketRepository.createTicket(ticketData);
    }

    await cartRepository.clearCart(cartId);

    return res.status(200).json({
      message: 'Purchase processed',
      purchaseDetails,
      failedProducts
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Exportar todo como un objeto predeterminado
export default {
  createCart,
  getCartById,
  addProductToCart,
  removeProductFromCart,
  updateProductQuantity,
  clearCart,
  purchase
};
