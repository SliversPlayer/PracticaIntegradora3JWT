import ProductRepository from './product.repository.js';
import Product from '../models/product.model.js';
import mongoose from 'mongoose';

export default class ProductRepositoryImpl extends ProductRepository {
  async create(product) {
    const newProduct = new Product(product);
    return await newProduct.save();
  }

  async findAll(filter, options) {
    return await Product.paginate(filter, options);
  }

  async findById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid ID");
    }
    return await Product.findById(id);
  }

  async update(id, product) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid ID");
    }
    return await Product.findByIdAndUpdate(id, product, { new: true });
  }

  async delete(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid ID");
    }
    return await Product.findByIdAndDelete(id);
  }
}