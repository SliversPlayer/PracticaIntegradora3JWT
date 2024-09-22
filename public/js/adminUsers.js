document.addEventListener('DOMContentLoaded', () => {
    const getUsersBtn = document.getElementById('getUsersBtn');
    const deleteInactiveBtn = document.getElementById('deleteInactiveBtn');
    const userTableBody = document.getElementById('userTableBody');

    // Función para obtener todos los usuarios
    getUsersBtn.addEventListener('click', async () => {
        try {
            const response = await fetch('/api/users', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                const users = data.users;

                // Limpiar la tabla antes de agregar nuevos usuarios
                userTableBody.innerHTML = '';

                // Mostrar los usuarios en la tabla
                users.forEach(user => {
                    const lastConnection = new Date(user.last_connection);
                    const now = new Date();
                    const diffDays = Math.floor((now - lastConnection) / (1000 * 60 * 60 * 24));
                    const isInactive = diffDays >= 2 ? 'Sí' : 'No';

                    console.log('Datos de los usuarios:', users);

                    const row = `<tr>
                        <td>${user.first_name} ${user.last_name}</td>
                        <td>${user.email}</td>
                        <td>${user.role}</td>
                        <td>${lastConnection instanceof Date && !isNaN(lastConnection) ? lastConnection.toLocaleString() : 'No disponible'}</td>
                        <td>${isInactive}</td>
                        <td>
                            <select class="form-select" id="role-select-${user._id}">
                                <option value="user" ${user.role === 'user' ? 'selected' : ''}>User</option>
                                <option value="premium" ${user.role === 'premium' ? 'selected' : ''}>Premium</option>
                                <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
                            </select>
                            <button class="btn btn-sm btn-secondary change-role-btn" data-user-id="${user._id}">
                                Cambiar Rol
                            </button>
                        </td>
                        <td>
                            <button class="btn btn-danger btn-sm delete-user" data-user-id="${user._id}">
                                Eliminar
                            </button>
                        </td>
                    </tr>`;
                    userTableBody.innerHTML += row;
                });

                // **Event listener para cambiar roles**
                document.querySelectorAll('.change-role-btn').forEach(button => {
                    button.addEventListener('click', async (event) => {
                        const userId = event.target.getAttribute('data-user-id');
                        const selectElement = document.getElementById(`role-select-${userId}`);
                        const newRole = selectElement.value;

                        try {
                            const response = await fetch(`/api/users/role/${userId}`, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                                },
                                body: JSON.stringify({ role: newRole })
                            });

                            if (response.ok) {
                                alert('Rol actualizado correctamente');
                            } else {
                                const errorText = await response.text();
                                alert(`Error al actualizar el rol: ${errorText}`);
                            }
                        } catch (error) {
                            console.error('Error al actualizar rol:', error);
                        }
                    });
                });

                // **Event listener para eliminar usuarios**
                document.querySelectorAll('.delete-user').forEach(button => {
                    button.addEventListener('click', async (event) => {
                        const userId = event.target.getAttribute('data-user-id');

                        if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
                            try {
                                const response = await fetch(`/api/users/${userId}`, {
                                    method: 'DELETE',
                                    headers: {
                                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                                    }
                                });

                                if (response.ok) {
                                    alert('Usuario eliminado correctamente');
                                    getUsersBtn.click();  // Recargar la lista de usuarios
                                } else {
                                    const errorText = await response.text();
                                    alert(`Error al eliminar el usuario: ${errorText}`);
                                }
                            } catch (error) {
                                console.error('Error al eliminar usuario:', error);
                            }
                        }
                    });
                });
            } else {
                const errorText = await response.text();
                alert(`Error al obtener los usuarios: ${errorText}`);
            }
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
        }
    });

    // Función para eliminar usuarios inactivos
    deleteInactiveBtn.addEventListener('click', async () => {
        try {
            const response = await fetch('/api/users', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                alert(data.message);  // Mostrar mensaje de éxito
                getUsersBtn.click();  // Recargar la lista de usuarios
            } else {
                const errorText = await response.text();
                alert(`Error al eliminar usuarios inactivos: ${errorText}`);
            }
        } catch (error) {
            console.error('Error al eliminar usuarios inactivos:', error);
        }
    });
});
