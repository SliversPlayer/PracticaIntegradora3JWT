import CartRepositoryImpl from '../repositories/cart.repository.impl.js';
import ProductRepositoryImpl from '../repositories/product.repository.impl.js';
import TicketRepository from '../repositories/ticket.repository.js';

const cartRepository = new CartRepositoryImpl();
const productRepository = new ProductRepositoryImpl();
const ticketRepository = new TicketRepository();

export const createCart = async (req, res) => {
  try {
    const newCart = await cartRepository.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: 'Error creating cart' });
  }
};

export const getCartById = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartRepository.getCartById(cid);
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Error getting cart' });
  }
};

export const addProductToCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartRepository.addProductToCart(cid, pid);
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Error adding product to cart' });
  }
};

export const removeProductFromCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartRepository.removeProductFromCart(cid, pid);
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Error removing product from cart' });
  }
};

export const updateProductQuantity = async (req, res) => {
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

export const clearCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartRepository.clearCart(cid);
    res.status(200).json({ message: 'All products in the cart have been removed', cart });
  } catch (error) {
    res.status(500).json({ error: 'Error clearing cart' });
  }
};

export const purchase = async (req, res) => {
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