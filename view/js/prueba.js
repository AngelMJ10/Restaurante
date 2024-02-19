function agregarCampos() {
    var contenedor = document.getElementById("campos");
    var nuevaFila = document.createElement("div");
    nuevaFila.innerHTML = `
        <div class="row">
            <div class="col-md-3">
                <div class="form-floating mb-3">
                    <input type="text" class="form-control" name="nombre" placeholder="nombre">
                    <label for="nombre" class="form-label">Gasto</label>
                </div>
            </div>
            <div class="col-md-3">
                <div class="form-floating mb-3">
                    <select class="form-control" name="tipo">
                        <option value="0">Seleccione un tipo de gasto</option>
                        <option value="Servicios">Servicios</option>
                        <option value="Suministros">Suministros</option>
                        <option value="Alquiler">Alquiler</option>
                    </select>
                </div>
            </div>
            <div class="col-md-3">
                <div class="form-floating mb-3">
                    <input type="number" class="form-control" name="precio" placeholder="nombre">
                    <label for="nombre" class="form-label">Precio</label>
                </div>
            </div>
            <div class="col-md-2">
                <button type="button" class="btn-outline-danger btn" onclick="eliminarFila(this)">Eliminar</button>
            </div>
        </div>
    `;
    contenedor.appendChild(nuevaFila);
}

function eliminarFila(botonEliminar) {
    var fila = botonEliminar.parentNode.parentNode;
    fila.remove();
}

function guardarGastos() {
    var filas = document.querySelectorAll("#campos .row");
    for (var i = 0; i < filas.length; i++) {
        var nombre = filas[i].querySelector('input[name="nombre"]').value;
        var tipo = filas[i].querySelector('select[name="tipo"]').value;
        var precio = filas[i].querySelector('input[name="precio"]').value;
        registrar(nombre, tipo, precio);
    }
}

function registrar(gasto, tipo, precio) {
    const parametros = new URLSearchParams();
    parametros.append("op", "registrar");
    parametros.append("gasto", gasto);
    parametros.append("tipo", tipo);
    parametros.append("precio", precio);
    
    fetch("../controllers/gasto.php", {
        method: 'POST',
        body: parametros
    })
    .then(respuesta => {
        if (respuesta.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Gastos registrados',
                html: `Se ha registrado los gastos</b>`
            });
        }
    });
}
