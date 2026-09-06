// ===== SISTEMA DE USUARIOS - TU DESTINO TAXI =====
let usuarios = JSON.parse(localStorage.getItem('usuariosTuDestinoTaxi')) || [];

// Administrador
const ADMIN = { usuario: 'admin', clave: 'admin123' };

// REGISTRAR NUEVO USUARIO
function registrarUsuario() {
    const user = document.getElementById('nuevo-usuario').value.trim();
    const pass = document.getElementById('nueva-contrasena').value.trim();
    const error = document.getElementById('mensaje-error');

    if (!user || !pass) {
        error.textContent = '⚠️ Completa ambos campos';
        error.style.color = '#d93025';
        return;
    }

    if (usuarios.find(u => u.usuario === user)) {
        error.textContent = '⚠️ Este usuario ya existe';
        error.style.color = '#d93025';
        return;
    }

    usuarios.push({ usuario: user, clave: pass });
    localStorage.setItem('usuariosTuDestinoTaxi', JSON.stringify(usuarios));
    
    error.textContent = '✅ Perfil creado. ¡Ahora inicia sesión!';
    error.style.color = '#137333';
    
    document.getElementById('nuevo-usuario').value = '';
    document.getElementById('nueva-contrasena').value = '';
}

// INICIAR SESIÓN
function iniciarSesion() {
    const user = document.getElementById('usuario').value.trim();
    const pass = document.getElementById('contrasena').value.trim();
    const error = document.getElementById('mensaje-error');

    // Verificar Admin
    if (user === ADMIN.usuario && pass === ADMIN.clave) {
        entrarApp(ADMIN.usuario, true);
        return;
    }

    // Verificar usuario registrado
    const perfil = usuarios.find(u => u.usuario === user && u.clave === pass);
    if (perfil) {
        entrarApp(perfil.usuario, false);
    } else {
        error.textContent = '❌ Usuario o contraseña incorrectos';
        error.style.color = '#d93025';
    }
}

// ENTRAR A LA APP
function entrarApp(nombre, esAdmin) {
    document.getElementById('pantalla-login').classList.remove('activa');
    document.getElementById('pantalla-principal').classList.add('activa');
    document.getElementById('nombre-usuario-actual').textContent = esAdmin ? nombre + ' 👑' : nombre;
    document.getElementById('user-name').textContent = nombre;
    sessionStorage.setItem('sesionTuDestinoTaxi', nombre);
}

// CERRAR SESIÓN
function cerrarSesion() {
    sessionStorage.removeItem('sesionTuDestinoTaxi');
    document.getElementById('pantalla-principal').classList.remove('activa');
    document.getElementById('pantalla-login').classList.add('activa');
    document.getElementById('usuario').value = '';
    document.getElementById('contrasena').value = '';
    document.getElementById('mensaje-error').textContent = '';
}

// CAMBIAR SECCIONES
function mostrarSeccion(nombre) {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('activo'));
    event.target.classList.add('activo');
    
    document.querySelectorAll('.seccion').forEach(s => s.classList.remove('activa'));
    document.getElementById(`sec-${nombre}`).classList.add('activa');
}

// MANTENER SESIÓN AL RECARGAR
window.addEventListener('load', () => {
    const sesion = sessionStorage.getItem('sesionTuDestinoTaxi');
    if (sesion) entrarApp(sesion, sesion === ADMIN.usuario);
});
Actualizar lógica de la app
