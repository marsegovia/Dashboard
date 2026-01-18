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
let USA_EFECTIVO = false;



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
    const saldoTotal = Number(document.getElementById("saldoTotalInput").value) || 0;
    const efectivo = Number(document.getElementById("efectivoInput").value) || 0;
    const dolares = Number(document.getElementById("dolaresInput").value) || 0;

    if (saldoTotal <= 0) {
        alert("Ingresá al menos un saldo total válido");
        return;
    }

    // Si no cargó efectivo, asumimos que todo es saldo general
    const efectivoFinal = efectivo;


    const nuevaConfig = {
        saldoTotal,
        efectivo: efectivoFinal,
        dolares
    };

    localStorage.setItem("config", JSON.stringify(nuevaConfig));
    modal.style.display = "none";

    iniciarApp();
});


function iniciarApp() {
    config = JSON.parse(localStorage.getItem("config"));

    SALDO_INICIAL = config.saldoTotal;
    SALDO_BRL_INICIAL = config.efectivo || 0;
    SALDO_USD_INICIAL = config.dolares || 0;

    USA_EFECTIVO = SALDO_BRL_INICIAL > 0;

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

    // Validar saldo disponible
    if (moneda === "USD" && monto > SALDO_USD_INICIAL) {
        alert("No tenés suficientes dólares.");
        return;
    }

    if (moneda === "R$" && USA_EFECTIVO && monto > SALDO_BRL_INICIAL) {
        alert("No tenés suficiente efectivo.");
        return;
    }

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

    // --- Balance por billetera ---
    let balanceBRL = USA_EFECTIVO 
        ? SALDO_BRL_INICIAL - gastosBRL 
        : 0;

    let balanceUSD = SALDO_USD_INICIAL - gastosUSD;

    // --- Balance general siempre manda ---
    const gastosUSDenBRL = gastosUSD * TIPO_CAMBIO_USD;
    let balanceGeneral = SALDO_INICIAL - gastosBRL - gastosUSDenBRL;

    // --- Evitar negativos visuales ---
    if (USA_EFECTIVO) balanceBRL = Math.max(0, balanceBRL);
    balanceUSD = Math.max(0, balanceUSD);
    balanceGeneral = Math.max(0, balanceGeneral);

    // --- UI ---
    saldoG.textContent = `R$ ${balanceGeneral.toFixed(2)}`;
    balanceEl.textContent = USA_EFECTIVO 
        ? `R$ ${balanceBRL.toFixed(2)}`
        : `Sin efectivo`;

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