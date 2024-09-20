// Obtener el carrito actual del usuario
async function loadCart() {
    try {
        console.log("Iniciando la carga del carrito...");

        const response = await fetch('/api/carts', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });

        console.log("Respuesta del servidor para cargar el carrito:", response);

        if (response.ok) {
            const cart = await response.json();
            console.log("Carrito cargado exitosamente:", cart);
            renderCart(cart);
        } else {
            const errorText = await response.text();
            console.error('Error al cargar el carrito:', errorText);
            alert(`Error al cargar el carrito: ${errorText}`);
        }
    } catch (error) {
        console.error('Error al cargar el carrito:', error);
    }
}

// Renderizar el carrito en el DOM
function renderCart(cart) {
    console.log("Renderizando el carrito en el DOM...");
    const cartContainer = document.getElementById('cart-container');
    cartContainer.innerHTML = ''; // Limpiar el contenedor antes de renderizar

    cart.products.forEach(item => {
        console.log("Renderizando producto en el carrito:", item);
        const productElement = document.createElement('div');
        productElement.className = 'cart-item';
        productElement.innerHTML = `
            <h4>${item.product.title}</h4>
            <p>${item.product.description}</p>
            <p>Precio: $${item.product.price}</p>
            <p>Cantidad: ${item.quantity}</p>
            <button onclick="removeFromCart('${item.product._id}')">Eliminar</button>
        `;
        cartContainer.appendChild(productElement);
    });

    const clearCartButton = document.createElement('button');
    clearCartButton.innerText = 'Vaciar Carrito';
    clearCartButton.onclick = clearCart;
    cartContainer.appendChild(clearCartButton);
}

// Agregar un producto al carrito
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
// Función global
window.addToCart = addToCart;

// Eliminar un producto del carrito
async function removeFromCart(productId) {
    try {
        console.log("Intentando eliminar producto del carrito:", productId);

        const response = await fetch(`/api/carts/remove/${productId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
        });

        console.log("Respuesta del servidor al eliminar producto del carrito:", response);

        if (response.ok) {
            console.log("Producto eliminado del carrito exitosamente.");
            loadCart(); // Recargar el carrito después de eliminar un producto
        } else {
            const errorText = await response.text();
            console.error('Error al eliminar producto del carrito:', errorText);
            alert(`Error al eliminar producto del carrito: ${errorText}`);
        }
    } catch (error) {
        console.error('Error al eliminar producto del carrito:', error);
    }
}

// Vaciar el carrito
async function clearCart() {
    try {
        console.log("Intentando vaciar el carrito...");

        const response = await fetch('/api/carts/clear', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
        });

        console.log("Respuesta del servidor al vaciar el carrito:", response);

        if (response.ok) {
            console.log("Carrito vaciado exitosamente.");
            loadCart(); // Recargar el carrito después de vaciarlo
        } else {
            const errorText = await response.text();
            console.error('Error al vaciar el carrito:', errorText);
            alert(`Error al vaciar el carrito: ${errorText}`);
        }
    } catch (error) {
        console.error('Error al vaciar el carrito:', error);
    }
}

// Inicializar el carrito cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM completamente cargado, iniciando la carga del carrito...");
    loadCart();
});