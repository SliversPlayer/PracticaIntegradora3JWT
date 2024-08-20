import CartDAO from '../dao/cart.dao.js';

export default class CartRepository {
    createCart() {
        throw new Error("Method not implemented.");
    }

    getCartById(id) {
        throw new Error("Method not implemented.");
    }

    async addProductToCart(cartId, productId, quantity) {
        const cart = await CartDAO.findById(cartId);
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }

        const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
        if (productIndex > -1) {
            cart.products[productIndex].quantity += quantity;
        } else {
            cart.products.push({ productId, quantity });
        }

        await cart.save();
    }

    removeProductFromCart(cartId, productId) {
        throw new Error("Method not implemented.");
    }

    updateProductQuantity(cartId, productId, quantity) {
        throw new Error("Method not implemented.");
    }

    clearCart(cartId) {
        throw new Error("Method not implemented.");
    }
}