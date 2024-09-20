
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
        
        // Agregar al carrito
        const addToCartButton = document.getElementById('modalAddToCartBtn');
        addToCartButton.onclick = () => addToCart(productId); // Utiliza la misma lógica de agregar al carrito
        // Mostrar el modal
        const modal = new bootstrap.Modal(document.getElementById('productDetailsModal'));
        modal.show();
    } catch (error) {
        console.error('Error al cargar los detalles del producto:', error);
        alert('Hubo un error al cargar los detalles del producto.');
    }
}

async function addToCart(productId, quantity = 1) {
    try {
        console.log("Intentando agregar producto al carrito:", { productId, quantity });

        const response = await fetch('/api/carts/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify({ productId, quantity }),
        });

        console.log("Respuesta del servidor al agregar producto al carrito:", response);

        if (response.ok) {
            console.log("Producto agregado al carrito exitosamente.");
            loadCart(); // Recargar el carrito después de añadir un producto
        } else {
            const errorText = await response.text();
            console.error('Error al agregar producto al carrito:', errorText);
            alert(`Error al agregar producto al carrito: ${errorText}`);
        }
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
    }
}