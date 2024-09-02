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
        const { pid } = req.params; // ID del producto
        const userId = req.user._id; // ID del usuario autenticado
        const userRole = req.user.role; // Rol del usuario autenticado
        const productToUpdate = req.body;

        if (!productToUpdate || Object.keys(productToUpdate).length === 0) {
            return res.status(400).json({ status: "error", error: "No se proporcionaron datos para actualizar" });
        }

        // Buscar el producto por ID
        const product = await productRepository.findById(pid);

        if (!product) {
            return res.status(404).json({ status: "error", error: "Producto no encontrado" });
        }

        // Verificar los permisos de actualización
        if (userRole === 'admin' || (userRole === 'premium' && product.owner === userId.toString())) {
            const updatedProduct = await productRepository.update(pid, productToUpdate);
            return res.status(200).json(updatedProduct);
        }

        // Si no tiene permisos
        return res.status(403).json({ status: "error", message: "No tienes permisos para actualizar este producto" });

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
      const { pid } = req.params;  // ID del producto
      const userId = req.user._id;  // ID del usuario autenticado
      const userRole = req.user.role;  // Rol del usuario autenticado

      // Buscar el producto por ID
      const product = await productRepository.findById(pid);

      if (!product) {
          return res.status(404).json({ status: "error", error: "Producto no encontrado" });
      }

      // Verificar los permisos de eliminación
      if (userRole === 'admin' || (userRole === 'premium' && product.owner === userId.toString())) {
          await productRepository.delete(pid);
          return res.status(200).json({ status: "success", message: "Producto eliminado exitosamente" });
      }

      // Si no tiene permisos
      return res.status(403).json({ status: "error", message: "No tienes permisos para eliminar este producto" });

  } catch (error) {
      if (error.message === "Invalid ID") {
          return res.status(400).json({ status: "error", error: "ID inválido" });
      }
      console.error("Error al eliminar el producto", error);
      res.status(500).json({ status: "error", error: "Error interno del servidor" });
  }
};



