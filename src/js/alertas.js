// alertas.js
import Swal from 'sweetalert2';

// Configurar Toast
export const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});

// Alertas normales
export function alertaExito(mensaje) {
  Swal.fire({
    title: mensaje,
    icon: "success"
  });
}

export function alertaError(mensaje) {
  Swal.fire({
    title: mensaje,
    icon: "error"
  });
}

export function alertaConfirmarEliminacion(callback) {
  Swal.fire({
    title: '¿Eliminar producto?',
    text: "Esta acción no se puede deshacer.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33'
  }).then((result) => {
    if (result.isConfirmed) {
      callback(); // ejecuta la función que le pases
      Swal.fire('¡Eliminado!', 'Producto eliminado correctamente.', 'success');
    }
  });
}

