import cartModel from '../models/cart.model.js';
import userModel from '../models/user.model.js'; // Asegúrate de tener este import
import logger from '../utils/logger.js'; // Asegúrate de que tu logger está correctamente configurado
import errorMessages from '../utils/errorMessages.js';; // Asegúrate de que tienes un archivo de constantes para los mensajes de error
import productModel from '../models/product.model.js'; // Asegúrate de importar el modelo de producto


class CartDAO {
    async createCartForUser(userId) {
        try {
            const newCart = new cartModel({ user: userId, products: [] });
            const savedCart = await newCart.save();
            await userModel.findByIdAndUpdate(userId, { cart: savedCart._id });
            logger.info(`Carrito creado para el usuario ${userId}`);
            return savedCart;
        } catch (error) {
            logger.error(`${errorMessages.CART_CREATION_FAILED}: ${error.message}`);
            throw new Error(errorMessages.CART_CREATION_FAILED);
        }
    }

    async getCartByUserId(userId) {
        try {
            const cart = await cartModel.findOne({ user: userId }).populate('products.productId');
            if (!cart) {
                logger.warn(`Carrito no encontrado para el usuario ${userId}`);
            }
            return cart;
        } catch (error) {
            logger.error(`Error al obtener el carrito para el usuario ${userId}: ${error.message}`);
            throw new Error(`Error al obtener el carrito para el usuario ${userId}`);
        }
    }

    async addProductToCart(userId, productId, quantity = 1) {
        try {
            let cart = await this.getCartByUserId(userId);
            
            if (!cart) {
                logger.info(`Carrito no encontrado para el usuario ${userId}, creando un nuevo carrito.`);
                cart = await this.createCartForUser(userId);
            }

            // Obtener el producto desde la base de datos
            const product = await productModel.findById(productId);
            if (!product) {
                throw new Error('Producto no encontrado');
            }


            // Verificar si el dueño del producto es el mismo que el dueño del carrito
            const user = await userModel.findById(userId);
            if (user.role === 'premium' && product.owner === user.email) {
                throw new Error('No puedes agregar tu propio producto al carrito');
            }

            const productIndex = cart.products.findIndex(p => p.productId.equals(productId));

            if (productIndex > -1) {
                logger.info(`Producto ${productId} ya existe en el carrito, aumentando cantidad.`);
                cart.products[productIndex].quantity += quantity;
            } else {
                logger.info(`Añadiendo nuevo producto ${productId} al carrito.`);
                cart.products.push({ productId, quantity });
            }

            await cart.save();
            logger.info(`Producto ${productId} agregado al carrito del usuario ${userId}.`);
            return cart;
        } catch (error) {
            logger.error(`Error al agregar producto al carrito: ${error.message}`);
            throw new Error('Error al agregar producto al carrito');
        }
    }

    async removeProductFromCart(userId, productId) {
        try {
            const cart = await this.getCartByUserId(userId);

            if (!cart) {
                logger.warn(`Carrito no encontrado para el usuario ${userId} al intentar eliminar un producto.`);
                throw new Error(`Carrito no encontrado para el usuario ${userId}`);
            }

            cart.products = cart.products.filter(p => !p.productId.equals(productId));

            await cart.save();
            logger.info(`Producto ${productId} eliminado del carrito del usuario ${userId}.`);
            return cart;
        } catch (error) {
            logger.error(`Error al eliminar producto del carrito: ${error.message}`);
            throw new Error('Error al eliminar producto del carrito');
        }
    }

    async clearCart(userId) {
        try {
            const cart = await this.getCartByUserId(userId);

            if (!cart) {
                logger.warn(`Carrito no encontrado para el usuario ${userId} al intentar vaciarlo.`);
                throw new Error(`Carrito no encontrado para el usuario ${userId}`);
            }

            cart.products = [];
            await cart.save();
            logger.info(`Carrito del usuario ${userId} vaciado.`);
            return cart;
        } catch (error) {
            logger.error(`Error al vaciar el carrito: ${error.message}`);
            throw new Error('Error al vaciar el carrito');
        }
    }
}

export default new CartDAO();