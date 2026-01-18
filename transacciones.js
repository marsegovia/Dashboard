const contenedor = document.getElementById("reporte");
const inputGasto = document.getElementById("inputGasto");
const inputMonto = document.getElementById("inputMonto");
const TIPO_CAMBIO_USD = 5;
const transacciones = JSON.parse(localStorage.getItem("transacciones")) || [];

if (transacciones.length === 0) {
    contenedor.innerHTML = "<p>No hay transacciones registradas.</p>";
} else {
    generarReporte();
}

function generarReporte() {

    let totalGeneralBRL = 0;
    let totalGeneralUSD = 0;

    const agrupadas = {};
    let totalGeneral = 0;

    // Agrupar transacciones por fecha
    transacciones.forEach(t => {
        const fecha = new Date(t.fecha).toLocaleDateString("es-AR");

        if (!agrupadas[fecha]) {
            agrupadas[fecha] = [];
        }

        agrupadas[fecha].push(t);
        if (t.moneda === "R$") totalGeneralBRL += Number(t.monto);
        if (t.moneda === "USD") totalGeneralUSD += Number(t.monto);
    });

    // Render por fecha
    for (const fecha in agrupadas) {

        const card = document.createElement("div");
        card.classList.add("dia-card");

        let totalDiaBRL = 0;
        let totalDiaUSD = 0;
        let htmlMovimientos = "";

        agrupadas[fecha].forEach(t => {
            if (t.moneda === "R$") totalDiaBRL += Number(t.monto);
            if (t.moneda === "USD") totalDiaUSD += Number(t.monto);

            htmlMovimientos += `
                <div class="movimiento">
                    <span>${t.gasto}</span>
                    <strong>${t.moneda} ${t.monto} </strong>
                </div>
            `;
        });

        const totalConvertido = totalDiaUSD * TIPO_CAMBIO_USD;

        card.innerHTML = `
            <h3>${fecha}</h3>
            <div class="lista-movimientos">
                ${htmlMovimientos}
            </div>
            <div class="total-dia">
                <div>Total Reales: R$ ${totalDiaBRL.toFixed(2)}</div>
                <div>Total USD: USD ${totalDiaUSD.toFixed(2)} (R$${totalConvertido.toFixed(2)})</div>
            </div>
        `;

        contenedor.appendChild(card);
    }

     // Totales generales
    const totalGeneralConvertido = totalGeneralUSD * TIPO_CAMBIO_USD;

    const totalDiv = document.createElement("div");
    totalDiv.classList.add("total-general");

    totalDiv.innerHTML = `
        Totales Generales
        <div>BRL: R$ ${totalGeneralBRL.toFixed(2)}</div>
        <div>USD: USD ${totalGeneralUSD.toFixed(2)}(R$${totalGeneralConvertido.toFixed(2)})</div>
    `;

    contenedor.appendChild(totalDiv);
}

