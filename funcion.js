const contenedor = document.getElementById("transacciones");
const btnAgregar = document.getElementById("btnAgregar");
const inputGasto = document.getElementById("inputGasto");
const inputMonto = document.getElementById("inputMonto");
const balanceEl = document.getElementById("balance");
const gastosEl = document.getElementById("gastos");
const dolares = document.getElementById("dolares");
const inputMoneda = document.getElementById("inputMoneda");
const saldoG = document.getElementById("saldoGeneral");


let SALDO_TOTAL_INICIAL;   // R$
let SALDO_BRL_INICIAL;     // efectivo R$
let SALDO_USD_INICIAL;     // US
const TIPO_CAMBIO_USD = 5;


let transacciones = JSON.parse(localStorage.getItem("transacciones")) || [];

const modal = document.getElementById("modalConfig");
const btnGuardarConfig = document.getElementById("btnGuardarConfig");

let config = JSON.parse(localStorage.getItem("config"));

if (!config) {
    modal.style.display = "flex";
} else {
    iniciarApp();
}


btnGuardarConfig.addEventListener("click", () => {
    const saldoTotal = Number(document.getElementById("saldoTotalInput").value);
    const efectivo = Number(document.getElementById("efectivoInput").value);
    const dolares = Number(document.getElementById("dolaresInput").value);

    if (saldoTotal <= 0) {
        alert("Ingresá un saldo válido");
        return;
    }

    const nuevaConfig = {
        saldoTotal,
        efectivo,
        dolares
    };

    localStorage.setItem("config", JSON.stringify(nuevaConfig));
    modal.style.display = "none";

    iniciarApp();
});


function iniciarApp() {
    config = JSON.parse(localStorage.getItem("config"));

    SALDO_TOTAL_INICIAL = config.saldoTotal;
    SALDO_BRL_INICIAL = config.efectivo;
    SALDO_USD_INICIAL = config.dolares;

    renderTransacciones();
    actualizarTotales();
}


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

    // Saldos por moneda
    const balanceBRL = SALDO_BRL_INICIAL - gastosBRL;
    const balanceUSD = SALDO_USD_INICIAL - gastosUSD;

    // Saldo general en reales
    const gastosUSDenBRL = gastosUSD * TIPO_CAMBIO_USD;
    const balanceGeneral = SALDO_TOTAL_INICIAL - gastosBRL - gastosUSDenBRL;

    // UI
    saldoG.textContent = `R$ ${balanceGeneral.toFixed(2)}`;
    balanceEl.textContent = `R$ ${balanceBRL.toFixed(2)}`;
    dolares.textContent = `USD ${balanceUSD.toFixed(2)}`;
    gastosEl.textContent = `R$ ${gastosBRL.toFixed(2)} | USD ${gastosUSD.toFixed(2)}`;
}


// Guardar en localStorage
function guardar() {
    localStorage.setItem("transacciones", JSON.stringify(transacciones));
}

function abrirConfig() {
    modal.style.display = "flex";
}