const contenedor = document.getElementById("reporte");

const transacciones =
    JSON.parse(localStorage.getItem("transacciones")) || [];


// ========================================
// CREAR FILTROS
// ========================================

const filtros = document.createElement("div");
filtros.classList.add("filtros-fecha");

filtros.innerHTML = `
    <label>
        Año:
        <select id="filtroAnio"></select>
    </label>

    <label>
        Mes:
        <select id="filtroMes">
            <option value="0">Enero</option>
            <option value="1">Febrero</option>
            <option value="2">Marzo</option>
            <option value="3">Abril</option>
            <option value="4">Mayo</option>
            <option value="5">Junio</option>
            <option value="6">Julio</option>
            <option value="7">Agosto</option>
            <option value="8">Septiembre</option>
            <option value="9">Octubre</option>
            <option value="10">Noviembre</option>
            <option value="11">Diciembre</option>
        </select>
    </label>
`;

contenedor.appendChild(filtros);


const filtroAnio = document.getElementById("filtroAnio");
const filtroMes = document.getElementById("filtroMes");


// ========================================
// CARGAR AÑOS DISPONIBLES
// ========================================

const anios = [
    ...new Set(
        transacciones.map(t => {
            return new Date(t.fecha).getFullYear();
        })
    )
];


// Si no hay gastos
if (anios.length === 0) {

    const anioActual = new Date().getFullYear();

    filtroAnio.innerHTML = `
        <option value="${anioActual}">
            ${anioActual}
        </option>
    `;

} else {

    anios.sort((a, b) => b - a);

    anios.forEach(anio => {

        filtroAnio.innerHTML += `
            <option value="${anio}">
                ${anio}
            </option>
        `;

    });

}


// ========================================
// SELECCIONAR MES ACTUAL
// ========================================

const fechaActual = new Date();

filtroMes.value = fechaActual.getMonth();


// Si existe el año actual, seleccionarlo
if (anios.includes(fechaActual.getFullYear())) {
    filtroAnio.value = fechaActual.getFullYear();
}


// ========================================
// CAMBIAR FILTRO
// ========================================

filtroAnio.addEventListener("change", generarReporte);
filtroMes.addEventListener("change", generarReporte);


// ========================================
// GENERAR REPORTE
// ========================================

function generarReporte() {

    // Limpiar solamente el contenido anterior
    document.querySelectorAll(".resultado-reporte").forEach(el => {
        el.remove();
    });


    const anioSeleccionado = Number(filtroAnio.value);
    const mesSeleccionado = Number(filtroMes.value);


    // ========================================
    // FILTRAR TRANSACCIONES
    // ========================================

    const gastosFiltrados = transacciones.filter(t => {

        const fecha = new Date(t.fecha);

        return (
            fecha.getFullYear() === anioSeleccionado &&
            fecha.getMonth() === mesSeleccionado
        );

    });


    // ========================================
    // CONTENEDOR DEL RESULTADO
    // ========================================

    const resultado = document.createElement("div");

    resultado.classList.add("resultado-reporte");


    // ========================================
    // SI NO HAY GASTOS
    // ========================================

    if (gastosFiltrados.length === 0) {

        resultado.innerHTML = `
            <p>No hay gastos registrados en este mes.</p>
        `;

        contenedor.appendChild(resultado);

        return;
    }


    // ========================================
    // AGRUPAR POR DÍA
    // ========================================

    const agrupadas = {};

    gastosFiltrados.forEach(t => {

        const fecha = new Date(t.fecha);

        const dia = fecha.getDate();

        if (!agrupadas[dia]) {
            agrupadas[dia] = [];
        }

        agrupadas[dia].push(t);

    });


    // ========================================
    // MOSTRAR DÍAS
    // ========================================

    const diasOrdenados = Object.keys(agrupadas)
        .sort((a, b) => Number(b) - Number(a));


    let totalMes = 0;


    diasOrdenados.forEach(dia => {

        const gastosDelDia = agrupadas[dia];

        const card = document.createElement("div");

        card.classList.add("dia-card");


        let totalDia = 0;
        let htmlMovimientos = "";


        gastosDelDia.forEach(t => {

            const monto = Number(t.monto);

            totalDia += monto;
            totalMes += monto;


            htmlMovimientos += `
                <div class="movimiento">

                    <span>${t.gasto}</span>

                    <strong>
                        $ ${monto.toFixed(2)}
                    </strong>

                </div>
            `;

        });


        card.innerHTML = `

            <h3>
                ${dia} de ${obtenerNombreMes(mesSeleccionado)}
            </h3>

            <div class="lista-movimientos">
                ${htmlMovimientos}
            </div>

            <div class="total-dia">

                Total del día:
                <strong>
                    $ ${totalDia.toFixed(2)}
                </strong>

            </div>

        `;


        resultado.appendChild(card);

    });


    // ========================================
    // TOTAL DEL MES
    // ========================================

    const totalMesDiv = document.createElement("div");

    totalMesDiv.classList.add("total-general");


    totalMesDiv.innerHTML = `

        <h3>
            Total de ${obtenerNombreMes(mesSeleccionado)}
        </h3>

        <strong>
            $ ${totalMes.toFixed(2)}
        </strong>

    `;


    resultado.appendChild(totalMesDiv);

    contenedor.appendChild(resultado);

}


// ========================================
// NOMBRE DEL MES
// ========================================

function obtenerNombreMes(mes) {

    const meses = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre"
    ];

    return meses[mes];

}


// ========================================
// REPORTE INICIAL
// ========================================

generarReporte();