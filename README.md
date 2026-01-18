# 📱 Finanzas Personales – App Web Mobile

Aplicación web para el control de gastos personales, pensada exclusivamente para visualización y uso en dispositivos móviles.

Permite registrar transacciones, manejar múltiples monedas (BRL y USD), calcular saldos automáticamente y generar reportes diarios de gastos.

⚠️ **Importante:**
Esta aplicación está diseñada solo para **pantallas mobile**.
La visualización en desktop (PC / notebook) no está optimizada y puede verse desalineada.

---

## 🚀 Funcionalidades

* Alta de transacciones con:
  * Descripción
  * Monto
  * Moneda (BRL o USD)
  * Fecha automática
* Eliminación de transacciones.
* Persistencia de datos usando **localStorage**.
* Manejo de saldos por moneda:
  * Saldo en reales (BRL)
  * Saldo en dólares (USD)
* Cálculo automático del:
  * Total gastado por moneda
  * Saldo general convertido según tipo de cambio
* Reporte diario:
  * Total gastado por día en BRL y USD
  * Equivalente convertido a BRL
* Scroll automático cuando hay muchas transacciones.
---

## 📲 Diseño
* Interfaz optimizada para **dispositivos móviles**.
* Layout simple y limpio.
* No incluye responsive para pantallas grandes.
---
## 🧱 Tecnologías utilizadas
* HTML5
* CSS3
* JavaScript (Vanilla)
* LocalStorage (persistencia de datos en el navegador)
---
## ⚙️ Instalación y uso
1. Clonar o descargar el proyecto.
2. Abrir el archivo `index.html` desde un navegador.
3. Usar preferentemente el modo móvil del navegador (DevTools → Toggle device toolbar).
4. Comenzar a cargar transacciones.
---
## 💡 Notas
* Los datos se almacenan localmente en el navegador.
* Si se borra el almacenamiento del navegador, se perderán las transacciones.
* El tipo de cambio USD → BRL se define en el código JavaScript.
---
## 📌 Futuras mejoras (opcional)
* 📊 Gráficos de gastos.
* 📅 Filtros por fecha.
* 📤 Exportar reportes (Excel / PDF).
* 🌙 Modo oscuro.
* 📱 Versión responsive para desktop.
---

Desarrollado como proyecto de práctica y aprendizaje.
