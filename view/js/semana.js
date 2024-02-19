// Tabla semanas
const tablaS = document.querySelector("#tabla-semana")
const tbodyS = tablaS.querySelector("tbody")

// Tabla de gastos
const tablaG = document.querySelector("#tabla-gastos");
const tbodG = tablaG.querySelector("tbody");

// Modal de gastos
const modalG = document.querySelector("#modal-gastos")
const bootstrapModal = new bootstrap.Modal(modalG);

// Modal de edición
const modalEdit = document.querySelector("#modal-editar")
const bootstrapModalEdit = new bootstrap.Modal(modalEdit);

let idsemana = 0;

function list(){
    const parametros = new URLSearchParams();
    parametros.append("op", "listar");
    fetch("../controllers/semana.php", {
        method: 'POST',
        body: parametros
    })
    .then(respuesta => respuesta.json())
    .then(datos =>{
        let tbody = "";
        tbodyS.innerHTML = "";
        let contador = 1;
        datos.forEach(element => {
            const estado = element.estado == 1 ? 'Activo' : element.estado == 2 ? 'Inactivo' : element.estado;
            tbody += `
            <tr ondblclick='get(${element.idsemana}, "${element.fecha_inicio}", "${element.fecha_fin}")'>
                    <td data-label='#'>${contador}</td>
                    <td data-label='Inicio'>${element.fecha_inicio}</td>
                    <td data-label='Fin'>${element.fecha_fin}</td>
                    <td data-label='Gastos'>S/ ${element.gastos}</td>
                    <td data-label='Ventas'>S/ ${element.ventas}</td>
                    <td data-label='Domingo'>S/ ${element.domingo}</td>
                    <td data-label='Estado'><span class='badge rounded-pill' style='background-color: #005478 '>${estado}</td>
                    <td data-label='Acción'>
                        <a class='btn btn-sm btn-outline-success' onclick='obtener(${element.idsemana})' type='button'>
                        <i class="fa-regular fa-pen-to-square"></i>
                        </a>
                    </td>
                </tr>
            `;
            contador++;
        });
        tbodyS.innerHTML = tbody;
    })
}

// Obtiene los gastos de la semana
function get(id,fechainicio,fechafin){
    const semanaBuscar = document.querySelector("#semana-2-buscar");
    const parametros = new URLSearchParams();
    parametros.append("op", "obtener");
    parametros.append("idsemana", id);
    fetch("../controllers/semana.php", {
        method: 'POST',
        body: parametros
    })
    .then(respuesta => respuesta.json())
    .then(datos => {
        semanaBuscar.innerHTML = "";
        let contador = 1;
        let tbody = ``;
        tbodG.innerHTML = "";
        bootstrapModal.show();
        datos.forEach(element => {
            const fechaCreate = new Date(element.fecha_creacion);
            const fecha = fechaCreate.toISOString().split('T')[0];
            const estado = element.estado == 1 ? 'Activo' : element.estado == 2 ? 'Inactivo' : element.estado;
            const precioSinDecimales = parseFloat(element.precio).toString();
            tbody += `
            <tr>
                <td data-label='#'>${contador}</td>
                <td data-label='Gasto'>${element.gasto}</td>
                <td data-label='Precio'>S/ ${precioSinDecimales}</td>
                <td data-label='Tipo'>${element.tipo}</td>
                <td data-label='Fecha'>${fecha}</td>
                <td data-label='Estado'><span class='badge rounded-pill' style='background-color: #005478 '>${estado}</td>
            </tr>
            `;
            contador++;
        });
        tbodG.innerHTML = tbody;
        let opciones = `
        <option value="${id}"> ${fechainicio} / ${fechafin} </option>
        `; 
        semanaBuscar.innerHTML = opciones;
    })
}

// Registra la semana
function registrar() {
    const fecha_inicio = document.querySelector("#fecha_inicio");
    const fecha_fin = document.querySelector("#fecha_fin");
    const parametros = new URLSearchParams();
    parametros.append("op", "registrar");
    parametros.append("fecha_inicio", fecha_inicio.value);
    parametros.append("fecha_fin", fecha_fin.value);

    if (!fecha_inicio.value || !fecha_fin.value) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos incompletos',
            text: 'Por favor, seleccione una fecha',
        });
        return;
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
            fetch("../controllers/semana.php", {
                method: 'POST',
                body: parametros
            })
            .then(respuesta => {
                if (respuesta.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Semana registrada',
                        html: `Se ha registrado la semana del <b>${fecha_inicio.value}</b> hasta el <b>${fecha_fin.value}</b>`
                    }).then(() => {
                        location.reload();
                    });
                }
            });
        }
    })
}

// Lista los tipos de gastos
function tiposGastos(){
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
    tiposBuscar.innerHTML = opciones;
}

// Busca los gastos de la semana
function search(){
    const txtGastos = document.querySelector("#gastos-buscar");
    const txtTipo = document.querySelector("#tipo-buscar");
    const txtSemana = document.querySelector("#semana-2-buscar");
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
        tbodG.innerHTML = "";
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
                </tr>
            `;
            contador++;
        });
        tbodG.innerHTML = tbody;
    })
}

// Busca las semanas
function buscar_semana(){
    const txtFechaI = document.querySelector("#fecha-inicio-buscar");
    const txtFechaF = document.querySelector("#fecha-fin-buscar");
    const txtEstado = document.querySelector("#estado-s-buscar");
    const parametros = new URLSearchParams();
    parametros.append("op", "buscar");
    parametros.append("fecha_inicio", txtFechaI.value);
    parametros.append("fecha_fin", txtFechaF.value);
    parametros.append("estado", txtEstado.value);
    fetch('../controllers/semana.php',{
        method: 'POST',
        body: parametros
    })
    .then(respuesta => respuesta.json())
    .then(datos =>{
        let tbody = "";
        tbodyS.innerHTML = "";
        let contador = 1;
        datos.forEach(element => {
            const estado = element.estado == 1 ? 'Activo' : element.estado == 2 ? 'Inactivo' : element.estado;
            tbody += `
            <tr ondblclick='get(${element.idsemana}, "${element.fecha_inicio}", "${element.fecha_fin}")'>
                    <td data-label='#'>${contador}</td>
                    <td data-label='Inicio'>${element.fecha_inicio}</td>
                    <td data-label='Fin'>${element.fecha_fin}</td>
                    <td data-label='Gastos'>S/ ${element.gastos}</td>
                    <td data-label='Ventas'>S/ ${element.ventas}</td>
                    <td data-label='Domingo'>S/ ${element.domingo}</td>
                    <td data-label='Estado'><span class='badge rounded-pill' style='background-color: #005478 '>${estado}</td>
                    <td data-label='Acción'>
                        <a class='btn btn-sm btn-outline-success' onclick='obtener(${element.idsemana})' type='button'>
                        <i class="fa-regular fa-pen-to-square"></i>
                        </a>
                    </td>
                </tr>
            `;
            contador++;
        });
        tbodyS.innerHTML = tbody;
    })
}

// Obtiene los datos de la semana y abre el modal para editarla
function obtener(id){
    console.log("obtener")
    const fecha_inicio = document.querySelector("#fecha-inicio-editar");
    const fecha_fin = document.querySelector("#fecha-fin-editar");
    const estado = document.querySelector("#estado-editar");
    const parametros = new URLSearchParams();
    parametros.append("op", "get")
    parametros.append("idsemana", id)
    fetch("../controllers/semana.php", {
        method: 'POST',
        body: parametros
    })
    .then(respuesta => respuesta.json())
    .then(datos => {
        bootstrapModalEdit.show();
        fecha_inicio.value = datos.fecha_inicio;
        fecha_fin.value = datos.fecha_fin;
        estado.value = datos.estado;
        idsemana = datos.idsemana;
    })
}

// Edita la semana
function editar() {
    const fecha_inicio = document.querySelector("#fecha-inicio-editar");
    const fecha_fin = document.querySelector("#fecha-fin-editar");
    const estado = document.querySelector("#estado-editar");
    const parametros = new URLSearchParams();
    parametros.append("op", "editar");
    parametros.append("fecha_inicio", fecha_inicio.value);
    parametros.append("fecha_fin", fecha_fin.value);
    parametros.append("estado", estado.value);
    parametros.append("idsemana", idsemana);

    if (!fecha_inicio.value || !fecha_fin.value) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos incompletos',
            text: 'Por favor, seleccione una fecha',
        });
        return;
    }

    Swal.fire({
        icon: 'question',
        title: 'Confirmación',
        text: '¿Está seguro de las nuevas fechas?',
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
    }).then((result) => {
        if (result.isConfirmed) {
            fetch("../controllers/semana.php", {
                method: 'POST',
                body: parametros
            })
            .then(respuesta => {
                if (respuesta.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Semana actualizada',
                        html: `Se ha actualizado la semana, del <b>${fecha_inicio.value}</b> hasta el <b>${fecha_fin.value}</b>`
                    }).then(() => {
                        location.reload();
                    });
                }
            });
        }
    })
}

tiposGastos();
list();

const btnBuscar = document.querySelector("#buscar-gastos");
btnBuscar.addEventListener("click", search);

const btnBuscarS = document.querySelector("#buscar-semana");
btnBuscarS.addEventListener("click", buscar_semana);

const btnRegistrar = document.querySelector("#registrar-semana");
btnRegistrar.addEventListener("click", registrar);

const btnEditar = document.querySelector("#editar-semana");
btnEditar.addEventListener("click", editar);