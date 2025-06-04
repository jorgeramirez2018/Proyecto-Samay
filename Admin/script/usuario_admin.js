const users = [
    { id: 1, nombre: "Juan Martínez", correo: "jsmg@correo.com", telefono: "321456789", rol: "cliente" },
    { id: 2, nombre: "Zahrah Osorio", correo: "zahrihta@correo.com", telefono: "999111222", rol: "admin" }
];

function renderUsers() {
    const tbody = document.getElementById("userTableBody");
    tbody.innerHTML = "";
    users.forEach(user => {
        tbody.innerHTML += `
            <tr>
                <td>${user.id}</td>
                <td>${user.nombre}</td>
                <td>${user.correo}</td>
                <td>${user.telefono || ''}</td>
                <td>${user.rol}</td>
                <td>
                    <button class="btn btn-sm btn-warning me-2" onclick="editUser(${user.id})">
                        <i class='bx bx-edit'></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteUser(${user.id})">
                        <i class='bx bx-trash'></i>
                    </button>
                </td>
            </tr>
        `;
    });
}

document.getElementById("addUserForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const newUser = {
        id: users.length + 1,
        nombre: document.getElementById("userName").value,
        correo: document.getElementById("userEmail").value,
        telefono: document.getElementById("userPhone").value,
        rol: document.getElementById("userRole").value
    };
    users.push(newUser);
    renderUsers();
    this.reset();
    bootstrap.Modal.getInstance(document.getElementById("addUserModal")).hide();
});

function editUser(id) {
    const user = users.find(u => u.id === id);
    document.getElementById("editUserId").value = user.id;
    document.getElementById("editUserName").value = user.nombre;
    document.getElementById("editUserEmail").value = user.correo;
    document.getElementById("editUserPhone").value = user.telefono;
    document.getElementById("editUserRole").value = user.rol;
    new bootstrap.Modal(document.getElementById("editUserModal")).show();
}

document.getElementById("editUserForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const id = parseInt(document.getElementById("editUserId").value);
    const user = users.find(u => u.id === id);
    user.nombre = document.getElementById("editUserName").value;
    user.correo = document.getElementById("editUserEmail").value;
    user.telefono = document.getElementById("editUserPhone").value;
    user.rol = document.getElementById("editUserRole").value;
    renderUsers();
    bootstrap.Modal.getInstance(document.getElementById("editUserModal")).hide();
});

function deleteUser(id) {
    if (confirm("¿Eliminar este usuario?")) {
        const index = users.findIndex(u => u.id === id);
        users.splice(index, 1);
        renderUsers();
    }
}

renderUsers();