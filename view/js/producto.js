const tabla = document.querySelector("#tabla-producto");
const tbodyP = tabla.querySelector("tbody");
const lista_platos = document.querySelector("#platos-inactivos")
let tipo = "B";
let idProducto = 0;
let nombres = ``;
let  idsActivos = [];
let  idsSTR = "";

// Lista los platos para registrar
function list_Platos_inactivos() {
    const parametros = new URLSearchParams();
    parametros.append("op", "listar");
    parametros.append("estado", 2);
    fetch('../controllers/producto.php', {
        method: 'POST',
        body: parametros
    })
    .then(respuesta => respuesta.json())
    .then(datos => {
        let options = "<option value='0'>Seleccione el producto</option>";
        datos.forEach(element => {
            options+= `
            <option value='${element.idproducto}'>${element.producto}</option>
        `;
        });
        lista_platos.innerHTML = options;
        // Inicializa select2 después de cargar los datos
        $(lista_platos).select2();
    });
}

// Agrega los IDS que vayamos seleccionando en el array
function seleccionar() {
    idsActivos = [];
    idsSTR = ``;
    for (let option of document.querySelector("#platos-inactivos").options) {
        if (option.selected) {
        idsActivos.push(option.value)
        idsSTR += `${option.value},`
        }
    }
    console.log(idsActivos);
    console.log(idsSTR);
}

// Función para habilitar el plato con su ID
function habilitar_plato(id){
    const parametros = new URLSearchParams();
    parametros.append("op", "change_estado");
    parametros.append("idproducto", id)
    parametros.append("estado", 1)
    fetch("../controllers/producto.php", {
        method: 'POST',
        body: parametros
    })
    .then(respuesta => {
        if (respuesta.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Plato restaurado',
                html: `El plato ha sido habilitado correctamente.`
            }).then(() => {
                location.reload();
            });
        }
    })
}

// Función que recorre el array de IDS seleccionados para habilitar los productos
function habilitar_platos() {
    if (!lista_platos.value) {
        Swal.fire({
            icon: 'warning',
            title: 'No ha seleccionado un producto',
            text: 'Por favor, seleccione un producto para habilitar',
        });
        return;
    }
    seleccionar();
    Swal.fire({
        icon: 'question',
        title: 'Confirmación',
        text: '¿Está restaurar los siguientes platos?',
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
    })
    .then(async (result) => { // Marca la función como async aquí
        if (result.isConfirmed) {
            idsActivos.forEach(element => {
                habilitar_plato(element);
            });
        }
    });
}

// Lista todos los productos con estado 1
function list(){
    const parametros = new URLSearchParams();
    parametros.append("op", "listar");
    parametros.append("estado", 1);
    fetch('../controllers/producto.php', {
        method: 'POST',
        body: parametros
    })
    .then(respuesta => respuesta.json())
    .then(datos => {
        tbodyP.innerHTML = "";
        let contador = 1;
        let tbody = "";
        datos.sort((a, b) => a.tipo.localeCompare(b.tipo));
        datos.forEach(element => {
            const fechaCreate = new Date(element.fecha_creacion);
            const fecha = fechaCreate.toISOString().split('T')[0];
            const estado = element.estado == 1 ? 'Activo' : element.estado == 2 ? 'Inactivo' : element.estado;
            const stock = element.stock > 0 ? element.stock : element.tipo == 'P' ? 'Comida' : element.tipo == 'M' ? 'Combo' : element.stock;
            const color  = element.stock > 0 ? '07853C' : element.tipo == 'P' ? 'CBC731' : element.tipo == 'M' ? 'FF0000' : element.stock;
            // Formatear el precio con dos decimales fijos
            const precioSinDecimales = parseFloat(element.precio).toString();

            tbody += `
                <tr>
                    <td data-label='#'>${contador}</td>
                    <td data-label='Producto'>${element.producto}</td>
                    <td data-label='Precio'>S/ ${precioSinDecimales}</td>
                    <td data-label='Fecha'>${fecha}</td>
                    <td data-label='Stock'><span class='badge rounded-pill' style='background-color: #${color} '>${stock}</td>
                    <td data-label='Estado'><span class='badge rounded-pill' style='background-color: #005478'>${estado}</td>
                    <td data-label='Acción'>
                        <a class='btn btn-sm btn-outline-success' type='button' onclick='get(${element.idproducto})'>
                            <i class="fa-regular fa-pen-to-square"></i>
                        </a>
                        <a class='btn btn-sm btn-outline-danger' onclick='change_estado(${element.idproducto},2,"${element.producto}")' title='Desactivar producto' type='button'>
                            <i class="fa-solid fa-trash"></i>
                        </a>
                    </td>
                </tr>
            `;
            contador++;
        });
        tbodyP.innerHTML = tbody;
    })
}

// Registra los platos
function registerP(){
    const txtProduct = document.querySelector("#nombre_comida");
    const txtPrecio = document.querySelector("#precio_comida");

    if (!txtProduct.value || !txtPrecio.value) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos incompletos',
            text: 'Por favor, complete los campos de la comida',
        })
        return;
    }

    const parametros = new URLSearchParams();
    parametros.append("op", "registrar");
    parametros.append("tipo", "P");
    parametros.append("producto", txtProduct.value);
    parametros.append("precio", txtPrecio.value);
    Swal.fire({
        icon: 'question',
        title: 'Confirmación',
        text: '¿Está seguro de los datos ingresados?',
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
    }).then((result) => {
        if (result.isConfirmed) {
            fetch("../controllers/producto.php", {
                method: "POST",
                body: parametros
            })
            .then(respuesta =>{
                if(respuesta.ok){
                    Swal.fire({
                        icon: 'success',
                        title: 'Plato registrado',
                        html: `El plato <b>${txtProduct.value}</b> ha sido registrado correctamente.`
                    }).then(() => {
                        location.reload();
                    });
                } else{
                    throw new Error('Error en la solicitud');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.alert({
                    icon: 'Error',
                    title: 'Error al registrar el plato',
                    text: 'Ocurrió un error al registrar el plato. Por favor intentelo nuevamente.'
                })
            });
        }
    })
}

// Registra las bebidas
function registerB(){
    const txtMarca = document.querySelector("#marca_bebida");
    const txtBebida = document.querySelector("#nombre_bebida");
    const txtPrecio = document.querySelector("#precio_bebida");
    const txtStock = document.querySelector("#stock_bebida");

    if (!txtMarca.value || !txtBebida.value || !txtPrecio.value || !txtStock.value) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos incompletos',
            text: 'Por favor, complete los campos de la bebida',
        })
        return;
    }

    const parametros = new URLSearchParams();
    parametros.append("op", "registerB");
    parametros.append("idmarca", txtMarca.value);
    parametros.append("tipo", "B");
    parametros.append("producto", txtBebida.value);
    parametros.append("precio", txtPrecio.value);
    parametros.append("stock", txtStock.value);
    Swal.fire({
        icon: 'question',
        title: 'Confirmación',
        text: '¿Está seguro de los datos ingresados?',
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
    }).then((result) => {
        if (result.isConfirmed) {
            fetch("../controllers/producto.php", {
                method: "POST",
                body: parametros
            })
            .then(respuesta =>{
                if(respuesta.ok){
                    Swal.fire({
                        icon: 'success',
                        title: 'Bebida registrada',
                        html: `La bebida <b>${txtBebida.value}</b> ha sido registrada correctamente.`
                    }).then(() => {
                        location.reload();
                    });
                } else{
                    throw new Error('Error en la solicitud');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.alert({
                    icon: 'Error',
                    title: 'Error al registrar la bebida',
                    text: 'Ocurrió un error al registrar la beboda. Por favor intentelo nuevamente.'
                })
            });
        }
    })
}

// Registra los combos
function registerC(){
    const txtProducts1 = document.querySelector('#producto_1_menu').value;
    const txtProducts2 = document.querySelector('#producto_2_menu').value;
    const txtPrecioC = document.querySelector("#precio_menu");
    const txtProducts_C = `${txtProducts1} + ${txtProducts2}`;

    if (!txtProducts1 || !txtProducts2 || !txtPrecioC) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos incompletos',
            text: 'Por favor, complete los campos del combo',
        })
        return;
    }

    const parametros = new URLSearchParams();
    parametros.append("op", "register_combo");
    parametros.append("tipo", "C");
    parametros.append("producto", txtProducts_C);
    parametros.append("precio", txtPrecioC.value);
    Swal.fire({
        icon: 'question',
        title: 'Confirmación',
        text: '¿Está seguro de los datos ingresados?',
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
    }).then((result) => {
        if (result.isConfirmed) {
            fetch("../controllers/producto.php", {
                method: "POST",
                body: parametros
            })
            .then(respuesta =>{
                if(respuesta.ok){
                    Swal.fire({
                        icon: 'success',
                        title: 'Combo registrado',
                        html: `El combo de  <b>${txtProducts_C}</b> ha sido registrado correctamente.`
                    }).then(() => {
                        location.reload();
                    });
                } else{
                    throw new Error('Error en la solicitud');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.alert({
                    icon: 'Error',
                    title: 'Error al registrar el combo',
                    text: 'Ocurrió un error al registrar el combo. Por favor intentelo nuevamente.'
                })
            });
        }
    })
}

// Lista las marcas
function listarMarcas() {
    const txtMarca = document.querySelector('#marca_bebida');
    const txtMarcaEdit = document.querySelector("#marca-editar");
    const txtMarcaSearch = document.querySelector("#marca-buscar");
    const parametrosURL = new URLSearchParams();
    parametrosURL.append("op", "listar");

    fetch('../controllers/marca.php',{
        method: 'POST',
        body: parametrosURL 
    })
    .then(respuesta => respuesta.json())
    .then(data =>{
        let options = "<option value='0'>Seleccione la marca</option>";
        data.forEach(element => {
            options += `
                <option value='${element.idmarca}'>${element.marca}</option>
            `;
        });
        txtMarca.innerHTML = options;
        txtMarcaSearch.innerHTML = options;
        txtMarcaEdit.innerHTML = options;
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Busca los productos
function search(){
    const producto = document.querySelector("#producto-buscar");
    const idmarca = document.querySelector("#marca-buscar");
    const precio = document.querySelector("#precio-buscar");
    const estado = document.querySelector("#estado-buscar");
    const tipo = document.querySelector("#tipo-buscar");
    const parametros = new URLSearchParams();
    parametros.append("op", "search");
    parametros.append("idproducto", producto.value);
    parametros.append("tipo", tipo.value);
    parametros.append("estado", estado.value);
    parametros.append("idmarca", idmarca.value);
    parametros.append("precio", precio.value);
    fetch('../controllers/producto.php', {
        method: 'POST',
        body: parametros
    })
    .then(respuesta => respuesta.json())
    .then(datos => {
        tbodyP.innerHTML = "";
        let contador = 1;
        let tbody = "";
        datos.sort((a, b) => a.tipo.localeCompare(b.tipo));
        datos.forEach(element => {
            const fechaCreate = new Date(element.fecha_creacion);
            const fecha = fechaCreate.toISOString().split('T')[0];
            const estado = element.estado == 1 ? 'Activo' : element.estado == 2 ? 'Inactivo' : element.estado;
            const stock = element.stock > 0 ? element.stock : element.tipo == 'P' ? 'Comida' : element.tipo == 'M' ? 'Combo' : element.stock;
            const color  = element.stock > 0 ? '07853C' : element.tipo == 'P' ? 'CBC731' : element.tipo == 'M' ? 'FF0000' : element.stock;
            // Formatear el precio con dos decimales fijos
            const precioSinDecimales = parseFloat(element.precio).toString();
            if (element.estado == 2) {
                accionHtml = `
                    <a class='btn btn-sm btn-outline-success' onclick='change_estado(${element.idproducto},1,"${element.producto}")' title='Habilitar producto' type='button' data-idventa='${element.idventa}'>
                        <i class="fa-solid fa-check"></i>
                    </a>`;
            } else {
                accionHtml = `
                    <a class='btn btn-sm btn-outline-danger' onclick='change_estado(${element.idproducto},2,"${element.producto}")' title='Desactivar producto' type='button'>
                        <i class="fa-solid fa-trash"></i>
                    </a>`;
            }
            tbody += `
                <tr>
                    <td data-label='#'>${contador}</td>
                    <td data-label='Producto'>${element.producto}</td>
                    <td data-label='Precio'>S/ ${precioSinDecimales}</td>
                    <td data-label='Fecha'>${fecha}</td>
                    <td data-label='Stock'><span class='badge rounded-pill' style='background-color: #${color} '>${stock}</td>
                    <td data-label='Estado'><span class='badge rounded-pill' style='background-color: #005478'>${estado}</td>
                    <td data-label='Acción'>
                        <a class='btn btn-sm btn-outline-success' type='button' onclick='get(${element.idproducto})'>
                            <i class="fa-regular fa-pen-to-square"></i>
                        </a>
                        ${accionHtml}
                    </td>
                </tr>
            `;
            contador++;
        });
        tbodyP.innerHTML = tbody;
    })
}

// Lista los platos disponibles para el combo
function list_products(){
    const txtProducts1 = document.querySelector('#producto_1_menu');
    const txtProducts2 = document.querySelector('#producto_2_menu');
    const txtProductoC1 = document.querySelector("#producto-1-editar");
    const txtProductoC2 = document.querySelector("#producto-2-editar");
    const parametros = new URLSearchParams();
    parametros.append("op", "listar");
    parametros.append("tipo", "P");
    parametros.append("estado", 1);
    fetch('../controllers/producto.php', {
        method: 'POST',
        body: parametros
    })
    .then(respuesta => respuesta.json())
    .then(datos => {
        let options = "<option value=''>Seleccione el producto</option>";
        datos.forEach(element => {
            if (element.tipo == 'P') {
                options+= `
                    <option value='${element.producto}'>${element.producto}</option>
                `;
            }
        });
        txtProducts1.innerHTML = options;
        txtProducts2.innerHTML = options;
        txtProductoC1.innerHTML = options;
        txtProductoC2.innerHTML = options;
    })
}

// Lista los platos disponibles para el combo
function listar_todo(){
    const txtProducto = document.querySelector("#producto-buscar");
    const parametros = new URLSearchParams();
    parametros.append("op", "listar");
    fetch('../controllers/producto.php', {
        method: 'POST',
        body: parametros
    })
    .then(respuesta => respuesta.json())
    .then(datos => {
        datos.sort((a, b) => a.producto.localeCompare(b.producto));
        let options = "<option value='0'>Seleccione el producto</option>";
        datos.forEach(element => {
            options+= `
                <option value='${element.idproducto}'>${element.producto}</option>
            `;
        });
        txtProducto.innerHTML = options;
    })
}

// Obtiene los datos del producto
function get(id){
    // Modales
    //Modal de bebida
    const modalB = document.querySelector("#modal-b-editar");
        // Cajas de texto
        const txtMarca = document.querySelector("#marca-editar");
        const txtBebida = document.querySelector("#bebida-editar");
        const txtPrecioB = document.querySelector("#precio-b-editar");
        const txtStock = document.querySelector("#stock-editar");
        const txtEstadoB = document.querySelector("#estado-b-editar");

    //Modal de comidas
    const modalP = document.querySelector("#modal-p-editar");
        // Cajas de texto
        const txtComida = document.querySelector("#comida-editar");
        const txtPrecioP = document.querySelector("#precio-p-editar");
        const txtEstadoP = document.querySelector("#estado-p-editar");

    //Modal de combos
    const modalC = document.querySelector("#modal-c-editar");
        // Cajas de texto
        const txtProductoC1 = document.querySelector("#texto-combo");
        const txtPrecioC = document.querySelector("#precio-c-editar");
        const txtEstadoC = document.querySelector("#estado-c-editar");

    const parametros = new URLSearchParams();
    parametros.append("op", "get");
    parametros.append("idproducto", id);
    fetch("../controllers/producto.php", {
        method: "POST",
        body: parametros
    })
    .then(respuesta => respuesta.json())
    .then(datos => {
        idProducto = datos.idproducto;

        if (datos.tipo == "P") {
            const bootstrapModal = new bootstrap.Modal(modalP);
            bootstrapModal.show();
            txtComida.value = datos.producto;
            txtPrecioP.value = datos.precio;
            txtEstadoP.value = datos.estado;
        }

        if (datos.tipo == "B") {
            const bootstrapModal = new bootstrap.Modal(modalB);
            bootstrapModal.show();
            txtMarca.value = datos.idmarca;
            txtBebida.value = datos.producto;
            txtPrecioB.value = datos.precio;
            txtStock.value = datos.stock;
            txtEstadoB.value = datos.estado;
        }

        if (datos.tipo == "M") {
            const bootstrapModal = new bootstrap.Modal(modalC);
            bootstrapModal.show();
            txtProductoC1.innerHTML = `Combo: <b>${datos.producto}</b>`;
            txtPrecioC.value = datos.precio;
            txtEstadoC.value = datos.estado;
        }

    })
}

// Editar bebida
function editar_bebida(){
    const txtMarca = document.querySelector("#marca-editar");
    const txtBebida = document.querySelector("#bebida-editar");
    const txtPrecioB = document.querySelector("#precio-b-editar");
    const txtStock = document.querySelector("#stock-editar");
    const txtEstadoB = document.querySelector("#estado-b-editar");
    if (!txtMarca.value || !txtBebida.value || !txtPrecioB.value || !txtStock.value || !txtEstadoB.value) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos incompletos',
            text: 'Por favor, complete los campos',
        });
        return;
    }
    const parametros = new URLSearchParams();
    parametros.append("op", "editar");
    parametros.append("idmarca", txtMarca.value);
    parametros.append("producto", txtBebida.value);
    parametros.append("precio", txtPrecioB.value);
    parametros.append("stock", txtStock.value);
    parametros.append("estado", txtEstadoB.value);
    parametros.append("idproducto", idProducto);
    Swal.fire({
        icon: 'question',
        title: 'Confirmación',
        text: '¿Está seguro de los datos ingresados?',
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
    }).then((result) => {
        if (result.isConfirmed) {
            fetch("../controllers/producto.php", {
                method: "POST",
                body: parametros
            })
            .then(respuesta =>{
                if(respuesta.ok){
                    Swal.fire({
                        icon: 'success',
                        title: 'Producto editado',
                        html: `El producto <b>${txtBebida.value}</b> ha sido actualizado correctamente.`
                    }).then(() => {
                        list()
                    });
                } else{
                    throw new Error('Error en la solicitud');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.alert({
                    icon: 'Error',
                    title: 'Error al actualizar el producto',
                    text: 'Ocurrió un error al actualizar el producto. Por favor intentelo nuevamente.'
                })
            });
        }
    })
}

// Editar comida
function editar_comida(){
    const txtComida = document.querySelector("#comida-editar");
    const txtPrecioP = document.querySelector("#precio-p-editar");
    const txtEstadoP = document.querySelector("#estado-p-editar");
    if (!txtComida.value || !txtPrecioP.value || !txtEstadoP.value) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos incompletos',
            text: 'Por favor, complete los campos',
        });
        return;
    }
    const parametros = new URLSearchParams();
    parametros.append("op", "editar");
    parametros.append("producto", txtComida.value);
    parametros.append("precio", txtPrecioP.value);
    parametros.append("estado", txtEstadoP.value);
    parametros.append("idproducto", idProducto);
    Swal.fire({
        icon: 'question',
        title: 'Confirmación',
        text: '¿Está seguro de los datos ingresados?',
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
    }).then((result) => {
        if (result.isConfirmed) {
            fetch("../controllers/producto.php", {
                method: "POST",
                body: parametros
            })
            .then(respuesta =>{
                if(respuesta.ok){
                    Swal.fire({
                        icon: 'success',
                        title: 'Producto editado',
                        html: `El producto <b>${txtComida.value}</b> ha sido actualizado correctamente.`
                    }).then(() => {
                        list();
                    });
                } else{
                    throw new Error('Error en la solicitud');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.alert({
                    icon: 'Error',
                    title: 'Error al actualizar el producto',
                    text: 'Ocurrió un error al actualizar el producto. Por favor intentelo nuevamente.'
                })
            });
        }
    })
}

// Editar combo
function editar_combo(){
    const txtProductoC1 = document.querySelector("#producto-1-editar").value;
    const txtProductoC2 = document.querySelector("#producto-2-editar").value;
    const txtPrecioC = document.querySelector("#precio-c-editar");
    const txtEstadoC = document.querySelector("#estado-c-editar");
    const txtProductoC = `${txtProductoC1} + ${txtProductoC2}`;
    if (!txtProductoC1 || !txtProductoC2 || !txtPrecioC.value || !txtEstadoC.value) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos incompletos',
            text: 'Por favor, seleccione los platos para el combo',
        });
        return;
    }
    const parametros = new URLSearchParams();
    parametros.append("op", "editar");
    parametros.append("producto", txtProductoC);
    parametros.append("precio", txtPrecioC.value);
    parametros.append("estado", txtEstadoC.value);
    parametros.append("idproducto", idProducto);
    Swal.fire({
        icon: 'question',
        title: 'Confirmación',
        text: '¿Está seguro de los datos ingresados?',
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
    }).then((result) => {
        if (result.isConfirmed) {
            fetch("../controllers/producto.php", {
                method: "POST",
                body: parametros
            })
            .then(respuesta =>{
                if(respuesta.ok){
                    Swal.fire({
                        icon: 'success',
                        title: 'Combo editado',
                        html: `El combo <b>${txtProductoC}</b> ha sido actualizado correctamente.`
                    }).then(() => {
                        list();
                    });
                } else{
                    throw new Error('Error en la solicitud');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.alert({
                    icon: 'Error',
                    title: 'Error al actualizar el combo',
                    text: 'Ocurrió un error al actualizar el producto. Por favor intentelo nuevamente.'
                })
            });
        }
    })
}

// Función para deshabilitar los productos
function change_estado(id,estado,producto) {
    const parametros = new URLSearchParams();
    parametros.append("op", "change_estado");
    parametros.append("estado", estado);
    parametros.append("idproducto", id);
    Swal.fire({
        icon: 'question',
        title: 'Confirmación',
        html: `¿Está seguro de cambiar el estado del producto <b>${producto}</b>?`,
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
    }).then((result) => {
        if (result.isConfirmed) {
            fetch('../controllers/producto.php', {
                method: 'POST',
                body: parametros
            })
            .then(respuesta => {
                if(respuesta.ok){
                    Swal.fire({
                        icon: 'success',
                        title: 'Producto actualizado',
                        html: `El producto <b>${producto}</b> ha sido actualizado correctamente.`
                    }).then(() => {
                        list()
                    });
                } else{
                    throw new Error('Error en la solicitud');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.alert({
                    icon: 'Error',
                    title: 'Error al actualizar el producto',
                    text: 'Ocurrió un error al actualizar el producto. Por favor intentelo nuevamente.'
                })
            });
        }
    })
}

list();
listarMarcas();
list_products();
listar_todo();
list_Platos_inactivos();

// Busca los productos
const btnSearch = document.querySelector("#buscar-producto");
btnSearch.addEventListener("click", search);

// Registrar las comidas
const btnRegistrarP = document.querySelector("#registrar-comida");
btnRegistrarP.addEventListener("click", registerP)

// Registrar las bebidas
const btnRegistrarB = document.querySelector("#registrar-bebida");
btnRegistrarB.addEventListener("click", registerB)

// Registrar los combos
const btnRegistrarC = document.querySelector("#registrar-combo");
btnRegistrarC.addEventListener("click", registerC)

// Registrar las bebidas
const btn_edit_b = document.querySelector("#editar-bebida");
btn_edit_b.addEventListener("click", editar_bebida);

// Registrar las comidas
const btn_edit_p = document.querySelector("#editar-comida");
btn_edit_p.addEventListener("click", editar_comida);

// Registrar los combos
const btn_edit_c = document.querySelector("#editar-combo");
btn_edit_c.addEventListener("click", editar_combo);

const btnRestaurar = document.querySelector("#restaurar-plato");
btnRestaurar.addEventListener("click", habilitar_platos)