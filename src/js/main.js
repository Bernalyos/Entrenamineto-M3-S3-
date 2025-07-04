
import { alertaExito, alertaError, alertaConfirmarEliminacion } from './alertas.js';

const endpointProductos = "http://localhost:3000/productos";
const $form = document.getElementById("form");
const $nombre = document.getElementById("nombre");
const $precio = document.getElementById("precio");
const $categoria = document.getElementById("categoria");
const $lista = document.getElementById("listaProductos");
const $bttn = document.getElementById("bttn");

let productoEditandoId = null;

// Evento al enviar el formulario

$form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const nombre = $nombre.value.trim();
  const precio = parseFloat($precio.value.trim());
  const categoria = $categoria.value.trim();

  // 1. Validaciones
  if (!nombre || !categoria) {
    alertaError("Por favor completa todos los campos.");
    return;
  }

  if (isNaN(precio) || precio <= 0) {
    alertaError("El precio debe ser un número mayor que cero.");
    return;
  }

  // 2. Comprobar duplicado
  try {
    const response = await fetch(endpointProductos);
    const productos = await response.json();
    const existe = productos.some(p => p.nombre.toLowerCase() === nombre.toLowerCase());

    if (existe) {
      alertaError("Ya existe un producto con ese nombre.");
      return;
    }

    // 3. Crear producto si pasa validaciones
    const nuevoProducto = { nombre, precio, categoria };

    const postRes = await fetch(endpointProductos, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoProducto)
    });

    if (!postRes.ok) throw new Error("Error al guardar el producto");

    alertaExito("Producto agregado correctamente");
    $form.reset();
    obtenerProductos();

  } catch (err) {
    console.error("Error:", err.message);
    alertaError("Hubo un error al agregar el producto.");
  }
});

async function obtenerProductos() {
  try {
    const response = await fetch(endpointProductos);
    if (!response.ok) throw new Error("Error al obtener productos");

    const productos = await response.json();
    renderizarProductos(productos);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

function renderizarProductos(productos) {
  $lista.innerHTML = "";

  productos.forEach((producto) => {
    const div = document.createElement("div");
    div.classList.add("card");

    const $eliminarBtn = document.createElement("button");
    $eliminarBtn.textContent = "Eliminar";
    $eliminarBtn.classList.add("btn", "btn-eliminar");
    $eliminarBtn.addEventListener("click", () => eliminarProducto(producto.id));

    const $editarBtn = document.createElement("button");
    $editarBtn.textContent = "Editar";
    $editarBtn.classList.add("btn", "btn-editar");
    $editarBtn.addEventListener("click", () => cargarProductoParaEditar(producto.id));

    div.innerHTML = `
      <h5>${producto.nombre}</h5>
      <p>Precio: $${producto.precio}</p>
      <p>Categoría: ${producto.categoria}</p>
    `;

    div.appendChild($editarBtn);
    div.appendChild($eliminarBtn);
    $lista.appendChild(div);
  });
}

async function eliminarProducto(id) {
  try {
    alertaConfirmarEliminacion()
  
    const response = await fetch(`${endpointProductos}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Error al eliminar");
    obtenerProductos();
  } catch (error) {
    console.error("Error:", error.message);
  }
}

async function cargarProductoParaEditar(id) {
  try {
    const response = await fetch(`${endpointProductos}/${id}`);
    if (!response.ok) throw new Error("Error al cargar producto");

    const producto = await response.json();

    $nombre.value = producto.nombre;
    $precio.value = producto.precio;
    $categoria.value = producto.categoria;
    productoEditandoId = id;
    $bttn.textContent = "Actualizar";
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// Iniciar
obtenerProductos();
