// =============================================
// CONFIGURACIÓN INICIAL Y VARIABLES GLOBALES
// =============================================

// Inicializar productos si no existen
if (!localStorage.getItem('productos')) {
    localStorage.setItem('productos', JSON.stringify([]));
}

// Cargar datos existentes
let productosAdmin = JSON.parse(localStorage.getItem('productos')) || [];
let productosDeseados = JSON.parse(localStorage.getItem('listaDeseos')) || [];
let esAdmin = localStorage.getItem('esAdmin') === 'true';

// =============================================
// FUNCIONES DE NAVEGACIÓN Y UI
// =============================================

// Función para cambiar entre pestañas
function openTab(tabName) {
    // Ocultar todos los contenidos de pestañas
    const tabContents = document.getElementsByClassName('tab-content');
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove('active');
    }

    // Desactivar todas las pestañas
    const tabs = document.getElementsByClassName('tab');
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove('active');
    }

    // Activar la pestaña seleccionada
    document.getElementById(tabName).classList.add('active');
    event.currentTarget.classList.add('active');
}

// =============================================
// SISTEMA DE PERFIL DE USUARIO
// =============================================

function mostrarEditarPerfil() {
    document.getElementById('ver-perfil').style.display = 'none';
    document.getElementById('editar-perfil').style.display = 'block';

    // Rellenar formulario con datos actuales
    document.getElementById('nombre').value = document.getElementById('perfil-nombre').textContent;
    document.getElementById('nivel').value = document.getElementById('perfil-nivel').textContent.toLowerCase();
    document.getElementById('raqueta').value = document.getElementById('perfil-raqueta').textContent;
}

function ocultarEditarPerfil() {
    document.getElementById('ver-perfil').style.display = 'block';
    document.getElementById('editar-perfil').style.display = 'none';
}

function guardarPerfil() {
    // Validar datos antes de guardar
    const nombre = document.getElementById('nombre').value.trim();
    if (nombre === '') {
        alert('Por favor ingresa tu nombre');
        return;
    }

    // Actualizar perfil
    document.getElementById('perfil-nombre').textContent = nombre;
    document.getElementById('perfil-nivel').textContent = document.getElementById('nivel').value;
    document.getElementById('perfil-raqueta').textContent = document.getElementById('raqueta').value;
    
    ocultarEditarPerfil();
    alert('Perfil actualizado correctamente');
}

// =============================================
// LISTA DE DESEOS
// =============================================

function agregarDeseo(nombre, precio, imagen, boton) {
    // Verificar si ya está en la lista
    const existe = productosDeseados.some(p => p.nombre === nombre);
    if (existe) return;

    // Agregar a la lista
    productosDeseados.push({
        nombre: nombre,
        precio: precio,
        imagen: imagen || 'img/default-product.png'
    });

    // Actualizar localStorage y UI
    localStorage.setItem('listaDeseos', JSON.stringify(productosDeseados));
    actualizarListaDeseos();
    actualizarBotonesMeGusta();
    
    // Cambiar aspecto del botón
    boton.textContent = '❤️ Me gusta';
    boton.classList.add('me-gusta');
    boton.disabled = true;
}

function actualizarListaDeseos() {
    const listaDeseos = document.getElementById('lista-deseos');
    if (!listaDeseos) return;

    listaDeseos.innerHTML = '';

    if (productosDeseados.length === 0) {
        listaDeseos.innerHTML = '<p>Aún no tienes productos en tu lista de deseos.</p>';
        return;
    }

    productosDeseados.forEach(producto => {
        const productoHTML = `
        <div class="producto">
            <img src="${producto.imagen}" alt="${producto.nombre}" style="width:60px;height:60px;">
            <div class="producto-info">
                <h3>${producto.nombre}</h3>
                <p>Precio: $${producto.precio}</p>
            </div>
            <button onclick="eliminarDeseo('${producto.nombre}')">✕</button>
        </div>`;
        listaDeseos.innerHTML += productoHTML;
    });
}

function eliminarDeseo(nombre) {
    productosDeseados = productosDeseados.filter(p => p.nombre !== nombre);
    localStorage.setItem('listaDeseos', JSON.stringify(productosDeseados));
    actualizarListaDeseos();
    actualizarBotonesMeGusta();
}

function actualizarBotonesMeGusta() {
    const botones = document.querySelectorAll("#tienda button");
    if (!botones) return;

    botones.forEach(boton => {
        const nombreProducto = boton.getAttribute("onclick").split("'")[1];
        const enLista = productosDeseados.some(p => p.nombre === nombreProducto);

        if (enLista) {
            boton.textContent = '❤️ Me gusta';
            boton.classList.add("me-gusta");
            boton.disabled = true;
        } else {
            boton.textContent = 'Me gusta ❤️';
            boton.classList.remove("me-gusta");
            boton.disabled = false;
        }
    });
}

// =============================================
// SISTEMA DE BÚSQUEDA
// =============================================

function buscarProductos() {
    const termino = document.getElementById('barra-busqueda').value.toLowerCase();
    const productos = document.querySelectorAll('.producto');
    
    productos.forEach(producto => {
        const nombre = producto.querySelector('h3').textContent.toLowerCase();
        producto.style.display = nombre.includes(termino) ? 'flex' : 'none';
    });
}

// =============================================
// PANEL DE ADMINISTRACIÓN
// =============================================

function mostrarSeccionAdmin(seccion) {
    document.querySelectorAll('.admin-seccion').forEach(sec => {
        sec.style.display = 'none';
    });
    document.getElementById(seccion).style.display = 'block';
}

// Gestión de productos
document.getElementById('form-producto')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nombre = document.getElementById('prod-nombre').value.trim();
    const precio = parseFloat(document.getElementById('prod-precio').value);
    
    if (!nombre || isNaN(precio) || precio <= 0) {
        alert('Por favor ingresa datos válidos');
        return;
    }

    const nuevoProducto = {
        id: Date.now(),
        nombre: nombre,
        precio: precio,
        imagen: document.getElementById('prod-imagen').value || 'img/default-product.png',
        descripcion: document.getElementById('prod-descripcion').value
    };
    
    productosAdmin.push(nuevoProducto);
    localStorage.setItem('productos', JSON.stringify(productosAdmin));
    cargarProductosAdmin();
    this.reset();
    alert('Producto agregado correctamente');
});

function cargarProductosAdmin() {
    const contenedor = document.getElementById('lista-productos-admin');
    if (!contenedor) return;

    contenedor.innerHTML = productosAdmin.map(producto => `
        <div class="producto-admin">
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <div>
                <h4>${producto.nombre}</h4>
                <p>$${producto.precio.toFixed(2)}</p>
                <p>${producto.descripcion || 'Sin descripción'}</p>
                <button onclick="eliminarProducto(${producto.id})">Eliminar</button>
                <button onclick="editarProducto(${producto.id})">Editar</button>
            </div>
        </div>
    `).join('');
}

function eliminarProducto(id) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
        productosAdmin = productosAdmin.filter(p => p.id !== id);
        localStorage.setItem('productos', JSON.stringify(productosAdmin));
        cargarProductosAdmin();
    }
}

function editarProducto(id) {
    const producto = productosAdmin.find(p => p.id === id);
    if (!producto) return;

    document.getElementById('prod-nombre').value = producto.nombre;
    document.getElementById('prod-precio').value = producto.precio;
    document.getElementById('prod-imagen').value = producto.imagen;
    document.getElementById('prod-descripcion').value = producto.descripcion || '';
    
    // Eliminar el producto para evitar duplicados
    productosAdmin = productosAdmin.filter(p => p.id !== id);
    document.getElementById('form-producto').scrollIntoView();
}

// =============================================
// SISTEMA DE AUTENTICACIÓN
// =============================================

document.getElementById('adminTab')?.addEventListener('click', function(e) {
    if (!esAdmin) {
        e.preventDefault();
        document.getElementById('login-modal').style.display = 'block';
    }
});

document.querySelector('.close')?.addEventListener('click', function() {
    document.getElementById('login-modal').style.display = 'none';
});

document.getElementById('login-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const password = document.getElementById('admin-password').value;
    
    // Contraseña predeterminada (cámbiala en producción)
    if (password === 'admin123') {
        localStorage.setItem('esAdmin', 'true');
        esAdmin = true;
        document.getElementById('login-modal').style.display = 'none';
        document.getElementById('adminTab').style.display = 'block';
        openTab('admin');
    } else {
        alert('Contraseña incorrecta');
    }
});

// =============================================
// INICIALIZACIÓN AL CARGAR LA PÁGINA
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    // Ocultar pestaña admin si no es admin
    if (!esAdmin && document.getElementById('adminTab')) {
        document.getElementById('adminTab').style.display = 'none';
    }
    
    // Cargar datos iniciales
    actualizarListaDeseos();
    actualizarBotonesMeGusta();
    
    // Cargar productos admin si existe el panel
    if (document.getElementById('lista-productos-admin')) {
        cargarProductosAdmin();
    }
    
    // Activar la primera pestaña por defecto
    if (document.getElementsByClassName('tab').length > 0) {
        document.getElementsByClassName('tab')[0].click();
    }
});