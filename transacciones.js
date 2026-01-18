const contenedor = document.getElementById("reporte");
const inputGasto = document.getElementById("inputGasto");
const inputMonto = document.getElementById("inputMonto");

const transacciones = JSON.parse(localStorage.getItem("transacciones")) || [];

if (transacciones.length === 0) {
    contenedor.innerHTML = "<p>No hay transacciones registradas.</p>";
} else {
    generarReporte();
}

function generarReporte() {

    const agrupadas = {};
    let totalGeneral = 0;

    // Agrupar transacciones por fecha
    transacciones.forEach(t => {
        const fecha = new Date(t.fecha).toLocaleDateString("es-AR");

        if (!agrupadas[fecha]) {
            agrupadas[fecha] = [];
        }

        agrupadas[fecha].push(t);
        totalGeneral += Number(t.monto);
    });

    // Render por fecha
    for (const fecha in agrupadas) {

        const card = document.createElement("div");
        card.classList.add("dia-card");

        let totalDia = 0;
        let htmlMovimientos = "";

        agrupadas[fecha].forEach(t => {
            totalDia += Number(t.monto);

            htmlMovimientos += `
                <div class="movimiento">
                    <span>${t.gasto}</span>
                    <strong>$${t.monto}</strong>
                </div>
            `;
        });

        card.innerHTML = `
            <h3>${fecha}</h3>
            <div class="lista-movimientos">
                ${htmlMovimientos}
            </div>
            <div class="total-dia">
                Total del día: $${totalDia}
            </div>
        `;

        contenedor.appendChild(card);
    }

    // Total general
    const totalDiv = document.createElement("div");
    totalDiv.classList.add("total-general");
    totalDiv.innerHTML = `💰 Total General: $${totalGeneral}`;

    contenedor.appendChild(totalDiv);
}

