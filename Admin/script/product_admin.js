// Funcionalidad para el sidebar responsivo
document.addEventListener('DOMContentLoaded', function() {
    // Configuración del sidebar responsivo
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('show');
        });
    }

    // Inicialización: cargar productos existentes
    loadProducts();
    
    // Vista previa de imagen al agregar
    const productImage = document.getElementById('productImage');
    const preview = document.getElementById('preview');
    const imagePreview = document.getElementById('imagePreview');
    
    productImage.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                preview.src = e.target.result;
                imagePreview.classList.remove('d-none');
            };
            reader.readAsDataURL(this.files[0]);
        }
    });
    
    // Vista previa de imagen al editar
    const editProductImage = document.getElementById('editProductImage');
    const editPreview = document.getElementById('editPreview');
    
    editProductImage.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                editPreview.src = e.target.result;
            };
            reader.readAsDataURL(this.files[0]);
        }
    });
    
    // Manejar el envío del formulario para agregar productos
    const addProductForm = document.getElementById('addProductForm');
    addProductForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!this.checkValidity()) {
            e.stopPropagation();
            this.classList.add('was-validated');
            return;
        }
        
        // Obtener los valores del formulario
        const productName = document.getElementById('productName').value;
        const price = document.getElementById('price').value;
        const quantity = document.getElementById('quantity').value;
        const community = document.getElementById('community').value;
        const region = document.getElementById('region').value;
        const category = document.getElementById('category').value;
        const imageFile = document.getElementById('productImage').files[0];
        
        // Crear un objeto URL para la imagen
        const imageURL = preview.src;
        
        // Crear el objeto producto
        const product = {
            id: Date.now().toString(),
            name: productName,
            price: parseFloat(price),
            quantity: parseInt(quantity),
            community: community,
            region: region,
            category: category,
            image: imageURL
        };
        
        // Guardar el producto
        saveProduct(product);
        
        // Cerrar el modal y resetear el formulario
        const modal = bootstrap.Modal.getInstance(document.getElementById('addProductModal'));
        modal.hide();
        this.reset();
        imagePreview.classList.add('d-none');
        this.classList.remove('was-validated');
    });
    
    // Manejar el envío del formulario para editar productos
    const editProductForm = document.getElementById('editProductForm');
    editProductForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!this.checkValidity()) {
            e.stopPropagation();
            this.classList.add('was-validated');
            return;
        }
        
        const productId = document.getElementById('editProductId').value;
        const products = JSON.parse(localStorage.getItem('products')) || [];
        const productIndex = products.findIndex(p => p.id === productId);
        
        if (productIndex !== -1) {
            const updatedProduct = {
                ...products[productIndex],
                name: document.getElementById('editProductName').value,
                price: parseFloat(document.getElementById('editPrice').value),
                quantity: parseInt(document.getElementById('editQuantity').value),
                community: document.getElementById('editCommunity').value,
                region: document.getElementById('editRegion').value,
                category: document.getElementById('editCategory').value
            };
            
            // Si se seleccionó una nueva imagen
            if (document.getElementById('editProductImage').files.length > 0) {
                updatedProduct.image = editPreview.src;
            }
            
            products[productIndex] = updatedProduct;
            localStorage.setItem('products', JSON.stringify(products));
            loadProducts();
            
            // Cerrar el modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('editProductModal'));
            modal.hide();
            this.classList.remove('was-validated');
        }
    });
});

// Función para guardar un producto en localStorage
function saveProduct(product) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    products.push(product);
    localStorage.setItem('products', JSON.stringify(products));
    
    // Recargar la lista de productos
    loadProducts();
}

// Función para cargar los productos desde localStorage
function loadProducts() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const tableBody = document.getElementById('productTableBody');
    tableBody.innerHTML = '';
    
    products.forEach(product => {
        const row = document.createElement('tr');
        
        // Crear badge para categoría
        const categoryDisplay = `<span class="category-badge category-${product.category}">${getCategoryDisplayName(product.category)}</span>`;
        
        row.innerHTML = `
            <td>${product.id.slice(-4)}</td>
            <td><img src="${product.image}" alt="${product.name}" width="50" height="50" class="img-thumbnail"></td>
            <td>${product.name}</td>
            <td>${product.community}</td>
            <td>${categoryDisplay}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td>${product.quantity}</td>
            <td>
                <button class="btn btn-sm btn-outline-secondary me-1 edit-btn" data-id="${product.id}">
                    <box-icon name='edit-alt' size='sm'></box-icon>
                </button>
                <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${product.id}">
                    <box-icon name='trash' size='sm'></box-icon>
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Agregar eventos a los botones
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            editProduct(this.getAttribute('data-id'));
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            deleteProduct(this.getAttribute('data-id'));
        });
    });
}

// Función para obtener el nombre de visualización de la categoría
function getCategoryDisplayName(category) {
    const categoryMap = {
        'joyeria': 'Joyería',
        'ceramica': 'Cerámica',
        'cesteria': 'Cestería',
        'tejidos': 'Tejidos',
        'ropa': 'Ropa'
    };
    return categoryMap[category] || category;
}

// Función para editar un producto
function editProduct(productId) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products.find(p => p.id === productId);
    
    if (product) {
        document.getElementById('editProductId').value = product.id;
        document.getElementById('editProductName').value = product.name;
        document.getElementById('editPrice').value = product.price;
        document.getElementById('editQuantity').value = product.quantity;
        document.getElementById('editCommunity').value = product.community;
        document.getElementById('editRegion').value = product.region;
        document.getElementById('editCategory').value = product.category;
        document.getElementById('editPreview').src = product.image;
        
        // Abrir el modal
        const editModal = new bootstrap.Modal(document.getElementById('editProductModal'));
        editModal.show();
    }
}

// Función para eliminar un producto
function deleteProduct(productId) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        const products = JSON.parse(localStorage.getItem('products')) || [];
        const updatedProducts = products.filter(p => p.id !== productId);
        localStorage.setItem('products', JSON.stringify(updatedProducts));
        loadProducts();
    }
}