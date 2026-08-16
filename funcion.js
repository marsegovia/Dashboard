const contenedor = document.getElementById("transacciones");
const btnAgregar = document.getElementById("btnAgregar");
const inputGasto = document.getElementById("inputGasto");
const inputMonto = document.getElementById("inputMonto");
const gastosEl = document.getElementById("gastos");


// Todos los gastos guardados
let transacciones =
    JSON.parse(localStorage.getItem("transacciones")) || [];


// ===============================
// INICIO
// ===============================

renderTransacciones();
actualizarTotales();


// ===============================
// AGREGAR GASTO
// ===============================

btnAgregar.addEventListener("click", () => {

    const gasto = inputGasto.value.trim();
    const monto = Number(inputMonto.value);

    if (gasto === "") {
        alert("Ingresá una descripción.");
        return;
    }

    if (monto <= 0 || isNaN(monto)) {
        alert("Ingresá un monto válido.");
        return;
    }


    const nuevaTransaccion = {

        id: Date.now(),

        gasto: gasto,

        monto: monto,

        fecha: new Date().toISOString()

    };


    // Guardamos el gasto
    transacciones.push(nuevaTransaccion);

    guardar();


    // Actualizamos solamente lo que corresponde al día
    renderTransacciones();
    actualizarTotales();


    inputGasto.value = "";
    inputMonto.value = "";

    inputGasto.focus();

});


// ===============================
// OBTENER GASTOS DE HOY
// ===============================

function obtenerGastosDeHoy() {

    const hoy = new Date();

    return transacciones.filter(t => {

        const fecha = new Date(t.fecha);

        return (

            fecha.getDate() === hoy.getDate() &&

            fecha.getMonth() === hoy.getMonth() &&

            fecha.getFullYear() === hoy.getFullYear()

        );

    });

}


// ===============================
// MOSTRAR GASTOS DE HOY
// ===============================

function renderTransacciones() {

    contenedor.innerHTML = "<h2>Gastos de hoy</h2>";


    const gastosHoy = obtenerGastosDeHoy();


    if (gastosHoy.length === 0) {

        contenedor.innerHTML += `
            <p>No hay gastos registrados hoy.</p>
        `;

        return;

    }


    // Mostrar el último gasto primero

    [...gastosHoy].reverse().forEach(t => {

        const div = document.createElement("div");

        const fecha = new Date(t.fecha);

        const hora = fecha.toLocaleTimeString("es-AR", {
            hour: "2-digit",
            minute: "2-digit"
        });


        div.classList.add("transaccion");


        div.innerHTML = `

            <strong>${t.gasto}</strong>

            <span>
                $ ${Number(t.monto).toFixed(2)}
            </span>

            <small>
                ${hora}
            </small>

            <button onclick="eliminarTransaccion(${t.id})">
                ❌
            </button>

        `;


        contenedor.appendChild(div);

    });

}


// ===============================
// ELIMINAR GASTO
// ===============================

function eliminarTransaccion(id) {

    transacciones =
        transacciones.filter(t => t.id !== id);


    guardar();

    renderTransacciones();

    actualizarTotales();

}


// ===============================
// TOTAL DEL DÍA
// ===============================

function actualizarTotales() {

    const gastosHoy = obtenerGastosDeHoy();


    const totalHoy = gastosHoy.reduce(

        (total, t) => {

            return total + Number(t.monto);

        },

        0

    );


    gastosEl.textContent =
        `$ ${totalHoy.toFixed(2)}`;

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

const desktopBlock =
    document.getElementById("desktopBlock");


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

window.addEventListener(
    "resize",
    checkDevice
);