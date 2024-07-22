import cartModel from '../models/cart.model.js';
import userModel from '../models/user.model.js'; // Importa el modelo User
import productModel from '../models/product.model.js'; // Importa el modelo Product

class CartDAO {
    async getAll() {
        try {
            return await cartModel.find().populate({
                path: 'products.productId',
                select: 'code title description price category stock'
            });
        } catch (error) {
            throw new Error('Error al obtener los carritos');
        }
    }

    async getById(cartId) {
        try {
            return await cartModel.findById(cartId).populate({
                path: 'products.productId',
                select: 'code title description price category stock'
            });
        } catch (error) {
            throw new Error('Error al obtener el carrito');
        }
    }

    async createForUser(userId, cartData) {
        try {
            const user = await userModel.findById(userId);
            if (!user) {
                throw new Error('Usuario no encontrado');
            }
            const newCart = new cartModel(cartData);
            const savedCart = await newCart.save();
            user.cart = savedCart._id;
            await user.save();
            return savedCart;
        } catch (error) {
            throw new Error('Error al crear el carrito');
        }
    }

    async updateProducts(cartId, products) {
        try {
            return await cartModel.findByIdAndUpdate(cartId, { products }, { new: true }).populate({
                path: 'products.productId',
                select: 'code title description price category stock'
            });
        } catch (error) {
            throw new Error('Error al actualizar el carrito');
        }
    }

    async clearProducts(cartId) {
        try {
            return await cartModel.findByIdAndUpdate(cartId, { products: [] }, { new: true });
        } catch (error) {
            throw new Error('Error al eliminar los productos del carrito');
        }
    }

    async addOrUpdateProduct(cartId, productId, quantity) {
        try {
            const cart = await cartModel.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }
            const product = await productModel.findById(productId);
            if (!product) {
                throw new Error('Producto no encontrado');
            }
            const existingProductIndex = cart.products.findIndex(item => item.productId.toString() === productId);
            if (existingProductIndex !== -1) {
                cart.products[existingProductIndex].quantity = quantity;
            } else {
                cart.products.push({ productId, quantity });
            }
            return await cart.save();
        } catch (error) {
            throw new Error('Error al agregar o actualizar el producto en el carrito');
        }
    }

    async updateProductQuantity(cartId, productId, quantity) {
        try {
            const cart = await cartModel.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }
            const existingProductIndex = cart.products.findIndex(item => item.productId.toString() === productId);
            if (existingProductIndex !== -1) {
                cart.products[existingProductIndex].quantity = quantity;
                return await cart.save();
            } else {
                throw new Error('Producto no encontrado en el carrito');
            }
        } catch (error) {
            throw new Error('Error al actualizar la cantidad del producto en el carrito');
        }
    }

    async removeProduct(cartId, productId) {
        try {
            const cart = await cartModel.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }
            cart.products = cart.products.filter(item => item.productId.toString() !== productId);
            return await cart.save();
        } catch (error) {
            throw new Error('Error al eliminar el producto del carrito');
        }
    }
}

export default new CartDAO();
