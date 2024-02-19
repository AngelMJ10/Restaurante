<?php

    session_start();

    $_SESSION["login"] = [];
    require_once '../model/Usuario.php';

    if (isset($_POST['op'])) {
        
        $usuario = new Usuario();

        if ($_POST['op'] == 'login') {
        
            // Buscar al usuario a través de su nombre
            $datoObtenido = $usuario->login($_POST['usuario']);

            // Arreglo que contiene datos de login
            $resultado = [
                "status" => false,
                "idusuario" => "",
                "usuario" => "",
                "nivelacceso" => "",
                "mensaje" => ""
            ];

            if ($datoObtenido) {
              // Encontramos el registro
                $claveEncriptada = $datoObtenido['clave'];
                if (password_verify($_POST['clave'], $claveEncriptada)) {
                // Clave correcta
                $resultado["status"] = true;
                $resultado['idusuario'] = $datoObtenido['idusuario'];
                $resultado["usuario"] = $datoObtenido["usuario"];
                $resultado["nivelacceso"] = $datoObtenido["nivelacceso"];
                $resultado["idusuario"] = $datoObtenido["idusuario"];
                
                $_SESSION['login'] = true;
                $_SESSION['idusuario'] = $datoObtenido['idusuario'];
                $_SESSION['usuario'] = $datoObtenido['usuario'];
                $_SESSION['nivelacceso'] = $datoObtenido['nivelacceso'];
            } else {
            // Clave incorrecta
            $resultado["mensaje"] = "Contraseña incorrecta";
            }
            } else {
              // Usuario no encontrado
                $resultado["mensaje"] = "No se encuentra el usuario";
            }

            // Actualizando la información en la variable de sesión
            $_SESSION["login"] = $resultado;

            // Enviando información de la sesión a la vista
            echo json_encode($resultado);
            }

    }

    if (isset($_GET['op']) == 'close-session'){
        session_destroy();
        session_unset();
        header("location:../");
    }

?>