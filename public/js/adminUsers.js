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

                    // Verificar si la fecha es válida
                    const lastConnectionDisplay = lastConnection instanceof Date && !isNaN(lastConnection)
                        ? lastConnection.toLocaleString()
                        : 'No disponible';


                    const row = `<tr>
                        <td>${user.first_name} ${user.last_name}</td>
                        <td>${user.email}</td>
                        <td>${user.role}</td>
                        <td>${lastConnection instanceof Date && !isNaN(lastConnection) ? lastConnection.toLocaleString() : 'No disponible'}</td>
                        <td>${isInactive}</td>
                    </tr>`;
                    userTableBody.innerHTML += row;
                });
            } else {
                alert('Error al obtener los usuarios.');
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
                // O puedes recargar la tabla de usuarios
                getUsersBtn.click();
            } else {
                alert('Error al eliminar usuarios inactivos.');
            }
        } catch (error) {
            console.error('Error al eliminar usuarios inactivos:', error);
        }
    });
});
