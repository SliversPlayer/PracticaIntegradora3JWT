// Obtener el carrito actual del usuario
async function loadCart() {
    try {
        const response = await fetch('/api/cart', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}` // Suponiendo que el token JWT se almacena en localStorage
            }
        });

        if (response.ok) {
            const cart = await response.json();
            renderCart(cart);
        } else {
            console.error('Error al cargar el carrito');
        }
    } catch (error) {
        console.error('Error al cargar el carrito:', error);
    }
}

// Renderizar el carrito en el DOM
function renderCart(cart) {
    const cartContainer = document.getElementById('cart-container');
    cartContainer.innerHTML = ''; // Limpiar el contenedor antes de renderizar

    cart.products.forEach(item => {
        const productElement = document.createElement('div');
        productElement.className = 'cart-item';
        productElement.innerHTML = `
            <h4>${item.productId.title}</h4>
            <p>${item.productId.description}</p>
            <p>Precio: $${item.productId.price}</p>
            <p>Cantidad: ${item.quantity}</p>
            <button onclick="removeFromCart('${item.productId._id}')">Eliminar</button>
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
        const response = await fetch('/api/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ productId, quantity })
        });

        if (response.ok) {
            loadCart(); // Recargar el carrito después de añadir un producto
        } else {
            console.error('Error al agregar producto al carrito');
        }
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
    }
}

// Eliminar un producto del carrito
async function removeFromCart(productId) {
    try {
        const response = await fetch(`/api/cart/remove/${productId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            loadCart(); // Recargar el carrito después de eliminar un producto
        } else {
            console.error('Error al eliminar producto del carrito');
        }
    } catch (error) {
        console.error('Error al eliminar producto del carrito:', error);
    }
}

// Vaciar el carrito
async function clearCart() {
    try {
        const response = await fetch('/api/cart/clear', {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            loadCart(); // Recargar el carrito después de vaciarlo
        } else {
            console.error('Error al vaciar el carrito');
        }
    } catch (error) {
        console.error('Error al vaciar el carrito:', error);
    }
}

// Inicializar el carrito cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
});
