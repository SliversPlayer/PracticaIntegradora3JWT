import cartModel from '../models/cart.model.js';

class CartDAO {
    async createCartForUser(userId) {
        try {
            const newCart = new cartModel({ user: userId, products: [] }); // Crea un nuevo carrito con el userId
            const savedCart = await newCart.save(); // Guarda el carrito en la base de datos
            await userModel.findByIdAndUpdate(userId, { cart: savedCart._id }); // Actualiza el usuario con el ID del carrito
            logger.info(`Carrito creado para el usuario ${userId}`);
            return savedCart;
        } catch (error) {
            logger.error(`${errorMessages.CART_CREATION_FAILED}: ${error.message}`);
            throw new Error(errorMessages.CART_CREATION_FAILED);
        }
    }
    async getCartByUserId(userId) {
        return await cartModel.findOne({ user: userId }).populate('products.productId');
    }

    async addProductToCart(userId, productId, quantity = 1) {
        const cart = await this.getCartByUserId(userId);
        const productIndex = cart.products.findIndex(p => p.productId.equals(productId));

        if (productIndex > -1) {
            // Si el producto ya está en el carrito, aumenta la cantidad
            cart.products[productIndex].quantity += quantity;
        } else {
            // Si el producto no está en el carrito, añádelo
            cart.products.push({ productId, quantity });
        }

        await cart.save();
        return cart;
    }

    async removeProductFromCart(userId, productId) {
        const cart = await this.getCartByUserId(userId);
        cart.products = cart.products.filter(p => !p.productId.equals(productId));

        await cart.save();
        return cart;
    }

    async clearCart(userId) {
        const cart = await this.getCartByUserId(userId);
        cart.products = [];

        await cart.save();
        return cart;
    }
}

export default new CartDAO();
