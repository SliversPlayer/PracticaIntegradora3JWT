import { Router } from "express";
import productDAO from "../dao/product.dao.js";

const routerP = Router();

routerP.get('/', async (req, res) => {
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
});

routerP.get('/:pid', async (req, res) => {
    try {
        const product = await productDAO.getById(req.params.pid);
        if (!product) { 
            return res.status(404).json({ status: "error", message: "Producto no encontrado" });
        }
        res.render("product_details", { product });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

routerP.post('/', async (req, res) => {
    try {
        const savedProduct = await productDAO.create(req.body);
        res.status(201).json({ status: "success", product: savedProduct });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
});

routerP.put('/:pid', async (req, res) => {
    try {
        const updatedProduct = await productDAO.updateById(req.params.pid, req.body);
        if (!updatedProduct) {
            return res.status(404).json({ status: "error", message: "Producto no encontrado" });
        }
        res.json({ status: "success", product: updatedProduct });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
});

routerP.delete('/:pid', async (req, res) => {
    try {
        const deletedProduct = await productDAO.deleteById(req.params.pid);
        if (!deletedProduct) {
            return res.status(404).json({ status: "error", message: "Producto no encontrado" });
        }
        res.json({ status: "success", product: deletedProduct });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

export default routerP;
