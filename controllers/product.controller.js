import ProductRepositoryImpl from '../repositories/product.repository.impl.js';
const productRepository = new ProductRepositoryImpl();
import productDAO from "../dao/product.dao.js";

 export const listProducts = async (req, res) => {
     try {
         const { page, limit, category, sort } = req.query;
         const result = await productDAO.getAll({ page: parseInt(page), limit: parseInt(limit), category, sort });
         result.prevLink = result.hasPrevPage ? `http://localhost:8080/api/products?page=${result.prevPage}` : '';
         result.nextLink = result.hasNextPage ? `http://localhost:8080/api/products?page=${result.nextPage}` : '';
         result.isValid = !(page <= 0 || page > result.totalPages);
         res.render("products", { products: result.docs, pagination: result });
     } catch (error) {
         console.error("Error fetching products:", error);
         res.status(500).json({ status: "error", message: "Internal server error" });
     }
 };
  
  export const getProductById = async (req, res) => {
    try {
      const { pid } = req.params;
      const product = await productRepository.findById(pid);
  
      if (!product) {
        return res.status(404).json({ status: "error", error: "Producto no encontrado" });
      }
  
      res.status(200).json(product);
    } catch (error) {
      if (error.message === "Invalid ID") {
        return res.status(400).json({ status: "error", error: "ID inválido" });
      }
      console.error("No se pudo obtener el producto por ID", error);
      res.status(500).json({ status: "error", error: "Error interno del servidor" });
    }
  };

export const addProduct = async (req, res) => {
    try {
      const { title, description, category, price, code, stock} = req.body;
  
      if (!title || !description || !category || !price || !code || !stock) {
        return res.status(400).json({ status: "error", error: "Faltan parámetros obligatorios" });
      }
  
      const newProduct = await productRepository.create({ title, description, category, price, thumbnail, code, stock, status });
      res.status(201).json(newProduct);
    } catch (error) {
      console.error("Error al agregar el producto", error);
      res.status(500).json({ status: "error", error: "Error interno del servidor" });
    }
  };
export const updateProduct = async (req, res) => {
  try {
    const { pid } = req.params;
    const productToUpdate = req.body;

    if (!productToUpdate || Object.keys(productToUpdate).length === 0) {
      return res.status(400).json({ status: "error", error: "No se proporcionaron datos para actualizar" });
    }

    const updatedProduct = await productRepository.update(pid, productToUpdate);

    if (!updatedProduct) {
      return res.status(404).json({ status: "error", error: "Producto no encontrado" });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    if (error.message === "Invalid ID") {
      return res.status(400).json({ status: "error", error: "ID inválido" });
    }
    console.error("Error al actualizar el producto", error);
    res.status(500).json({ status: "error", error: "Error interno del servidor" });
  }
};
export const deleteProduct = async (req, res) => {
    try {
      const { pid } = req.params;
  
      const deletedProduct = await productRepository.delete(pid);
  
      if (!deletedProduct) {
        return res.status(404).json({ status: "error", error: "Producto no encontrado" });
      }
  
      res.status(200).json({ status: "success", message: "Producto eliminado exitosamente" });
    } catch (error) {
      if (error.message === "Invalid ID") {
        return res.status(400).json({ status: "error", error: "ID inválido" });
      }
      console.error("Error al eliminar el producto", error);
      res.status(500).json({ status: "error", error: "Error interno del servidor" });
    }
  };


