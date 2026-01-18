const contenedor = document.getElementById("transacciones");
const btnAgregar = document.getElementById("btnAgregar");
const inputGasto = document.getElementById("inputGasto");
const inputMonto = document.getElementById("inputMonto");
const balanceEl = document.getElementById("balance");
const gastosEl = document.getElementById("gastos");

const SALDO_INICIAL = 2500;

let transacciones = JSON.parse(localStorage.getItem("transacciones")) || [];

// Render inicial
renderTransacciones();
actualizarTotales();

// Renderizar transacciones
function renderTransacciones() {
    contenedor.innerHTML = "<h2>Transacciones</h2>";

    if (transacciones.length === 0) {
        contenedor.innerHTML += "<p>No hay transacciones</p>";
        return;
    }

    transacciones.forEach((t, index) => {
        const div = document.createElement("div");
        const fecha = new Date(t.fecha);
        const fechaFormateada = fecha.toLocaleDateString("es-AR");
        div.classList.add("transaccion");

        div.innerHTML = `
        <strong>${t.gasto}</strong>
        <span>R$ ${t.monto}</span>
        <small>${fechaFormateada}</small>
    <button onclick="eliminarTransaccion(${index})">❌</button>
`;

        contenedor.appendChild(div);
    });
}

// Agregar transacción
btnAgregar.addEventListener("click", () => {
    const gasto = inputGasto.value.trim();
    const monto = Number(inputMonto.value);

    if (gasto === "" || monto <= 0) return;

    transacciones.push({
    gasto,
    monto,
    fecha: new Date().toISOString()
});

    guardar();
    renderTransacciones();
    actualizarTotales();

    inputGasto.value = "";
    inputMonto.value = "";
});

// Eliminar transacción
function eliminarTransaccion(index) {
    transacciones.splice(index, 1);

    guardar();
    renderTransacciones();
    actualizarTotales();
}

// Calcular totales siempre desde cero
function actualizarTotales() {
    const totalGastos = transacciones.reduce((acc, t) => acc + t.monto, 0);
    const balance = SALDO_INICIAL - totalGastos;

    balanceEl.textContent = `R$ ${balance}`;
    gastosEl.textContent = `R$ ${totalGastos}`;
}

// Guardar en localStorage
function guardar() {
    localStorage.setItem("transacciones", JSON.stringify(transacciones));
}
