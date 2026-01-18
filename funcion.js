const contenedor = document.getElementById("transacciones");
const btnAgregar = document.getElementById("btnAgregar");
const inputGasto = document.getElementById("inputGasto");
const inputMonto = document.getElementById("inputMonto");
const balanceEl = document.getElementById("balance");
const gastosEl = document.getElementById("gastos");
const dolares = document.getElementById("dolares");
const inputMoneda = document.getElementById("inputMoneda");
const saldoG = document.getElementById("saldoGeneral");


const SALDO_INICIAL = 2500;
const SALDO_BRL_INICIAL = 1000;   // reales en efectivo
const SALDO_USD_INICIAL = 300;    // dólares
const TIPO_CAMBIO_USD = 5;


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
        <span>${t.moneda} ${t.monto}</span>
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
    const moneda = inputMoneda.value;

    if (gasto === "" || monto <= 0) return;

    transacciones.push({
    gasto,
    monto,
    moneda,
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
    let gastosBRL = 0;
    let gastosUSD = 0;

    transacciones.forEach(t => {
        if (t.moneda === "R$") gastosBRL += t.monto;
        if (t.moneda === "USD") gastosUSD += t.monto;
    });

    const balanceBRL = SALDO_BRL_INICIAL - gastosBRL;
    const balanceUSD = SALDO_USD_INICIAL - gastosUSD;
    const balanceGeneral = balanceBRL + (balanceUSD * TIPO_CAMBIO_USD);
    

    saldoG.textContent = `R$ ${balanceGeneral.toFixed(2)}`;
    balanceEl.textContent = `R$ ${balanceBRL.toFixed(2)}`;
    dolares.textContent = `USD ${balanceUSD.toFixed(2)}`;
    gastosEl.textContent = `R$ ${gastosBRL.toFixed(2)} | USD ${gastosUSD.toFixed(2)}`;
}


// Guardar en localStorage
function guardar() {
    localStorage.setItem("transacciones", JSON.stringify(transacciones));
}
