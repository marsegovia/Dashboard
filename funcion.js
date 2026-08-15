const contenedor = document.getElementById("transacciones");
const btnAgregar = document.getElementById("btnAgregar");
const inputGasto = document.getElementById("inputGasto");
const inputMonto = document.getElementById("inputMonto");
const gastosEl = document.getElementById("gastos");

let transacciones = JSON.parse(localStorage.getItem("transacciones")) || [];

// Render inicial
renderTransacciones();
actualizarTotales();

// ===============================
// AGREGAR GASTO
// ===============================

btnAgregar.addEventListener("click", () => {
    const gasto = inputGasto.value.trim();
    const monto = Number(inputMonto.value);
    // Validar datos
    if (gasto === "") {
        alert("Ingresá una descripción.");
        return;
    }
    if (monto <= 0 || isNaN(monto)) {
        alert("Ingresá un monto válido.");
        return;
    }
    // Crear gasto
    const nuevaTransaccion = {
        id: Date.now(),
        gasto: gasto,
        monto: monto,
        fecha: new Date().toISOString()
    };
    // Agregar al array
    transacciones.push(nuevaTransaccion);
    // Guardar
    guardar();
    // Actualizar pantalla
    renderTransacciones();
    actualizarTotales();
    // Limpiar inputs
    inputGasto.value = "";
    inputMonto.value = "";
    // Volver el cursor al campo descripción
    inputGasto.focus();
});

// ===============================
// RENDERIZAR TRANSACCIONES
// ===============================

function renderTransacciones() {

    contenedor.innerHTML = "<h2>Gastos</h2>";

    if (transacciones.length === 0) {
        contenedor.innerHTML += "<p>No hay gastos registrados</p>";
        return;
    }

    // Mostrar los últimos gastos primero
    [...transacciones].reverse().forEach((t) => {

        const div = document.createElement("div");

        const fecha = new Date(t.fecha);
        const fechaFormateada = fecha.toLocaleDateString("es-AR");

        div.classList.add("transaccion");

        div.innerHTML = `
            <strong>${t.gasto}</strong>
            <span>$ ${t.monto.toFixed(2)}</span>
            <small>${fechaFormateada}</small>
            <button onclick="eliminarTransaccion(${t.id})">❌</button>
        `;

        contenedor.appendChild(div);
    });
}


// ===============================
// ELIMINAR GASTO
// ===============================

function eliminarTransaccion(id) {

    transacciones = transacciones.filter(t => t.id !== id);

    guardar();
    renderTransacciones();
    actualizarTotales();
}


// ===============================
// CALCULAR TOTAL DE GASTOS
// ===============================

function actualizarTotales() {

    let gastosTotales = 0;

    transacciones.forEach(t => {
        gastosTotales += t.monto;
    });

    gastosEl.textContent = `$ ${gastosTotales.toFixed(2)}`;
}


// ===============================
// GUARDAR
// ===============================

function guardar() {
    localStorage.setItem(
        "transacciones",
        JSON.stringify(transacciones)
    );
}


// ===============================
// BLOQUEO DE ESCRITORIO
// ===============================

const desktopBlock = document.getElementById("desktopBlock");

function checkDevice() {

    if (window.innerWidth >= 768) {

        desktopBlock.style.display = "flex";
        document.body.style.overflow = "hidden";

    } else {

        desktopBlock.style.display = "none";
        document.body.style.overflow = "auto";

    }
}

checkDevice();

window.addEventListener("resize", checkDevice);