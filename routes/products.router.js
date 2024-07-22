import { Router } from "express";
import productModel from "../models/product.model.js";

const routerP = Router();

// Obtener todos los productos con paginación
routerP.get('/', async (req, res) => {
    try {
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        let category = req.query.category || '';
        let sort = req.query.sort || '';

        const query = {}; // Objeto de consulta inicial

        // Si se proporciona una categoría, agregarla a la consulta
        if (category) {
            query.category = category;
        }

        const options = {
            page,
            limit,
            lean: true,
        };

        // Comprueba si existe algún parámetro de orden
        if (sort === 'asc') {
            options.sort = { price: 1 }; // Ascendente
        } else if (sort === 'desc') {
            options.sort = { price: -1 }; // Descendente
        }

        const result = await productModel.paginate(query, options);

        result.prevLink = result.hasPrevPage ? `http://localhost:8080/api/products?page=${result.prevPage}` : '';
        result.nextLink = result.hasNextPage ? `http://localhost:8080/api/products?page=${result.nextPage}` : '';
        result.isValid = !(page <= 0 || page > result.totalPages);

        res.render("products", { products: result.docs, pagination: result });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ status: "error", message: "Internal server error" });
    }
});

routerP.get('/:pid', async (req, res) => {
    try {
        const product = await productModel.findById(req.params.pid).lean();
        if (!product) { 
            return res.status(404).json({ status: "error", message: "Producto no encontrado" });
        }
        res.render("product_details", { product: product });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});


// Crear un nuevo producto
routerP.post('/', async (req, res) => {
    try {
        const newProduct = new productModel(req.body);
        const savedProduct = await newProduct.save();
        res.status(201).json({ status: "success", product: savedProduct });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
});

// Actualizar un producto por ID
routerP.put('/:pid', async (req, res) => {
    try {
        const updatedProduct = await productModel.findByIdAndUpdate(req.params.pid, req.body, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ status: "error", message: "Producto no encontrado" });
        }
        res.json({ status: "success", product: updatedProduct });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
});

// Eliminar un producto por ID
routerP.delete('/:pid', async (req, res) => {
    try {
        const deletedProduct = await productModel.findByIdAndDelete(req.params.pid);
        if (!deletedProduct) {
            return res.status(404).json({ status: "error", message: "Producto no encontrado" });
        }
        res.json({ status: "success", product: deletedProduct });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

export default routerP;