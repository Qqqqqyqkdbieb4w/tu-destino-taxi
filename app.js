// ===== TU DESTINO TAXI - ESTILO UBER - LÓGICA COMPLETA =====

// Base de datos
let usuarios = JSON.parse(localStorage.getItem('tuDestinoTaxi_usuarios')) || [];
let usuarioActivo = JSON.parse(sessionStorage.getItem('tuDestinoTaxi_activo')) || null;
let tipoUsuarioActivo = 'pasajero';
let vehiculoSeleccionado = null;

// ===== CAMBIAR PANTALLAS =====
function mostrarPantalla(id) {
    document.querySelectorAll('.pantalla').forEach(p => p.classList.remove('activa'));
    document.getElementById(id).classList.add('activa');
    window.scrollTo(0, 0);
}

function mostrarLogin(tipo) {
    tipoUsuarioActivo = tipo;
    document.getElementById('auth-subtitulo').textContent = tipo === 'pasajero' ? 'Pasajero' : 'Conductor';
    mostrarPantalla('pantalla-login');
}

// ===== REGISTRO =====
function registrarUsuario() {
    const nombre = document.getElementById('reg-nombre').value.trim();
    const correo = document.getElementById('reg-correo').value.trim();
    const telefono = document.getElementById('auth-telefono').value.trim();
    const clave = document.getElementById('reg-clave').value;
    const msj = document.getElementById('auth-mensaje');

    if (!nombre || !correo || !telefono || !clave) {
        msj.textContent = '⚠️ Completa todos los campos';
        msj.style.color = '#ff453a';
        return;
    }
    if (clave.length < 6) {
        msj.textContent = '⚠️ Mínimo 6 caracteres';
        msj.style.color = '#ff453a';
        return;
    }
    if (usuarios.find(u => u.correo === correo || u.telefono === telefono)) {
        msj.textContent = '⚠️ Ya existe una cuenta';
        msj.style.color = '#ff453a';
        return;
    }

    const nuevo = { nombre, correo, telefono, clave, tipo: tipoUsuarioActivo };
    usuarios.push(nuevo);
    localStorage.setItem('tuDestinoTaxi_usuarios', JSON.stringify(usuarios));
    
    msj.textContent = '✅ ¡Cuenta creada! Inicia sesión';
    msj.style.color = '#30d158';
    
    // Limpiar
    document.getElementById('reg-nombre').value = '';
    document.getElementById('reg-correo').value = '';
    document.getElementById('reg-clave').value = '';
}

// ===== INICIAR SESIÓN =====
function iniciarSesion() {
    const telefono = document.getElementById('auth-telefono').value.trim();
    const clave = document.getElementById('auth-clave').value;
    const msj = document.getElementById('auth-mensaje');

    const perfil = usuarios.find(u => u.telefono === telefono && u.clave === clave);
    if (perfil) {
        usuarioActivo = perfil;
        sessionStorage.setItem('tuDestinoTaxi_activo', JSON.stringify(perfil));
        entrarApp();
    } else {
        msj.textContent = '❌ Datos incorrectos';
        msj.style.color = '#ff453a';
    }
}

function entrarApp() {
    // Actualizar datos del perfil
    document.getElementById('perfil-nombre').textContent = usuarioActivo.nombre;
    document.getElementById('perfil-correo').textContent = usuarioActivo.correo;
    
    // Activar detección de destino
    const destinoInput = document.getElementById('destino');
    destinoInput.oninput = function() {
        if (this.value.trim().length > 2) {
            document.getElementById('seleccion-vehiculos').classList.remove('oculto');
        } else {
            document.getElementById('seleccion-vehiculos').classList.add('oculto');
        }
    };

    mostrarPantalla('pantalla-mapa');
}

// ===== CERRAR SESIÓN =====
function cerrarSesion() {
    sessionStorage.removeItem('tuDestinoTaxi_activo');
    usuarioActivo = null;
    document.getElementById('auth-telefono').value = '';
    document.getElementById('auth-clave').value = '';
    document.getElementById('auth-mensaje').textContent = '';
    document.getElementById('seleccion-vehiculos').classList.add('oculto');
    mostrarPantalla('pantalla-bienvenida');
}

// ===== SELECCIONAR VEHÍCULO =====
function seleccionarVehiculo(el, nombre, precio) {
    document.querySelectorAll('.vehiculo-opcion').forEach(v => v.classList.remove('seleccionado'));
    el.classList.add('seleccionado');
    vehiculoSeleccionado = { nombre, precio };
    document.querySelector('.btn-solicitar').textContent = `Confirmar ${nombre}`;
}

// ===== CONFIRMAR VIAJE =====
function confirmarViaje() {
    const destino = document.getElementById('destino').value.trim();
    if (!destino || !vehiculoSeleccionado) {
        alert('Escribe tu destino y selecciona un vehículo 🚗');
        return;
    }
    // Mostrar destino y precio en pantalla de conductor
    document.getElementById('destino-mostrado').textContent = destino;
    document.getElementById('precio-mostrado').textContent = `RD$ ${vehiculoSeleccionado.precio}`;
    
    // Pantalla buscando → conductor en camino
    mostrarPantalla('pantalla-buscando');
    setTimeout(() => mostrarPantalla('pantalla-conductor'), 3000);
}

// ===== CANCELAR VIAJE =====
function cancelarViaje() {
    vehiculoSeleccionado = null;
    document.querySelectorAll('.vehiculo-opcion').forEach(v => v.classList.remove('seleccionado'));
    document.getElementById('destino').value = '';
    document.querySelector('.btn-solicitar').textContent = 'Confirmar Economy';
    document.getElementById('seleccion-vehiculos').classList.add('oculto');
    mostrarPantalla('pantalla-mapa');
}

// ===== RECUPERAR SESIÓN =====
window.addEventListener('load', () => {
    const sesion = sessionStorage.getItem('tuDestinoTaxi_activo');
    if (sesion) {
        usuarioActivo = JSON.parse(sesion);
        entrarApp();
    }
});
Actualizar app estilo Uber 
