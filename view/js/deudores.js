const tablaD = document.querySelector("#tabla-deudores");
const tbodyD = tablaD.querySelector("tbody");
let idPersona = 0;
let idDebtor = 0;
let aporte = 0;

function list(){
    const parametros = new URLSearchParams();
    parametros.append("op", "listDepdtors");
    fetch("../controllers/deuda.php", {
        method: 'POST',
        body: parametros
    })
    .then(respuesta => respuesta.json())
    .then(datos =>{
        let tbody = "";
        tbodyD.innerHTML = "";
        let contador = 1;
        datos.forEach(element => {
            const estado = element.estado == 1 ? 'No debe' : element.estado == 2 ? 'Debe' : element.estado;
            tbody += `
                <tr title='Doble clic, para ver las deudas' ondblclick='get_debts(${element.iddeudor})'>
                    <td data-label='#'>${contador}</td>
                    <td data-label='Nombre'>${element.nombre}</td>
                    <td data-label='Apellidos'>${element.apellidos}</td>
                    <td data-label='Deudas'>${element.deudas}</td>
                    <td data-label='Total'>S/ ${element.total}</td>
                    <td data-label='Estado'><span class='badge rounded-pill' style='background-color: #005478'>${estado}</td>
                    <td data-label='Acción'>
                        <a class='btn btn-sm btn-outline-success' title='Clic, para editar al deudor' type='button' onclick='get(${element.idpersona})'>
                        <i class="fa-regular fa-pen-to-square"></i>
                        </a>
                        <a class='btn btn-sm btn-outline-primary' title='Clic, para ver los pagos' type='button' onclick='get_Pagos(${element.iddeudor})'>
                        <i class="fa-solid fa-list"></i>
                        </a>
                    </td>
                </tr>
            `;
            contador++;
        });
        tbodyD.innerHTML = tbody;
    })
}

// Para abrir el modal de edición
function get(id){
    const nombre_edit = document.querySelector("#nombre-editar");
    const apellidos_edit = document.querySelector("#apellidos-editar");
    const telefono_edit = document.querySelector("#telefono-editar");
    const direccion_edit = document.querySelector("#direccion-editar");
    const modalDatos = document.querySelector("#modal-editar");
    const bootstrapModal = new bootstrap.Modal(modalDatos);
    bootstrapModal.show();
    const parametros = new URLSearchParams();
    parametros.append("op", "get");
    parametros.append("idpersona", id);
    fetch("../controllers/deuda.php", {
        method: 'POST',
        body: parametros
    })
    .then(respuesta => respuesta.json())
    .then(datos => {
        nombre_edit.value = datos.nombre;
        apellidos_edit.value = datos.apellidos;
        telefono_edit.value = datos.telefono;
        direccion_edit.value = datos.direccion;
        idPersona = datos.idpersona;
        console.log(idPersona);
    })
    .catch(error => {
        console.error(error);
    });
}

// Obtiene el registro de pagos de los deudores
function get_Pagos(id){
    const tablaP = document.querySelector("#tabla-pagos");
    const tbodyP = tablaP.querySelector("tbody");
    const modalDatos = document.querySelector("#modal-pagos");
    const bootstrapModal = new bootstrap.Modal(modalDatos);
    bootstrapModal.show();
    const parametros = new URLSearchParams();
    parametros.append("op", "listar_pagos");
    fetch('../controllers/deuda.php', {
        method: 'POST',
        body: parametros
    })
    .then(respuesta => respuesta.json())
    .then(datos => {
        let tbody = "";
        tbodyP.innerHTML = "";
        let contador = 1;
        datos.forEach(element => {
            const estado = element.estado == 1 ? 'Activo' : element.estado == 2 ? 'Inactivo' : element.estado;
            let btnEstado = ``;
            if (id == element.iddeudor) {
                if (element.estado == 1) {
                    btnEstado =`<a class='btn btn-sm btn-outline-danger' onclick='cambiar_estado_pago(${element.idpago}, 2, ${element.pago})' 
                                    title='Clic, para anular pago' type='button'>
                                    <i class="fas fa-times-circle"></i>
                                </a>`;
                }else{
                    btnEstado =`<a class='btn btn-sm btn-outline-primary' onclick='cambiar_estado_pago(${element.idpago}, 1, ${element.pago})'
                                    title='Clic, para habilitar pago' type='button'>
                                    <i class="fa-solid fa-check"></i>
                                </a>`;
                }
                
                tbody += `
                    <tr title='Doble clic, para ver las deudas'>
                        <td data-label='#'>${contador}</td>
                        <td data-label='Pago'>S/ ${element.pago}</td>
                        <td data-label='Fecha'>${element.fecha_creacion}</td>
                        <td data-label='Comentario'>${element.comentario}</td>
                        <td data-label='Comentario'><span class='badge rounded-pill' style='background-color: #005478'>${estado}</td>
                        <td data-label='Acción'>
                            ${btnEstado} 
                        </td>
                    </tr>
                `;
            contador++;
            }
        });
        tbodyP.innerHTML = tbody;
        idDebtor = id;
    })
}

// Función para poder obtener las deudas(abre el modal de deudas)
function get_debts(id){
    const txtDeudores = document.querySelector("#deudores-buscar");
    const txttotal = document.querySelector("#total-deuda")
    const tablaDeudas = document.querySelector("#tabla-deudas");
    const tbodyDeudas = tablaDeudas.querySelector("tbody");
    const modal = document.querySelector("#modal-deudas");
    const bootstrapModal = new bootstrap.Modal(modal);
    const parametros = new URLSearchParams();
    parametros.append("op", "get_debts");
    parametros.append("iddeudor", id);
    fetch("../controllers/deuda.php", {
        method: 'POST',
        body: parametros
    })
    .then(respuesta => respuesta.json())
    .then(datos =>{
        getAporte(id);
        let contador = 1;
        bootstrapModal.show();
        let tbody = "";
        let total = 0
        datos.forEach(element => {
            if (element.estado == 1) {
                total += parseFloat(element.total);
            }
            idDebtor = element.iddeudor
            const fechaCreate = new Date(element.fecha_creacion);
            const fecha = fechaCreate.toISOString().split('T')[0];
            const estado = element.estado == 1 ? 'No pagado' : element.estado == 2 ? 'Pagado' : element.estado;
            if (element.estado == 1) {
                tbody += `
                    <tr ondblclick ='get_sale(${element.idventa})'>
                        <td data-label='#'>${contador}</td>
                        <td data-label='Productos'>${element.productos}</td>
                        <td data-label='Total'>S/ ${element.total}</td>
                        <td data-label='Fecha'>${element.fecha_creacion}</td>
                        <td data-label='Estado'><span class='badge rounded-pill' style='background-color: #005478'>${estado}</td>
                        <td data-label='Acción'>
                            <a class='btn btn-sm btn-outline-success' title='Clic, para saldar la deuda'
                                onclick='pay(${element.iddeuda}, ${element.idventa},${element.total})' type='button'>
                                <i class="fa-solid fa-cash-register"></i>
                            </a>
                        </td>
                    </tr>
                `;
            }else{
                tbody += `
                    <tr ondblclick ='get_sale(${element.idventa})'>
                        <td data-label='#'>${contador}</td>
                        <td data-label='Productos'>${element.productos}</td>
                        <td data-label='Total'>S/ ${element.total}</td>
                        <td data-label='Fecha'>${element.fecha_creacion}</td>
                        <td data-label='Estado'><span class='badge rounded-pill' style='background-color: #005478'>${estado}</td>
                        <td data-label='Acción'>
                            <a class='btn btn-sm btn-outline-primary' title='Clic, para reactivar la deuda' 
                                onclick='reactivar_deuda(${element.iddeuda}, ${element.idventa})' type='button'>
                                <i class="fa-solid fa-money-bill"></i>
                            </a>
                        </td>
                    </tr>
                `;
            }
            
            contador++;
        });
        txttotal.value = total;
        tbodyDeudas.innerHTML = tbody;
        txtDeudores.value= id;
    })
}

// Cambia el estado del pago(en caso que se quiera deshabilitar el pago)
function cambiar_estado_pago(id, estado,pago){
    let pregunta = ``;
    let confirmacion = ``;
    let mensaje = ``;
    const parametros = new URLSearchParams();
    parametros.append("op", "cambiar_estado_pago");
    parametros.append("iddeuda", id);
    parametros.append("estado", estado);
    if (estado == 2) {
        pregunta = `¿Está seguro de anular el pago de <b>S/${pago}</b>?`;
        confirmacion = `Pago anulado`;
        mensaje = `Se ha anulado el pago de <b>S/. ${pago}</b>`;
    }else{
        pregunta = `¿Está seguro de habilitar el pago de <b>S/${pago}</b>?`;
        confirmacion = `Pago habilitado`;
        mensaje = `Se habilitado el pago de <b>S/. ${pago}</b>`;
    }
    Swal.fire({
        icon: 'question',
        title: 'Confirmación',
        html: `${pregunta}`,
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
    })
    .then((result) => {
        if (result.isConfirmed) {
            fetch("../controllers/deuda.php", {
                method: 'POST',
                body: parametros
            })
            .then(respuesta => {
                if (respuesta.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: `${confirmacion}`,
                        html: `${mensaje}`
                    })
                } else {
                    throw new Error('Error en la solicitud');
                }
            })
            .catch(error => {
                console.error(error);
            });
        }
    })
    
}

// Registrar pago
function registrar_pago(id,pago,deudas){
    getAporte(id);
    let opciones = ``;
    // Verificar si deudas es un array
    if (Array.isArray(deudas)) {
        deudas.forEach(element => {
            opciones += `-${element.total} `;
        });
    } else {
        opciones += `-${deudas} `;
    }

    
    const comentario = `Pago por monto,deudas saldas: ${opciones} .Aporte ${aporte}`;
    const parametros = new URLSearchParams();
    parametros.append("op", "registrar_pago");
    parametros.append("iddeudor", id);
    parametros.append("pago", pago);
    parametros.append("comentario", comentario);
    fetch("../controllers/deuda.php", {
        method: 'POST',
        body: parametros
    })
    .then(respuesta => {
        if (respuesta.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Pago registrado',
                html: 'Se ha registrado el pago'
            })
            return;
        } else {
            throw new Error('Error en la solicitud');
        }
    })
    .catch(error => {
        console.error('Error en la solicitud:', error);
        // Aquí podrías manejar el error de alguna manera
    });
}

// Para editar a la persona
function edit_person(){
    const nombre_edit = document.querySelector("#nombre-editar");
    const apellidos_edit = document.querySelector("#apellidos-editar");
    const telefono_edit = document.querySelector("#telefono-editar");
    const direccion_edit = document.querySelector("#direccion-editar");
    const parametros = new URLSearchParams();
    parametros.append("op", "edit_person")
    parametros.append("nombre", nombre_edit.value)
    parametros.append("apellidos", apellidos_edit.value)
    parametros.append("telefono", telefono_edit.value)
    parametros.append("direccion", direccion_edit.value)
    parametros.append("idpersona", idPersona)
    fetch("../controllers/deuda.php", {
        method: 'POST',
        body: parametros
    })
    .then(respuesta => {
        if (respuesta.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Persona actualizada',
                html: `Se ha editado a la persona ${nombre_edit.value}`
            })
            return;
        }
    })
}

// Para registrar a la persona
async function register_person(){
    const txtNombre = document.querySelector("#nombre");
    const txtApellidos = document.querySelector("#apellidos");
    const txtTelefono = document.querySelector("#telefono");
    const txtDireccion = document.querySelector("#direccion");
    const parametros = new URLSearchParams();
    parametros.append("op", "registerPerson")
    parametros.append("nombre", txtNombre.value)
    parametros.append("apellidos", txtApellidos.value)
    parametros.append("telefono", txtTelefono.value)
    parametros.append("direccion", txtDireccion.value)
    fetch("../controllers/deuda.php", {
        method: 'POST',
        body: parametros
    })
    .then(respuesta => {
        if (respuesta.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Persona registrada',
                html: 'Se ha registrado una persona'
            })
            return;
        }
    })
}

// Función que obtiene el ultino idpersona creado
async function get_idpersona(){
    const parametros = new URLSearchParams();
    parametros.append("op", "getPersona");
    fetch("../controllers/deuda.php", {
        method: 'POST',
        body: parametros
    })
    .then(respuesta => respuesta.json())
    .then(datos => {
        register_debtor(datos.idpersona);
    })
    .catch(error => {
        console.error(error);
    });
}

// Función que registra al deudor
function register_debtor(id){
    const parametros = new URLSearchParams();
    parametros.append("op", "registerDebtor")
    parametros.append("idpersona", id)
    fetch("../controllers/deuda.php", {
        method: 'POST',
        body: parametros
    })
    .then(respuesta => {
        if (respuesta.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Deudor registrado',
                html: 'Se ha registrado un nuevo deudor'
            })
            return;
        }
    })
}

// Función para registrar a la persona y al deudor
function register_deudor(){
    const txtNombre = document.querySelector("#nombre");
    const txtApellidos = document.querySelector("#apellidos");
    const txtTelefono = document.querySelector("#telefono");
    const txtDireccion = document.querySelector("#direccion");

    if (!txtNombre.value || !txtApellidos.value || !txtTelefono.value || !txtDireccion.value) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos incompletos',
            text: 'Por favor, completa todos los campos.',
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
    })
    .then(async (result) => { // Marca la función como async aquí
        if (result.isConfirmed) {
            await register_person();
            await get_idpersona();
        }
    });
}

// Función para pagar la deuda
function pay(iddeuda, idventa,total){
    Swal.fire({
        icon: 'question',
        title: 'Confirmación',
        text: '¿Está seguro de pagar esta deuda?',
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
    })
    .then(async (result) => { // Marca la función como async aquí
        if (result.isConfirmed) {
            await pay_debt(iddeuda);
            await pay_sale(idventa);
            registrar_pago(idDebtor,total,total);
            get_debts(idDebtor);
            list();
        }
    });
}

// Función para cambiar el estado de la deuda a 2 (es para saldar la deuda)
async function pay_debt(iddeuda){
    const parametros = new URLSearchParams();
    parametros.append("op", "change_estate");
    parametros.append("iddeuda", iddeuda);
    parametros.append("estado", 2);
    fetch("../controllers/deuda.php", {
        method: 'POST',
        body: parametros
    })
    .then(respuesta => {
        if (respuesta.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Deuda Salda',
                html: 'Se ha saldado la deuda'
            })
        } else {
            throw new Error('Error en la solicitud');
        }
    })
    .catch(error => {
        console.error(error);
    });
}

// Función para cambiar el estado de la venta a 1(cambia la venta a estado "pagado")
async function pay_sale(idventa){
    const parametros = new URLSearchParams();
    parametros.append("op", "change_estate");
    parametros.append("idventa", idventa);
    parametros.append("estado", 1);
    fetch("../controllers/venta.php", {
        method: 'POST',
        body: parametros
    })
    .then(respuesta => {
        if (respuesta.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Venta Actualizada',
                html: 'Se ha actualizado la venta'
            })
        } else {
            throw new Error('Error en la solicitud');
        }
    })
    .catch(error => {
        console.error(error);
    });
}

// Ingresa los deudores a los select
function getDebtors(){
    const txtDeudores = document.querySelector("#deudores-buscar");
    const txtDeudor = document.querySelector("#deudor-buscar");
    const parametros = new URLSearchParams();
    parametros.append("op", "listDepdtors");
    fetch("../controllers/deuda.php", {
        method: 'POST',
        body: parametros
    })
    .then(respuesta => respuesta.json())
    .then(datos =>{
        let options = `<option value=''>Seleccione un deudor</option>>`;
        datos.forEach(element => {
            options += `<option value='${element.iddeudor}'>${element.nombre} ${element.apellidos}</option>`;
        });
        txtDeudores.innerHTML = options;
        txtDeudor.innerHTML = options;
    })
}

// Función para obtener los detalles de las ventas(abre el modal de la venta)
function get_sale(id){
    const modalCarrito = document.querySelector("#modal-ventas");
    const tablaV = document.querySelector("#tabla-ventas");
    const tbodyV = tablaV.querySelector("tbody");
    const txtTotal = document.querySelector("#total");
    const parametros = new URLSearchParams();
    parametros.append("op", "getVenta");
    parametros.append("idventa", id);
    const bootstrapModal = new bootstrap.Modal(modalCarrito);
    bootstrapModal.show();
    fetch("../controllers/venta.php", {
        method: 'POST',
        body: parametros
    })
    .then(respuesta => respuesta.json())
    .then(datos => {
        tbodyV.innerHTML = "";
        let tbody = "";
        let contador = 1;
        datos.forEach(element => {
            const precio = parseFloat(element.precio).toString();
            const total = parseFloat(element.total).toString();
            tbody += `
                <tr>
                    <td data-label='#'>${contador}</td>
                    <td data-label='Productos'>${element.producto}</td>
                    <td data-label='Precio'> S/ ${precio}</td>
                    <td data-label='Cantidad'> ${element.cantidad}</td>
                    <td data-label='Total'> S/ ${total}</td>
                </tr>
            `;
            contador++;
        });
        tbodyV.innerHTML = tbody;
        txtTotal.value = datos[0]['totalV'];
    })
}

// Función que reactiva la deuda
function reactivar_deuda(iddeuda, idventa) {
    Swal.fire({
        icon: 'question',
        title: 'Confirmación',
        text: '¿Está seguro reactivar la deuda?',
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
    })
    .then(async (result) => { // Marca la función como async aquí
        if (result.isConfirmed) {
            await reactivar_debt(iddeuda);
            await reactivar_fiado(idventa);
            get_debts(idDebtor);
            list();
        }
    });
}

// Función para cambiar el estado de la deuda a 1(reactiva la deuda)
async function reactivar_debt(iddeuda){
    const parametros = new URLSearchParams();
    parametros.append("op", "change_estate");
    parametros.append("iddeuda", iddeuda);
    parametros.append("estado", 1);
    fetch("../controllers/deuda.php", {
        method: 'POST',
        body: parametros
    })
    .then(respuesta => {
        if (respuesta.ok) {
            change_estate_debtor(2);
            Swal.fire({
                icon: 'success',
                title: 'Deuda reactivada',
                html: 'Se ha reactivado la deuda'
            })
        } else {
            throw new Error('Error en la solicitud');
        }
    })
    .catch(error => {
        console.error(error);
    });
}

// Función para cambiar el estado de la venta a 2(reactiva al modo fiado)
async function reactivar_fiado(idventa){
    const parametros = new URLSearchParams();
    parametros.append("op", "change_estate");
    parametros.append("idventa", idventa);
    parametros.append("estado", 2);
    fetch("../controllers/venta.php", {
        method: 'POST',
        body: parametros
    })
    .then(respuesta => {
        if (respuesta.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Venta Actualizada',
                html: 'Se ha agregado a la deuda'
            })
        } else {
            throw new Error('Error en la solicitud');
        }
    })
    .catch(error => {
        console.error(error);
    });
}

// Cambia el estado del deudor
function change_estate_debtor(estado){
    const parametros = new URLSearchParams();
    parametros.append("op", "change_estate_deptor");
    parametros.append("iddeudor", idDebtor);
    parametros.append("estado", estado);
    fetch("../controllers/deuda.php", {
        method: 'POST',
        body: parametros
    })
    .then(respuesta => {
        if (respuesta.ok) {
            console.log("Estado no pagado del deudor");
        } else {
            throw new Error('Error en la solicitud');
        }
    })
    .catch(error => {
        console.error(error);
    });
}

// Verifica si los deudores tienes deudas pendientes o no
function verify_estate_debtors(){
    const parametros = new URLSearchParams();
    parametros.append("op", "list_debtor_debts");
    fetch("../controllers/deuda.php", {
        method: 'POST',
        body: parametros
    })
    .then(respuesta => {
        if (respuesta.ok) {
        } else {
            throw new Error('Error en la solicitud');
        }
    })
    .catch(error => {
        console.error(error);
    });
}

// Paga las deudas por monto
function pago_por_monto(){
    const txtAporte = document.querySelector("#monto-pagar");
    if (!txtAporte.value) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos incompletos',
            text: 'Por favor, ingrese un monto',
        });
        return;
    }
    const parametros = new URLSearchParams();
    parametros.append("op", "aporte");
    parametros.append("iddeudor", idDebtor);
    parametros.append("aporte", txtAporte.value);

    Swal.fire({
        icon: 'question',
        title: 'Confirmación',
        text: '¿Está seguro del monto ingresado?',
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
    }).then((result) => {
        if (result.isConfirmed) {
            fetch("../controllers/deuda.php", {
                method: 'POST',
                body: parametros
            })
            .then(respuesta => respuesta.json())
            .then(datos =>{
                getAporte(idDebtor);
                    Swal.fire({
                        icon: 'success',
                        title: 'Deudas saldadas',
                        html: 'Se ha saldado las deudas'
                    }).then(() => {
                        get_debts(idDebtor)
                        registrar_pago(idDebtor,txtAporte.value,datos);
                    });

            })
            .catch(error => {
                console.error(error);
            });
        }
    })
}

// Obtiene el aporte del deudor
function getAporte(id){
    const txtAporte = document.querySelector("#total-aporte");
    const parametros = new URLSearchParams();
    parametros.append("op", "getDebtor");
    parametros.append("iddeudor", id);
    fetch("../controllers/deuda.php", {
        method: 'POST',
        body: parametros
    })
    .then(respuesta => respuesta.json())
    .then(datos =>{
        txtAporte.value = datos.aporte;
        aporte = datos.aporte;
    })
}

// Función para buscar (incluye fechas limites)
function search_debts(){
    const txttotal = document.querySelector("#total-deuda")
    const tablaDeudas = document.querySelector("#tabla-deudas");
    const tbodyDeudas = tablaDeudas.querySelector("tbody");

    const txtDeudor = document.querySelector("#deudores-buscar");
    const txtFecha = document.querySelector("#fecha-buscar");
    const txtFechaL = document.querySelector("#fecha-fin-buscar");
    const minDeuda = document.querySelector("#minimo-deudas-buscar");
    const maxDeuda = document.querySelector("#maximo-deudas-buscar");
    const txtEstado = document.querySelector("#estado-buscar");
    const parametros = new URLSearchParams();

    if (txtFechaL.value === "") {
        console.log("CONSULTA SIN FECHAS LIMITES");
        search_debts2();
    }else{
        parametros.append("op", "buscar_deudas");
        parametros.append("iddeudor", txtDeudor.value);
        parametros.append("fecha", "");
        parametros.append("fecha_inicio", txtFecha.value);
        parametros.append("fecha_fin", txtFechaL.value);
        parametros.append("total_min", minDeuda.value);
        parametros.append("total_max", maxDeuda.value);
        parametros.append("estado", txtEstado.value);
        fetch("../controllers/deuda.php",{
            method: 'POST',
            body: parametros
        })
        .then(respuesta => respuesta.json())
        .then(datos => {
            let total = 0;
            tbodyDeudas.innerHTML = "";
            let contador = 1;
            let tbody = "";
            datos.forEach(element => {
                if (element.estado == 1) {
                    total += parseFloat(element.total);
                }
                const estado = element.estado == 1 ? 'No pagado' : element.estado == 2 ? 'Pagado' : element.estado;
                if (element.estado == 1) {
                    tbody += `
                    <tr ondblclick ='get_sale(${element.idventa})'>
                        <td data-label='#'>${contador}</td>
                        <td data-label='Productos'>${element.productos}</td>
                        <td data-label='Total'>S/ ${element.total}</td>
                        <td data-label='Fecha'>${element.fecha_creacion}</td>
                        <td data-label='Estado'><span class='badge rounded-pill' style='background-color: #005478'>${estado}</td>
                        <td data-label='Acción'>
                            <a class='btn btn-sm btn-outline-success' title='Clic, para saldar la deuda'
                                onclick='pay(${element.iddeuda}, ${element.idventa})' type='button'>
                                <i class="fa-solid fa-cash-register"></i>
                            </a>
                        </td>
                    </tr>
                `;
                }else{
                    tbody += `
                    <tr ondblclick ='get_sale(${element.idventa})'>
                        <td data-label='#'>${contador}</td>
                        <td data-label='Productos'>${element.productos}</td>
                        <td data-label='Total'>S/ ${element.total}</td>
                        <td data-label='Fecha'>${element.fecha_creacion}</td>
                        <td data-label='Estado'><span class='badge rounded-pill' style='background-color: #005478'>${estado}</td>
                        <td data-label='Acción'>
                            <a class='btn btn-sm btn-outline-primary' title='Clic, para reactivar la deuda' 
                                onclick='reactivar_deuda(${element.iddeuda}, ${element.idventa})' type='button'>
                                <i class="fa-solid fa-money-bill"></i>
                            </a>
                        </td>
                    </tr>
                `;
                }
                
                contador++;
            });
            // Actualizar el valor de txtTotalSearch fuera del bucle
            txttotal.value = total;
            tbodyDeudas.innerHTML = tbody;
        })
    }

}

// Función para buscar (sin fechas límites)
function search_debts2() {
    const txttotal = document.querySelector("#total-deuda");
    const tablaDeudas = document.querySelector("#tabla-deudas");
    const tbodyDeudas = tablaDeudas.querySelector("tbody");

    const txtDeudor = document.querySelector("#deudores-buscar");
    const txtFecha = document.querySelector("#fecha-buscar");
    const minDeuda = document.querySelector("#minimo-deudas-buscar");
    const maxDeuda = document.querySelector("#maximo-deudas-buscar");
    const txtEstado = document.querySelector("#estado-deudas-buscar");
    const parametros = new URLSearchParams();

    parametros.append("op", "buscar_deudas2");
    parametros.append("iddeudor", txtDeudor.value);
    parametros.append("fecha", txtFecha.value);
    parametros.append("total_min", minDeuda.value);
    parametros.append("total_max", maxDeuda.value);
    parametros.append("estado", txtEstado.value);
    fetch("../controllers/deuda.php", {
        method: 'POST',
        body: parametros
    })
    .then(respuesta => respuesta.json())
    .then(datos => {
        let total = 0;
        tbodyDeudas.innerHTML = "";
        let contador = 1;
        let tbody = "";
        datos.forEach(element => {
            if (element.estado == 1) {
                total += parseFloat(element.total);
            }
            const estado = element.estado == 1 ? 'No pagado' : element.estado == 2 ? 'Pagado' : element.estado;
            if (element.estado == 1) {
                tbody += `
                <tr ondblclick ='get_sale(${element.idventa})'>
                    <td data-label='#'>${contador}</td>
                    <td data-label='Productos'>${element.productos}</td>
                    <td data-label='Total'>S/ ${element.total}</td>
                    <td data-label='Fecha'>${element.fecha_creacion}</td>
                    <td data-label='Estado'><span class='badge rounded-pill' style='background-color: #005478'>${estado}</td>
                    <td data-label='Acción'>
                        <a class='btn btn-sm btn-outline-success' title='Clic, para saldar la deuda'
                            onclick='pay(${element.iddeuda}, ${element.idventa})' type='button'>
                            <i class="fa-solid fa-cash-register"></i>
                        </a>
                    </td>
                </tr>
            `;
            } else {
                tbody += `
                <tr ondblclick ='get_sale(${element.idventa})'>
                    <td data-label='#'>${contador}</td>
                    <td data-label='Productos'>${element.productos}</td>
                    <td data-label='Total'>S/ ${element.total}</td>
                    <td data-label='Fecha'>${element.fecha_creacion}</td>
                    <td data-label='Estado'><span class='badge rounded-pill' style='background-color: #005478'>${estado}</td>
                    <td data-label='Acción'>
                        <a class='btn btn-sm btn-outline-primary' title='Clic, para reactivar la deuda' 
                            onclick='reactivar_deuda(${element.iddeuda}, ${element.idventa})' type='button'>
                            <i class="fa-solid fa-money-bill"></i>
                        </a>
                    </td>
                </tr>
            `;
            }
            contador++;
        });

        // Actualizar el valor de txtTotalSearch fuera del bucle
        txttotal.value = total;
        tbodyDeudas.innerHTML = tbody;
    })
    .catch(error => {
        console.error('Error en la búsqueda:', error);
        // Mostrar mensaje en algún lugar de tu interfaz (puedes ajustar según tu estructura HTML)
        let tbody = `
            <tr>
                <td class='text-center' colspan='6'>No se encontraron coincidencias</td>
            </tr>
        `;
        tbodyDeudas.innerHTML = tbody;
        // Puedes limpiar otros elementos o realizar otras acciones según tu necesidad
        txttotal.value = 0;
    });
}

// Función para buscar (sin fechas limites)
function search_debtors(){
    const tablaDeudas = document.querySelector("#tabla-deudores");
    const tbodyDeudas = tablaDeudas.querySelector("tbody");

    const txtDeudor = document.querySelector("#deudor-buscar");
    const minDeuda = document.querySelector("#minimo-deuda-buscar");
    const maxDeuda = document.querySelector("#maximo-deuda-buscar");
    const txtEstado = document.querySelector("#estado-buscar");
    const parametros = new URLSearchParams();

    parametros.append("op", "search_debtors");
    parametros.append("iddeudor", txtDeudor.value);
    parametros.append("total_min", minDeuda.value);
    parametros.append("total_max", maxDeuda.value);
    parametros.append("estado", txtEstado.value);
    fetch("../controllers/deuda.php",{
        method: 'POST',
        body: parametros
    })
    .then(respuesta => respuesta.json())
    .then(datos => {
        tbodyDeudas.innerHTML = "";
        let contador = 1;
        let tbody = "";
        datos.forEach(element => {
            const estado = element.estado == 1 ? 'No debe' : element.estado == 2 ? 'Debe' : element.estado;
            tbody += `
                <tr ondblclick='get_debts(${element.iddeudor})'>
                    <td data-label='#'>${contador}</td>
                    <td data-label='Nombre'>${element.nombre}</td>
                    <td data-label='Apellidos'>${element.apellidos}</td>
                    <td data-label='Deudas'>${element.deudas}</td>
                    <td data-label='Total'>S/ ${element.total_ventas}</td>
                    <td data-label='Estado'><span class='badge rounded-pill' style='background-color: #005478'>${estado}</td>
                    <td data-label='Acción'>
                        <a class='btn btn-sm btn-outline-success' type='button' onclick='get(${element.idpersona})'>
                        <i class="fa-regular fa-pen-to-square"></i>
                        </a>
                    </td>
                </tr>
            `;
            contador++;
        });
        tbodyDeudas.innerHTML = tbody;
    })

}

// Función para buscar (incluye fechas limites)
function buscar_pagos(){
    const tablaPagos = document.querySelector("#tabla-pagos");
    const tbodyP = tablaPagos.querySelector("tbody");

    const txtFecha = document.querySelector("#fecha-pago-buscar");
    const txtFechaL = document.querySelector("#fecha-pago-fin-buscar");
    const minDeuda = document.querySelector("#minimo-pago-buscar");
    const maxDeuda = document.querySelector("#maximo-pago-buscar");
    const txtEstado = document.querySelector("#estado-pago-buscar");
    const parametros = new URLSearchParams();

    parametros.append("op", "buscar_pagos");
    parametros.append("iddeudor", idDebtor);
    parametros.append("fecha_inicio", txtFecha.value);
    parametros.append("fecha_fin", txtFechaL.value);
    parametros.append("total_min", minDeuda.value);
    parametros.append("total_max", maxDeuda.value);
    parametros.append("estado", txtEstado.value);
    fetch("../controllers/deuda.php",{
        method: 'POST',
        body: parametros
    })
    .then(respuesta => respuesta.json())
    .then(datos => {
        let tbody = "";
        tbodyP.innerHTML = "";
        let contador = 1;
        datos.forEach(element => {
            const estado = element.estado == 1 ? 'Activo' : element.estado == 2 ? 'Inactivo' : element.estado;
            let btnEstado = ``;
            if (idDebtor == element.iddeudor) {
                if (element.estado == 1) {
                    btnEstado =`<a class='btn btn-sm btn-outline-danger' onclick='cambiar_estado_pago(${element.idpago}, 2, ${element.pago})' 
                                    title='Clic, para anular pago' type='button'>
                                    <i class="fas fa-times-circle"></i>
                                </a>`;
                }else{
                    btnEstado =`<a class='btn btn-sm btn-outline-primary' onclick='cambiar_estado_pago(${element.idpago}, 1, ${element.pago})'
                                    title='Clic, para habilitar pago' type='button'>
                                    <i class="fa-solid fa-check"></i>
                                </a>`;
                }
                
                tbody += `
                    <tr title='Doble clic, para ver las deudas'>
                        <td data-label='#'>${contador}</td>
                        <td data-label='Pago'>S/ ${element.pago}</td>
                        <td data-label='Fecha'>${element.fecha_creacion}</td>
                        <td data-label='Comentario'>${element.comentario}</td>
                        <td data-label='Comentario'><span class='badge rounded-pill' style='background-color: #005478'>${estado}</td>
                        <td data-label='Acción'>
                            ${btnEstado} 
                        </td>
                    </tr>
                `;
            contador++;
            }
        });
        tbodyP.innerHTML = tbody;
    })

}

function abrirModalMonto(){
    const modalMonto = document.querySelector("#modal-aporte");
    const bootstrapModal = new bootstrap.Modal(modalMonto);
    bootstrapModal.show();
}

verify_estate_debtors();
getDebtors();

const btnRegister = document.querySelector("#registrar-deudor")
btnRegister.addEventListener("click", register_deudor);

const btnEditar = document.querySelector("#editar-deudor")
btnEditar.addEventListener("click", edit_person);

const btnAporte = document.querySelector("#btn-pagar");
btnAporte.addEventListener("click", abrirModalMonto);

const btnAportePagar = document.querySelector("#btn-pagar-monto");
btnAportePagar.addEventListener("click", pago_por_monto)

const btnBuscar = document.querySelector("#buscar-deuda");
btnBuscar.addEventListener("click", search_debts)

const btnBuscarDeudores = document.querySelector("#buscar-deudores");
btnBuscarDeudores.addEventListener("click", search_debtors)

const btnBuscarP = document.querySelector("#buscar-pagos");
btnBuscarP.addEventListener("click", buscar_pagos)

list();