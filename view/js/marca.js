const tableM = document.querySelector("#tabla-marcas");
const tbodyM = tableM.querySelector("tbody");
let idmarca = 0;

function list(){
    const parametros = new URLSearchParams();
    parametros.append("op", "listar");
    fetch("../controllers/marca.php", {
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
            const estado = element.estado == 1 ? 'Activo' : element.estado == 0 ? 'Inactivo' : element.estado;
            const color  = element.estado == 1 ? '005478' : element.estado == 0 ? 'CBC731' : element.stock;
            tbody += `
                <tr>
                    <td data-label='#'>${contador}</td>
                    <td data-label='Nombre'>${element.marca}</td>
                    <td data-label='Nombre'>${fecha}</td>
                    <td data-label='Estado'><span class='badge rounded-pill' style='background-color: #${color} '>${estado}</td>
                    <td data-label='Acción'>
                        <a class='btn btn-sm btn-outline-success' onclick='obtener(${element.idmarca})' type='button'>
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

function registrar() {
    const txtMarca = document.querySelector("#marca");

    if (!txtMarca.value) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos incompletos',
            text: 'Por favor, completa todos los campos.',
        });
        return;
    }

    const parametros = new URLSearchParams();
    parametros.append("op", "registrar");
    parametros.append("marca", txtMarca.value);

    Swal.fire({
        icon: 'question',
        title: 'Confirmación',
        text: '¿Está seguro de los datos ingresados?',
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
    })
    .then(result => { // Marca la función como async aquí
        if (result.isConfirmed) {
            fetch("../controllers/marca.php", {
                method: 'POST',
                body: parametros
            })
            .then(respuesta => {
                if (respuesta.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Marca registrada',
                        html: `Se ha registrado una nueva marca <b>${txtMarca.value}</b>`
                    })
                    list();
                    return;
                }
            })
        }
    });
}

function obtener(id){
    const txtMarca = document.querySelector("#marca-editar")
    const txtEstado = document.querySelector("#estado-editar")
    const modal = document.querySelector("#modal-editar");
    const parametros = new URLSearchParams();
    parametros.append("op", "obtener");
    parametros.append("idmarca", id);
    fetch("../controllers/marca.php", {
        method: "POST",
        body: parametros
    })
    .then(respuesta => respuesta.json())
    .then(datos => {
        const bootstrapModal = new bootstrap.Modal(modal);
        bootstrapModal.show();
        txtMarca.value = datos.marca;
        txtEstado.value = datos.estado;
        idmarca = datos.idmarca;
    })
}

function editar() {
    const txtMarca = document.querySelector("#marca-editar");
    const txtEstado = document.querySelector("#estado-editar");

    if (!txtMarca.value) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos incompletos',
            text: 'Por favor, completa todos los campos.',
        });
        return;
    }

    const parametros = new URLSearchParams();
    parametros.append("op", "editar");
    parametros.append("marca", txtMarca.value);
    parametros.append("estado", txtEstado.value);
    parametros.append("idmarca", idmarca);

    Swal.fire({
        icon: 'question',
        title: 'Confirmación',
        text: '¿Está seguro de los datos ingresados?',
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
    })
    .then(result => { // Marca la función como async aquí
        if (result.isConfirmed) {
            fetch("../controllers/marca.php", {
                method: 'POST',
                body: parametros
            })
            .then(respuesta => {
                if (respuesta.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Marca registrada',
                        html: `Se ha actualizado la marca <b>${txtMarca.value}</b>`
                    })
                    list();
                    return;
                }
            })
        }
    });
}

list();

const btnRegistrar = document.querySelector("#registrar-marca");
btnRegistrar.addEventListener("click", registrar);

const btnEditar = document.querySelector("#editar-marca");
btnEditar.addEventListener("click", editar);