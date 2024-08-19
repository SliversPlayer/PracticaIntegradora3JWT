import cartModel from '../models/cart.model.js';
import userModel from '../models/user.model.js';
import productModel from '../models/product.model.js';
import errorMessages from '../utils/errorMessages.js';
import logger from '../utils/logger.js';
class CartDAO {
    async getCartByUserId(userId) {
        try {
            const cart = await cartModel.findOne({ user: userId }).populate({
                path: 'products.productId',
                select: 'code title description price category stock'
            });
            if (!cart) {
                throw new Error(errorMessages.CART_NOT_FOUND);
            }
            logger.info(`Carrito para usuario ${userId} encontrado`);
            return cart;
        } catch (error) {
            if (error.message === errorMessages.CART_NOT_FOUND) {
                logger.warn(`${errorMessages.CART_NOT_FOUND}: ${error.message}`);
                throw error;
            }
            logger.error(`${errorMessages.CART_RETRIEVAL_FAILED}: ${error.message}`);
            throw new Error(errorMessages.CART_RETRIEVAL_FAILED);
        }
    }

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

    async addProductToUserCart(userId, productId, quantity) {
        try {
            const cart = await this.getCartByUserId(userId);
            return await this.addOrUpdateProduct(cart._id, productId, quantity);
        } catch (error) {
            throw new Error(errorMessages.CART_UPDATE_FAILED);
        }
    }

    // Otros métodos...
}

export default new CartDAO();

// class CartDAO {
//     async getAll() {
//         try {
//             const carts = await cartModel.find().populate({
//                 path: 'products.productId',
//                 select: 'code title description price category stock'
//             });
//             logger.info('Se obtuvieron todos los carritos');
//             return carts;
//         } catch (error) {
//             logger.error(`${errorMessages.CART_RETRIEVAL_FAILED}: ${error.message}`);
//             throw new Error(errorMessages.CART_RETRIEVAL_FAILED);
//         }
//     }

//     async getById(cartId) {
//         try {
//             const cart = await cartModel.findById(cartId).populate({
//                 path: 'products.productId',
//                 select: 'code title description price category stock'
//             });
//             if (!cart) {
//                 throw new Error(errorMessages.CART_NOT_FOUND);
//             }
//             logger.info(`Carrito ${cartId} encontrado`);
//             return cart;
//         } catch (error) {
//             if (error.message === errorMessages.CART_NOT_FOUND) {
//                 logger.warn(`${errorMessages.CART_NOT_FOUND}: ${error.message}`);
//                 throw error;
//             }
//             logger.error(`${errorMessages.CART_RETRIEVAL_FAILED}: ${error.message}`);
//             throw new Error(errorMessages.CART_RETRIEVAL_FAILED);
//         }
//     }

//     async createForUser(userId, cartData) {
//         try {
//             const user = await userModel.findById(userId);
//             if (!user) {
//                 throw new Error(errorMessages.USER_NOT_FOUND);
//             }
//             const newCart = new cartModel(cartData);
//             const savedCart = await newCart.save();
//             user.cart = savedCart._id;
//             await user.save();
//             console.log("Carro Creado");
//             logger.info(`Carrito creado para el usuario ${userId}`);
//             return savedCart;
//         } catch (error) {
//             if (error.message === errorMessages.USER_NOT_FOUND) {
//                 logger.warn(`${errorMessages.USER_NOT_FOUND}: ${error.message}`);
//                 throw error;
//             }
//             logger.error(`${errorMessages.CART_CREATION_FAILED}: ${error.message}`);
//             throw new Error(errorMessages.CART_CREATION_FAILED);
//         }
//     }

//     async updateProducts(cartId, products) {
//         try {
//             const updatedCart = await cartModel.findByIdAndUpdate(cartId, { products }, { new: true }).populate({
//                 path: 'products.productId',
//                 select: 'code title description price category stock'
//             });
//             if (!updatedCart) {
//                 throw new Error(errorMessages.CART_NOT_FOUND);
//             }
//             logger.info(`Productos actualizados en el carrito ${cartId}`);
//             return updatedCart;
//         } catch (error) {
//             if (error.message === errorMessages.CART_NOT_FOUND) {
//                 logger.warn(`${errorMessages.CART_NOT_FOUND}: ${error.message}`);
//                 throw error;
//             }
//             logger.error(`${errorMessages.CART_UPDATE_FAILED}: ${error.message}`);
//             throw new Error(errorMessages.CART_UPDATE_FAILED);
//         }
//     }

//     async clearProducts(cartId) {
//         try {
//             const updatedCart = await cartModel.findByIdAndUpdate(cartId, { products: [] }, { new: true });
//             if (!updatedCart) {
//                 throw new Error(errorMessages.CART_NOT_FOUND);
//             }
//             logger.info(`Productos eliminados del carrito ${cartId}`);
//             return updatedCart;
//         } catch (error) {
//             if (error.message === errorMessages.CART_NOT_FOUND) {
//                 logger.warn(`${errorMessages.CART_NOT_FOUND}: ${error.message}`);
//                 throw error;
//             }
//             logger.error(`${errorMessages.CART_CLEAR_FAILED}: ${error.message}`);
//             throw new Error(errorMessages.CART_CLEAR_FAILED);
//         }
//     }

//     async addOrUpdateProduct(cartId, productId, quantity) {
//         try {
//             const cart = await cartModel.findById(cartId);
//             if (!cart) {
//                 throw new Error(errorMessages.CART_NOT_FOUND);
//             }
//             const product = await productModel.findById(productId);
//             if (!product) {
//                 throw new Error(errorMessages.PRODUCT_NOT_FOUND);
//             }
//             const existingProductIndex = cart.products.findIndex(item => item.productId.toString() === productId);
//             if (existingProductIndex !== -1) {
//                 cart.products[existingProductIndex].quantity = quantity;
//             } else {
//                 cart.products.push({ productId, quantity });
//             }
//             logger.info(`Producto ${productId} añadido/actualizado en el carrito ${cartId}`);
//             return await cart.save();
//         } catch (error) {
//             if (error.message === errorMessages.CART_NOT_FOUND || error.message === errorMessages.PRODUCT_NOT_FOUND) {
//                 logger.warn(`${error.message}: ${error.message}`);
//                 throw error;
//             }
//             logger.error(`${errorMessages.CART_UPDATE_FAILED}: ${error.message}`);
//             throw new Error(errorMessages.CART_UPDATE_FAILED);
//         }
//     }

//     async updateProductQuantity(cartId, productId, quantity) {
//         try {
//             const cart = await cartModel.findById(cartId);
//             if (!cart) {
//                 throw new Error(errorMessages.CART_NOT_FOUND);
//             }
//             const existingProductIndex = cart.products.findIndex(item => item.productId.toString() === productId);
//             if (existingProductIndex !== -1) {
//                 cart.products[existingProductIndex].quantity = quantity;
//                 logger.info(`Cantidad de producto ${productId} actualizada a ${quantity} en el carrito ${cartId}`);
//                 return await cart.save();
//             } else {
//                 throw new Error(errorMessages.PRODUCT_NOT_FOUND_IN_CART);
//             }
//         } catch (error) {
//             if (error.message === errorMessages.CART_NOT_FOUND || error.message === errorMessages.PRODUCT_NOT_FOUND_IN_CART) {
//                 logger.warn(`${error.message}: ${error.message}`);
//                 throw error;
//             }
//             logger.error(`${errorMessages.CART_UPDATE_FAILED}: ${error.message}`);
//             throw new Error(errorMessages.CART_UPDATE_FAILED);
//         }
//     }

//     async removeProduct(cartId, productId) {
//         try {
//             const cart = await cartModel.findById(cartId);
//             if (!cart) {
//                 throw new Error(errorMessages.CART_NOT_FOUND);
//             }
//             cart.products = cart.products.filter(item => item.productId.toString() !== productId);
//             logger.info(`Producto ${productId} eliminado del carrito ${cartId}`);
//             return await cart.save();
//         } catch (error) {
//             if (error.message === errorMessages.CART_NOT_FOUND) {
//                 logger.warn(`${errorMessages.CART_NOT_FOUND}: ${error.message}`);
//                 throw error;
//             }
//             logger.error(`${errorMessages.PRODUCT_DELETION_FAILED}: ${error.message}`);
//             throw new Error(errorMessages.PRODUCT_DELETION_FAILED);
//         }
//     }
// }

//export default new CartDAO();

