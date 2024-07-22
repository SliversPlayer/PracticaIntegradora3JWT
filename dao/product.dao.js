import productModel from "../models/product.model.js";

class ProductDAO {
    async getAll({ page = 1, limit = 10, category = '', sort = '' }) {
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

        return await productModel.paginate(query, options);
    }

    async getById(id) {
        return await productModel.findById(id).lean();
    }

    async create(data) {
        const newProduct = new productModel(data);
        return await newProduct.save();
    }

    async updateById(id, data) {
        return await productModel.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteById(id) {
        return await productModel.findByIdAndDelete(id);
    }
}

export default new ProductDAO();
