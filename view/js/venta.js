const tabla = document.querySelector("#tabla-ventas");
const tbodyV = tabla.querySelector("tbody");
const modalCarrito = document.querySelector("#modal-editar");
const txtDeuda = document.querySelector("#deuda");

function listar(){
    const parametros = new URLSearchParams();
    parametros.append("op", "list");
    fetch('../controllers/venta.php', {
        method: 'POST',
        body: parametros
    })
    .then(respuesta => respuesta.json())
    .then(datos => {
        let contador = 1;
        let tbody = "";
        datos.forEach(element => {
            // Formatear el precio con dos decimales fijos
            const precioSinDecimales = parseFloat(element.total).toString();
            const estado = element.estado == 1 ? 'Pagado' : element.estado == 2 ? 'Fiado' : element.estado == 3 ? 'Anulado' : element.estado;
            const metodo = element.metodo == 1 ? 'Efectivo' : element.metodo == 2 ? 'Yape' : element.metodo == 3 ? 'Plin' : element.metodo;
            const color = element.metodo == 1 ? '005478' : element.metodo == 2 ? '900584' : element.metodo == 3 ? '00FFD1' : element.metodo;
            const colorestado = element.estado == 1 ? '005478' : element.estado == 2 ? '02FF97' : element.estado == 3 ? 'FD0000' : element.estado;
            let accionHtml = '';
            if (element.estado == 3) {
                accionHtml = `
                    <a class='btn btn-sm btn-outline-success' onclick='activar_venta(${element.idventa})' title='Activar venta' type='button' data-idventa='${element.idventa}'>
                        <i class="fa-solid fa-check"></i>
                    </a>`;
            } else {
                accionHtml = `
                        <a class='btn btn-sm btn-outline-danger' onclick='anular_venta(${element.idventa})' title='Anular venta' type='button' data-idventa='${element.idventa}'>
                            <i class="fa-solid fa-trash"></i>
                        </a>`;
            }
            if (element.estado == 1) {
                tbody += `
                    <tr title='Doble clic, para ver la venta' ondblclick="get(${element.idventa})">
                        <td data-label='#'>${contador}</td>
                        <td data-label='Productos'>${element.productos}</td>
                        <td data-label='Fecha'>${element.fecha_creacion}</td>
                        <td data-label='Total'> S/ ${precioSinDecimales}</td>
                        <td data-label='Metodo'><span class='badge rounded-pill' style='background-color: #${color}'>${metodo}</td>
                        <td data-label='Estado'><span class='badge rounded-pill' style='background-color: #${colorestado} '>${estado}</td>
                        <td data-label='Acción'>
                            ${accionHtml}
                        </td>
                    </tr>
                `;
            }
            contador++;
        });
        tbodyV.innerHTML = tbody;
    })
}

function get(id){
    const txtDeudor = document.querySelector("#datos-deudor");
    const tablaD = document.querySelector("#tabla-datos");
    const tbodyD = tablaD.querySelector("tbody");
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
        txtDeudor.innerHTML = "";
        tbodyD.innerHTML = "";
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
            if (element.estado == 2 || element.estado == 3 || element.estado == 1) {
                getDebt(id);
            }
        });
        tbodyD.innerHTML = tbody;
        txtTotal.value = datos[0]['totalV'];
    })
}

// Función para traer los datos del deudor en caso la venta sea fiada
function getDebt(id){
    const txtDeudor = document.querySelector("#datos-deudor");
    const parametros = new URLSearchParams();
    parametros.append("op", "get_sale_debts");
    parametros.append("idventa", id);
    fetch("../controllers/deuda.php", {
        method: 'POST',
        body: parametros
    })
    .then(respuesta => respuesta.json())
    .then(datos => {
        txtDeudor.innerHTML = "";
        txtDeudor.innerHTML= `
            <p><b>Deudor: </b> ${datos.apellidos} ${datos.nombre}</p>
        `;
    })
}   

// Buscar con ventas con fechas limites
function search(){
    const txtTotalSearch = document.querySelector("#total_day");
    const txtProducto = document.querySelector("#producto-buscar");
    const txtTotal = document.querySelector("#total-buscar");
    const txtFecha = document.querySelector("#fecha-buscar");
    const txtFechaL = document.querySelector("#fecha-limite-buscar");
    const txtEstado = document.querySelector("#estado-buscar");
    const txtUsuario = document.querySelector("#usuario-buscar");
    const txtMetodo = document.querySelector("#metodo-buscar");
    const parametros = new URLSearchParams();

    if (txtProducto.value > 0) {
        search3();
        console.log("BUSQUEDA DE PRODUCTOS")
    }else{
        if (txtFechaL.value === "") {
            search2();
            console.log("BUSQUEDA SIN FECHAS LIMITES")
        }else{
            parametros.append("op", "buscar_1");
            parametros.append("total", txtTotal.value);
            parametros.append("fecha_inicio", txtFecha.value);
            parametros.append("fecha_fin", txtFechaL.value);
            parametros.append("metodo", txtMetodo.value);
            parametros.append("estado", txtEstado.value);
            parametros.append("idusuario", txtUsuario.value);
            fetch("../controllers/venta.php",{
                method: 'POST',
                body: parametros
            })
            .then(respuesta => respuesta.json())
            .then(datos => {
                txtTotalSearch.value = 0;
                let total = 0;
                tbodyV.innerHTML = "";
                let contador = 1;
                let tbody = "";
                datos.forEach(element => {
                    total += parseFloat(element.total);
                    // Formatear el precio con dos decimales fijos
                    const precioSinDecimales = parseFloat(element.total).toString();
                    const estado = element.estado == 1 ? 'Pagado' : element.estado == 2 ? 'Fiado' : element.estado == 3 ? 'Anulado' : element.estado;
                    const metodo = element.metodo == 1 ? 'Efectivo' : element.metodo == 2 ? 'Yape' : element.metodo == 3 ? 'Plin' : element.metodo;
                    const color = element.metodo == 1 ? '005478' : element.metodo == 2 ? '900584' : element.metodo == 3 ? '00FFD1' : element.metodo;
                    const colorestado = element.estado == 1 ? '005478' : element.estado == 2 ? '02FF97' : element.estado == 3 ? 'FD0000' : element.estado;
                    let accionHtml = '';
                    if (element.estado == 3) {
                        accionHtml = `
                            <a class='btn btn-sm btn-outline-success' onclick='activar_venta(${element.idventa})' title='Activar venta' type='button' data-idventa='${element.idventa}'>
                                <i class="fa-solid fa-check"></i>
                            </a>`;
                    } else {
                        accionHtml = `
                                <a class='btn btn-sm btn-outline-danger' onclick='anular_venta(${element.idventa})' title='Anular venta' type='button' data-idventa='${element.idventa}'>
                                    <i class="fa-solid fa-trash"></i>
                                </a>`;
                    }
                    if (txtDeuda.checked) {
                        if (element.deuda == 1) {
                            tbody += `
                            <tr title='Doble clic, para ver la venta' ondblclick="get(${element.idventa})">
                                <td data-label='#'>${contador}</td>
                                <td data-label='Productos'>${element.productos}</td>
                                <td data-label='Fecha'>${element.fecha_creacion}</td>
                                <td data-label='Total'> S/ ${precioSinDecimales}</td>
                                <td data-label='Metodo'><span class='badge rounded-pill' style='background-color: #${color}'>${metodo}</td>
                                <td data-label='Estado'><span class='badge rounded-pill' style='background-color: #${colorestado} '>${estado}</td>
                                <td data-label='Acción'>
                                    ${accionHtml}
                                </td>
                            </tr>
                            `;
                            contador++;
                        }
                    }else{
                        tbody += `
                        <tr title='Doble clic, para ver la venta' ondblclick="get(${element.idventa})">
                            <td data-label='#'>${contador}</td>
                            <td data-label='Productos'>${element.productos}</td>
                            <td data-label='Fecha'>${element.fecha_creacion}</td>
                            <td data-label='Total'> S/ ${precioSinDecimales}</td>
                            <td data-label='Metodo'><span class='badge rounded-pill' style='background-color: #${color}'>${metodo}</td>
                            <td data-label='Estado'><span class='badge rounded-pill' style='background-color: #${colorestado} '>${estado}</td>
                            <td data-label='Acción'>
                                ${accionHtml}
                            </td>
                        </tr>
                    `;
                    }
                    contador++;
                });
                // Actualizar el valor de txtTotalSearch fuera del bucle
                txtTotalSearch.value = total;
                tbodyV.innerHTML = tbody;
            })
        }
    }

}

// Buscar ventas sin fechas limites
function search2(){
    const txtTotalSearch = document.querySelector("#total_day");
    const txtTotal = document.querySelector("#total-buscar");
    const txtFecha = document.querySelector("#fecha-buscar");
    const txtEstado = document.querySelector("#estado-buscar");
    const txtMetodo = document.querySelector("#metodo-buscar");
    const txtUsuario = document.querySelector("#usuario-buscar");
    const parametros = new URLSearchParams();
    parametros.append("op", "buscar_2");
    parametros.append("total", txtTotal.value);
    parametros.append("fecha", txtFecha.value);
    parametros.append("metodo", txtMetodo.value);
    parametros.append("estado", txtEstado.value);
    parametros.append("idusuario", txtUsuario.value);
    fetch("../controllers/venta.php",{
        method: 'POST',
        body: parametros
    })
    .then(respuesta => respuesta.json())
    .then(datos => {
        txtTotalSearch.value = 0;
        let total = 0;
        tbodyV.innerHTML = "";
        let contador = 1;
        let tbody = "";
        datos.forEach(element => {
            // Formatear el precio con dos decimales fijos
            const precioSinDecimales = parseFloat(element.total).toString();
            const estado = element.estado == 1 ? 'Pagado' : element.estado == 2 ? 'Fiado' : element.estado == 3 ? 'Anulado' : element.estado;
            const metodo = element.metodo == 1 ? 'Efectivo' : element.metodo == 2 ? 'Yape' : element.metodo == 3 ? 'Plin' : element.metodo;
            const color = element.metodo == 1 ? '005478' : element.metodo == 2 ? '900584' : element.metodo == 3 ? '00FFD1' : element.metodo;
            const colorestado = element.estado == 1 ? '005478' : element.estado == 2 ? '02FF97' : element.estado == 3 ? 'FD0000' : element.estado;
            let accionHtml = '';
            if (element.estado == 3) {
                accionHtml = `
                    <a class='btn btn-sm btn-outline-success' onclick='activar_venta(${element.idventa})' title='Activar venta' type='button' data-idventa='${element.idventa}'>
                        <i class="fa-solid fa-check"></i>
                    </a>`;
            } else {
                accionHtml = `
                        <a class='btn btn-sm btn-outline-danger' onclick='anular_venta(${element.idventa})' title='Anular venta' type='button' data-idventa='${element.idventa}'>
                            <i class="fa-solid fa-trash"></i>
                        </a>`;
            }

            if (txtDeuda.checked) {
                if (element.deuda == 1) {
                    total += parseFloat(element.total);
                    tbody += `
                    <tr title='Doble clic, para ver la venta' ondblclick="get(${element.idventa})">
                        <td data-label='#'>${contador}</td>
                        <td data-label='Productos'>${element.productos}</td>
                        <td data-label='Fecha'>${element.fecha_creacion}</td>
                        <td data-label='Total'> S/ ${precioSinDecimales}</td>
                        <td data-label='Metodo'><span class='badge rounded-pill' style='background-color: #${color}'>${metodo}</td>
                        <td data-label='Estado'><span class='badge rounded-pill' style='background-color: #${colorestado} '>${estado}</td>
                        <td data-label='Acción'>
                            ${accionHtml}
                        </td>
                    </tr>
                    `;
                    contador++;
                }
            }else{
                total += parseFloat(element.total);
                tbody += `
                <tr title='Doble clic, para ver la venta' ondblclick="get(${element.idventa})">
                    <td data-label='#'>${contador}</td>
                    <td data-label='Productos'>${element.productos}</td>
                    <td data-label='Fecha'>${element.fecha_creacion}</td>
                    <td data-label='Total'> S/ ${precioSinDecimales}</td>
                    <td data-label='Metodo'><span class='badge rounded-pill' style='background-color: #${color}'>${metodo}</td>
                    <td data-label='Estado'><span class='badge rounded-pill' style='background-color: #${colorestado} '>${estado}</td>
                    <td data-label='Acción'>
                        ${accionHtml}
                    </td>
                </tr>
            `;
            }
        });
        // Actualizar el valor de txtTotalSearch fuera del bucle
        txtTotalSearch.value = total;
        tbodyV.innerHTML = tbody;
    })
    
}

// Buscar por producto
function search3(){
    const txtTotalSearch = document.querySelector("#total_day");
    const txtProducto = document.querySelector("#producto-buscar");
    const txtTotal = document.querySelector("#total-buscar");
    const txtFecha = document.querySelector("#fecha-buscar");
    const txtFechaL = document.querySelector("#fecha-limite-buscar");
    const txtEstado = document.querySelector("#estado-buscar");
    const txtUsuario = document.querySelector("#usuario-buscar");
    const txtMetodo = document.querySelector("#metodo-buscar");
    const parametros = new URLSearchParams();
    parametros.append("op", "buscar_3");
    parametros.append("idproducto", txtProducto.value);
    parametros.append("fecha_inicio", txtFecha.value);
    parametros.append("fecha_fin", txtFechaL.value);
    parametros.append("total", txtTotal.value);
    parametros.append("metodo", txtMetodo.value);
    parametros.append("idusuario", txtUsuario.value);
    parametros.append("estado", txtEstado.value);
    fetch("../controllers/venta.php",{
        method: 'POST',
        body: parametros
    })
    .then(respuesta => respuesta.json())
    .then(datos => {
        let total = 0;
        tbodyV.innerHTML = "";
        let contador = 1;
        let tbody = "";
        datos.forEach(element => {
            total += parseFloat(element.totalP);
            // Formatear el precio con dos decimales fijos
            const precioSinDecimales = parseFloat(element.totalP).toString();
            const estado = element.estado == 1 ? 'Pagado' : element.estado == 2 ? 'Fiado' : element.estado == 3 ? 'Anulado' : element.estado;
            const metodo = element.metodo == 1 ? 'Efectivo' : element.metodo == 2 ? 'Yape' : element.metodo == 3 ? 'Plin' : element.metodo;
            const color = element.metodo == 1 ? '005478' : element.metodo == 2 ? '900584' : element.metodo == 3 ? '00FFD1' : element.metodo;
            const colorestado = element.estado == 1 ? '005478' : element.estado == 2 ? '02FF97' : element.estado == 3 ? 'FD0000' : element.estado;
            let accionHtml = '';
            if (element.estado == 3) {
                accionHtml = `
                    <a class='btn btn-sm btn-outline-success' onclick='activar_venta(${element.idventa})' title='Activar venta' type='button' data-idventa='${element.idventa}'>
                        <i class="fa-solid fa-check"></i>
                    </a>`;
            } else {
                accionHtml = `
                        <a class='btn btn-sm btn-outline-danger' onclick='anular_venta(${element.idventa})' title='Anular venta' type='button' data-idventa='${element.idventa}'>
                            <i class="fa-solid fa-trash"></i>
                        </a>`;
            }
            if (txtDeuda.checked) {
                if (element.deuda == 1) {
                    tbody += `
                    <tr title='Doble clic, para ver la venta' ondblclick="get(${element.idventa})">
                        <td data-label='#'>${contador}</td>
                        <td data-label='Productos'>${element.cantidad}</td>
                        <td data-label='Fecha'>${element.fecha_creacion}</td>
                        <td data-label='Total'> S/ ${precioSinDecimales}</td>
                        <td data-label='Metodo'><span class='badge rounded-pill' style='background-color: #${color}'>${metodo}</td>
                        <td data-label='Estado'><span class='badge rounded-pill' style='background-color: #${colorestado} '>${estado}</td>
                        <td data-label='Acción'>
                            ${accionHtml}
                        </td>
                    </tr>
                    `;
                    contador++;
                }
            }else{
                tbody += `
                <tr title='Doble clic, para ver la venta' ondblclick="get(${element.idventa})">
                    <td data-label='#'>${contador}</td>
                    <td data-label='Productos'>${element.cantidad}</td>
                    <td data-label='Fecha'>${element.fecha_creacion}</td>
                    <td data-label='Total'> S/ ${precioSinDecimales}</td>
                    <td data-label='Metodo'><span class='badge rounded-pill' style='background-color: #${color}'>${metodo}</td>
                    <td data-label='Estado'><span class='badge rounded-pill' style='background-color: #${colorestado} '>${estado}</td>
                    <td data-label='Acción'>
                        ${accionHtml}
                    </td>
                </tr>
            `;
            }
            contador++;
        });
        // Actualizar el valor de txtTotalSearch fuera del bucle
        txtTotalSearch.value = total;
        tbodyV.innerHTML = tbody;
    })
    
}

function clear(){
    const txtProducto = document.querySelector("#producto-buscar");
    const txtTotal = document.querySelector("#total-buscar");
    const txtFecha = document.querySelector("#fecha-buscar");
    const txtFechaL = document.querySelector("#fecha-limite-buscar");
    const txtEstado = document.querySelector("#estado-buscar");
    const txtMetodo = document.querySelector("#metodo-buscar");
    txtProducto.value = 0;
    txtTotal.value = '';
    txtFecha.value = '';
    txtEstado.value = 0;
    txtMetodo.value = 0;
    txtFechaL.value = '';
    listar();
}

function listProducts() {
    const txtProducto = document.querySelector("#producto-buscar");
    const parametros = new URLSearchParams();
    parametros.append("op", "listAll");
    fetch("../controllers/producto.php",{
        method: 'POST',
        body: parametros
    })
    .then(respuesta => respuesta.json())
    .then(datos => {
        let option = "";
        datos.forEach(element => {
            option += `<option value='${element.idproducto}'>${element.producto}</option>`;
        });
        txtProducto.innerHTML += option;
    })
}

function anular_venta(idventa){
    Swal.fire({
        title: "¿Está seguro de anular la venta?",
        text: "La venta se guardará como anulada",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, anula la venta!"
    })
    .then(async (result) => { // Marca la función como async aquí
        if (result.isConfirmed) {
            const parametros = new URLSearchParams();
            parametros.append("op", "change_estate");
            parametros.append("idventa", idventa);
            parametros.append("estado", 3);
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
                    }).then(() => {
                        listar()
                    });
                } else {
                    throw new Error('Error en la solicitud');
                }
            })
            .catch(error => {
                console.error(error);
            });
        }
    });
}

function activar_venta(idventa){
    Swal.fire({
        title: "¿Está seguro de activar la venta?",
        text: "La venta se guardará como activada",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, activa la venta!"
    })
    .then(async (result) => { // Marca la función como async aquí
        if (result.isConfirmed) {
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
                    }).then(() => {
                        listar()
                    });
                } else {
                    throw new Error('Error en la solicitud');
                }
            })
            .catch(error => {
                console.error(error);
            });
        }
    });
}

function total_day(){
    const txtTotal = document.querySelector("#total_day")
    const params = new URLSearchParams();
    params.append("op", "total_day");
    fetch("../controllers/venta.php", {
        method: 'POST',
        body: params
    })
    .then(respuesta => respuesta.json())
    .then(datos => {
        txtTotal.value = `S/ ${datos.total}`;
    })
}

total_day();
listProducts();
listar();

const btnBuscar = document.querySelector("#buscar-venta");
btnBuscar.addEventListener("click", search)


const btnClear = document.querySelector("#limpiar");
btnClear.addEventListener("click", clear)