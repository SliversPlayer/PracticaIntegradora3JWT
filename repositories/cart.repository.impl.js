import CartRepository from './cart.repository.js';
import Cart from '../models/cart.model.js';

export default class CartRepositoryImpl extends CartRepository {
    async createCart() {
        const newCart = new Cart();
        console.log("hola");
        return await newCart.save();
    }

    async getCartById(id) {
        return await Cart.findById(id).populate('products.product');
    }

    async addProductToCart(cartId, productId, quantity) {
        const cart = await CartDAO.findById(cartId);
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }

        const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
        if (productIndex > -1) {
            cart.products[productIndex].quantity += quantity;
            console.log(`Updated quantity of product ${productId} to ${cart.products[productIndex].quantity}`);
        } else {
            cart.products.push({ productId, quantity });
            console.log(`Added product ${productId} with quantity ${quantity} to cart`);
        }

        await cart.save();
        console.log(`Cart ${cartId} saved successfully`);
    }

    async removeProductFromCart(cartId, productId) {
        const cart = await Cart.findById(cartId);
        if (!cart) {
            throw new Error('Cart not found');
        }
        cart.products = cart.products.filter(p => !p.product.equals(productId));
        return await cart.save();
    }

    async updateProductQuantity(cartId, productId, quantity) {
        const cart = await Cart.findById(cartId);
        if (!cart) {
            throw new Error('Cart not found');
        }
        const productIndex = cart.products.findIndex(p => p.product.equals(productId));
        if (productIndex >= 0) {
            cart.products[productIndex].quantity = quantity;
        } else {
            throw new Error('Product not found in cart');
        }
        return await cart.save();
    }

    async clearCart(cartId) {
        const cart = await Cart.findById(cartId);
        if (!cart) {
            throw new Error('Cart not found');
        }
        cart.products = [];
        return await cart.save();
    }
}