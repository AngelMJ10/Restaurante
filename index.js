document.addEventListener("DOMContentLoaded", () => {
    const botonIniciarSesion = document.querySelector("#acceder");
    const textPassword = document.querySelector("#clave");
    const usuario = document.querySelector("#email");

    function validarDatos(){

        const parametros = new URLSearchParams();
        parametros.append("op", "login")
        parametros.append("usuario", usuario.value)
        parametros.append("clave", textPassword.value);

        fetch(`./controller/usuario.php`, {
        method: 'POST',
        body: parametros
        })
        .then(respuesta => respuesta.json())
        .then(datos => {
            if (!datos.status){
                Swal.fire({
                    icon: 'warning',
                    title: 'Error en los campos',
                    text: (datos.mensaje)
                })
                usuario.focus();
            }else{
                Swal.fire({
                    icon: 'success',
                    title: 'Sesión Iniciada',
                    text: `Bienvenido ${datos.usuario}`
                }).then(() => {
                    window.location.href = './view/';
                });
            }
        })
        .catch(error => {
            console.log(error);
        });
    }

    textPassword.addEventListener("keypress", (evt) => {
        if (evt.charCode == 13) validarDatos();
    });

    botonIniciarSesion.addEventListener("click", validarDatos);
    });