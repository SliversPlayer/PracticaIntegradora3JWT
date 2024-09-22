import productModel from '../models/product.model.js';
import errorMessages from '../utils/errorMessages.js';
import logger from '../utils/logger.js';

class ProductDAO {
    async getAll({ page = 1, limit = 10, category = '', sort = '' }) {
        try {
            const query = {};

            if (category) {
                query.category = category;
            }

            const options = {
                page,
                limit,
                lean: true,
            };

            if (sort === 'asc') {
                options.sort = { price: 1 };
            } else if (sort === 'desc') {
                options.sort = { price: -1 };
            }

            const products = await productModel.paginate(query, options);
            logger.info('Se obtuvieron todos los productos');
            return products;
        } catch (error) {
            logger.error(`${errorMessages.PRODUCT_RETRIEVAL_FAILED}: ${error.message}`);
            throw new Error(errorMessages.PRODUCT_RETRIEVAL_FAILED);
        }
    }

    async getById(id) {
        try {
            const product = await productModel.findById(id);
            if (!product) {
                throw new Error(errorMessages.PRODUCT_NOT_FOUND);
            }
            logger.info(`Producto ${id} encontrado`);
            return product;
        } catch (error) {
            if (error.message === errorMessages.PRODUCT_NOT_FOUND) {
                logger.warn(`${errorMessages.PRODUCT_NOT_FOUND}: ${error.message}`);
                throw error;
            }
            logger.error(`${errorMessages.PRODUCT_RETRIEVAL_FAILED}: ${error.message}`);
            throw new Error(errorMessages.PRODUCT_RETRIEVAL_FAILED);
        }
    }

    async create(data) {
        try {
            const newProduct = new productModel(data);
            const savedProduct = await newProduct.save();
            logger.info(`Producto creado con ID ${savedProduct._id}`);
            return savedProduct;
        } catch (error) {
            logger.error(`${errorMessages.PRODUCT_CREATION_FAILED}: ${error.message}`);
            throw new Error(errorMessages.PRODUCT_CREATION_FAILED);
        }
    }

    async updateById(id, data) {
        try {
            const updatedProduct = await productModel.findByIdAndUpdate(id, data, { new: true });
            if (!updatedProduct) {
                throw new Error(errorMessages.PRODUCT_NOT_FOUND);
            }
            logger.info(`Producto ${id} actualizado`);
            return updatedProduct;
        } catch (error) {
            if (error.message === errorMessages.PRODUCT_NOT_FOUND) {
                logger.warn(`${errorMessages.PRODUCT_NOT_FOUND}: ${error.message}`);
                throw error;
            }
            logger.error(`${errorMessages.PRODUCT_UPDATE_FAILED}: ${error.message}`);
            throw new Error(errorMessages.PRODUCT_UPDATE_FAILED);
        }
    }

    async deleteById(id) {
        try {
            const deletedProduct = await productModel.findByIdAndDelete(id);
            if (!deletedProduct) {
                throw new Error(errorMessages.PRODUCT_NOT_FOUND);
            }
            logger.info(`Producto ${id} eliminado`);
            return deletedProduct;
        } catch (error) {
            if (error.message === errorMessages.PRODUCT_NOT_FOUND) {
                logger.warn(`${errorMessages.PRODUCT_NOT_FOUND}: ${error.message}`);
                throw error;
            }
            logger.error(`${errorMessages.PRODUCT_DELETION_FAILED}: ${error.message}`);
            throw new Error(errorMessages.PRODUCT_DELETION_FAILED);
        }
    }
}

export default new ProductDAO();

