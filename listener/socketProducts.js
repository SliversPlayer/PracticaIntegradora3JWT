import Product from "../models/product.model.js";

const socketProducts = (socketServer) => {
    socketServer.on("connection", async (socket) => {
        console.log("client connected con ID:", socket.id);
        
        // Emitir la lista de productos al cliente cuando se conecta
        // const productList = await Product.find();
        // socket.emit("enviodeproducts", productList);
        const productList = await Product.find();
        const productsWithId = productList.map(product => ({
            id: product._id.toString(),  // Mapear _id a id y convertir a string
            title: product.title,
            description: product.description,
            price: product.price,
            category: product.category,
            stock: product.stock,
            code: product.code,
            owner: product.owner
        }));
        socket.emit("enviodeproducts", productsWithId);

        // Escuchar eventos "addProduct", "deleteProduct" y "updateProduct"
        socket.on("addProduct", async (productData) => {
            try {
                const newProduct = new Product(productData);
                await newProduct.save();
                const updatedProductList = await Product.find();
                socketServer.emit("enviodeproducts", updatedProductList);
            } catch (error) {
                console.error("Error al añadir el producto:", error);
            }
        });

        socket.on("deleteProduct", async (productId) => {
            try {
                await Product.findByIdAndDelete(productId);
                const updatedProductList = await Product.find();
                socketServer.emit("enviodeproducts", updatedProductList);
            } catch (error) {
                console.error("Error al eliminar el producto:", error);
            }
        });

        socket.on("updateProduct", async (productData) => {
            try {
                await Product.findByIdAndUpdate(productData._id, productData);
                const updatedProductList = await Product.find();
                socketServer.emit("enviodeproducts", updatedProductList);
            } catch (error) {
                console.error("Error al actualizar el producto:", error);
            }
        });
    });
};

export default socketProducts;