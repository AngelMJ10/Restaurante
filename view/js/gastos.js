const tableM = document.querySelector("#tabla-gastos");
const tbodyM = tableM.querySelector("tbody");

// Modal
const modal = document.querySelector("#modal-editar");
const bootstrapModal = new bootstrap.Modal(modal);
let idgastos = 0;

function list(){
    const parametros = new URLSearchParams();
    parametros.append("op", "listar");
    fetch("../controllers/gasto.php", {
        method: 'POST',
        body: parametros
    })
    .then(respuesta => respuesta.json())
    .then(datos =>{
        let tbody = "";
        tbodyM.innerHTML = "";
        let contador = 1;
        datos.forEach(element => {
            const fechaCreate = new Date(element.fecha_creacion);
            const fecha = fechaCreate.toISOString().split('T')[0];
            const estado = element.estado == 1 ? 'Activo' : element.estado == 2 ? 'Inactivo' : element.estado;
            const precioSinDecimales = parseFloat(element.precio).toString();
            tbody += `
                <tr>
                    <td data-label='#'>${contador}</td>
                    <td data-label='Gasto'>${element.gasto}</td>
                    <td data-label='Tipo'>${element.tipo}</td>
                    <td data-label='Precio'>S/ ${precioSinDecimales}</td>
                    <td data-label='Fecha'>${fecha}</td>
                    <td data-label='Estado'><span class='badge rounded-pill' style='background-color: #005478 '>${estado}</td>
                    <td data-label='Acción'>
                        <a class='btn btn-sm btn-outline-success' onclick='get(${element.idgasto})' type='button'>
                        <i class="fa-regular fa-pen-to-square"></i>
                        </a>
                    </td>
                </tr>
            `;
            contador++;
        });
        tbodyM.innerHTML = tbody;
    })
}

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
                        <option value="Aceite">Aceite</option>
                        <option value="Alquiler">Alquiler</option>
                        <option value="Bebidas">Bebidas</option>
                        <option value="Maquinaria y equipo">Maquinaria y equipo</option>
                        <option value="Otros gastos">Otros gastos</option>
                        <option value="Plasticos">Plasticos</option>
                        <option value="Servicios">Servicios</option>
                        <option value="Suministros">Suministros</option>
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
    const semanaRegister = document.querySelector("#semana").value;
    console.log(semanaRegister);
    if (semanaRegister == 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos incompletos',
            text: 'Por favor, seleccione una semana',
        });
        return;
    }

    // Validar si alguna caja de texto está vacía
    var filas = document.querySelectorAll("#campos .row");
    for (var i = 0; i < filas.length; i++) {
        var nombre = filas[i].querySelector('input[name="nombre"]').value;
        var tipo = filas[i].querySelector('select[name="tipo"]').value;
        var precio = filas[i].querySelector('input[name="precio"]').value;

        if (nombre.trim() === '' || tipo.trim() === '' || precio.trim() === '') {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor, complete todos los campos',
            });
            return;
        }
    }

    Swal.fire({
        icon: 'question',
        title: 'Confirmación',
        text: '¿Está seguro de los datos ingresados?',
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
    }).then((result) => {
        if (result.isConfirmed) {
            var filas = document.querySelectorAll("#campos .row");
            for (var i = 0; i < filas.length; i++) {
                var nombre = filas[i].querySelector('input[name="nombre"]').value;
                var tipo = filas[i].querySelector('select[name="tipo"]').value;
                var precio = filas[i].querySelector('input[name="precio"]').value;
                registrar(semanaRegister,nombre, tipo, precio);
            }
            location.reload();
        }
    })
    
}

function registrar(idsemana,gasto, tipo, precio) {
    const parametros = new URLSearchParams();
    parametros.append("op", "registrar");
    parametros.append("idsemana", idsemana);
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

function get(id){
    const txtGastoEdit = document.querySelector("#gasto-editar");
    const tiposEditar = document.querySelector("#tipo-editar");
    const txtPrecio = document.querySelector("#precio-editar");
    const txtSemana = document.querySelector("#semana-editar");
    const estadoEditar = document.querySelector("#estado-editar");
    const parametros = new URLSearchParams();
    parametros.append("op", "obtener")
    parametros.append("idgasto", id)
    fetch("../controllers/gasto.php", {
        method: 'POST',
        body: parametros
    })
    .then(respuesta => respuesta.json())
    .then(datos => {
        bootstrapModal.show();
        txtGastoEdit.value = datos.gasto;
        tiposEditar.value = datos.tipo;
        txtPrecio.value = datos.precio;
        txtSemana.value = datos.idsemana;
        estadoEditar.value = datos.estado;
        idgastos = datos.idgasto;
    })
}

function edit() {
    const txtGastoEdit = document.querySelector("#gasto-editar");
    const tiposEditar = document.querySelector("#tipo-editar");
    const txtPrecio = document.querySelector("#precio-editar");
    const txtSemana = document.querySelector("#semana-editar");
    const estadoEditar = document.querySelector("#estado-editar");
    const parametros = new URLSearchParams();
    parametros.append("op", "editar");
    parametros.append("idsemana", txtSemana.value);
    parametros.append("gasto", txtGastoEdit.value);
    parametros.append("tipo", tiposEditar.value);
    parametros.append("precio", txtPrecio.value);
    parametros.append("estado", estadoEditar.value);
    parametros.append("idgasto", idgastos);
    
    Swal.fire({
        icon: 'question',
        title: 'Confirmación',
        text: '¿Está seguro de los datos ingresados?',
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
    }).then((result) => {
        if (result.isConfirmed) {
            fetch("../controllers/gasto.php", {
                method: 'POST',
                body: parametros
            })
            .then(respuesta => {
                if (respuesta.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Gasto editado',
                        html: `Se ha actualizado el gasto</b>`
                    }).then(() => {
                        list()
                    });
                }
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.alert({
                    icon: 'Error',
                    title: 'Error al actualizar el gasto',
                    text: 'Ocurrió un error al actualizar el gasto. Por favor intentelo nuevamente.'
                })
            });
        }
    })
    
}

function search(){
    const txtGastos = document.querySelector("#gastos-buscar");
    const txtTipo = document.querySelector("#tipo-buscar");
    const txtSemana = document.querySelector("#semana-buscar");
    const txtPrecio = document.querySelector("#precio-buscar");
    const txtEstado = document.querySelector("#estado-buscar");
    const parametros = new URLSearchParams();
    parametros.append("op", "buscar");
    parametros.append("gasto", txtGastos.value);
    parametros.append("idsemana", txtSemana.value);
    parametros.append("precio", txtPrecio.value);
    parametros.append("tipo", txtTipo.value);
    parametros.append("estado", txtEstado.value);
    fetch("../controllers/gasto.php", {
        method: 'POST',
        body: parametros
    })
    .then(respuesta => respuesta.json())
    .then(datos =>{
        let tbody = "";
        tbodyM.innerHTML = "";
        let contador = 1;
        datos.forEach(element => {
            console.log(txtTipo.value);
            const fechaCreate = new Date(element.fecha_creacion);
            const fecha = fechaCreate.toISOString().split('T')[0];
            const estado = element.estado == 1 ? 'Activo' : element.estado == 2 ? 'Inactivo' : element.estado;
            const precioSinDecimales = parseFloat(element.precio).toString();
            tbody += `
                <tr>
                    <td data-label='#'>${contador}</td>
                    <td data-label='Gasto'>${element.gasto}</td>
                    <td data-label='Tipo'>${element.tipo}</td>
                    <td data-label='Precio'>S/ ${precioSinDecimales}</td>
                    <td data-label='Fecha'>${fecha}</td>
                    <td data-label='Estado'><span class='badge rounded-pill' style='background-color: #005478 '>${estado}</td>
                    <td data-label='Acción'>
                        <a class='btn btn-sm btn-outline-success' onclick='get(${element.idgasto})' type='button'>
                        <i class="fa-regular fa-pen-to-square"></i>
                        </a>
                    </td>
                </tr>
            `;
            contador++;
        });
        tbodyM.innerHTML = tbody;
    })
}

function tiposGastos(){
    const tiposRegistro = document.querySelector("#tipo");
    const tiposEditar = document.querySelector("#tipo-editar");
    const tiposBuscar = document.querySelector("#tipo-buscar");
    let opciones = `
            <option value="0">Seleccione un tipo de gasto</option>
            <option value="Aceite">Aceite</option>
            <option value="Alquiler">Alquiler</option>
            <option value="Bebidas">Bebidas</option>
            <option value="Maquinaria y equipo">Maquinaria y equipo</option>
            <option value="Otros gastos">Otros gastos</option>
            <option value="Plasticos">Plasticos</option>
            <option value="Servicios">Servicios</option>
            <option value="Suministros">Suministros</option>
    `;
    tiposRegistro.innerHTML = opciones;
    tiposEditar.innerHTML = opciones;
    tiposBuscar.innerHTML = opciones;
}

function semana_disponibles(){
    const semanaRegister = document.querySelector("#semana");
    const semanaEdit = document.querySelector("#semana-editar");
    const semanaSearch = document.querySelector("#semana-buscar");
    const parametros = new URLSearchParams();
    parametros.append("op", "listar");
    fetch("../controllers/semana.php", {
        method: 'POST',
        body: parametros
    })
    .then(respuesta => respuesta.json())
    .then(datos => {
        let options = "<option value='0'>Seleccione la semana</option>";
        let opciones = "<option value='0'>Seleccione la semana</option>";
        datos.forEach(element => {
            if (element.estado == 1) {
                options += `
                    <option value='${element.idsemana}'>${element.fecha_inicio} / ${element.fecha_fin}</option>
                `;
            }
            opciones += `
                    <option value='${element.idsemana}'>${element.fecha_inicio} / ${element.fecha_fin}</option>
                `;
        });
        semanaRegister.innerHTML = options;
        semanaSearch.innerHTML = opciones;
        semanaEdit.innerHTML = opciones;
    })
}

semana_disponibles()
tiposGastos();

list();

const btnEditar = document.querySelector("#editar-gasto");
btnEditar.addEventListener("click", edit);


const btnBuscar = document.querySelector("#buscar-gastos");
btnBuscar.addEventListener("click", search);