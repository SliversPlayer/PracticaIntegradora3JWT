async function showProductDetails(productId) {
    try {
        // Llamada a la API para obtener los detalles del producto
        const response = await fetch(`/api/products/${productId}`);
        const product = await response.json();

        // Rellenar los datos del modal con los detalles del producto
        document.getElementById('modalProductTitle').innerText = product.title;
        document.getElementById('modalProductDescription').innerText = product.description;
        document.getElementById('modalProductPrice').innerText = product.price;
        document.getElementById('modalProductCategory').innerText = product.category;
        document.getElementById('modalProductCode').innerText = product.code;
        document.getElementById('modalProductStock').innerText = product.stock;

        // Mostrar el modal
        const modal = new bootstrap.Modal(document.getElementById('productDetailsModal'));
        modal.show();
    } catch (error) {
        console.error('Error al cargar los detalles del producto:', error);
        alert('Hubo un error al cargar los detalles del producto.');
    }
}
