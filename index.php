<?php
session_start();
if (isset($_SESSION['login'])){
  if (isset($_SESSION['login']['status']) && $_SESSION['login']['status']) {
    header('Location:./view/');
  }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Bootstrap 5.2 -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
    <title>Inicio de Sesion</title>
</head>
<style>
    .gradient-box {
    width: 100%;
    height: 100vh;
    background: linear-gradient(to bottom, #005478, #ced4da);
    }
    .logo{
        width: 100%;
        height: 100%;
        position: center;
    }
    .form-control {
    text-align: center;
    }
    
</style>
<body class="gradient-box">
    <br>
    <br>
    
    <div class="container col-xl-10 col-xxl-8 px-4 py-5 mt-5">
        <div class="card">
            <div class="card-body">
                <div class="row align-items-center g-lg-5 py-5">
                <div class="col-lg-7 text-center text-lg-start">
                    <h1 class="display-4 fw-bold lh-1 text-body-emphasis mb-3 text-center align-items-center">Inicio de Sesión</h1>
                    <p class="col-lg-12 fs-4 text-center">Por favor complete los siguientes datos para Iniciar Sesión:</p>
                    <img src="./img/logo1.jpeg" class="logo ml-5" alt="">
                </div>
                <div class="col-md-10 mx-auto col-lg-5">
                    <form class="p-4 p-md-5 border rounded-3 bg-body-tertiary" autocomplete="off">       
                    <div class="form-floating mb-3">
                        <input type="email" class="form-control" id="email" placeholder="vamas@gmail.com">
                        <label class="text-center form-label" for="email">Escriba su nombre de usuario</label>
                    </div>  
                    <div class="form-floating mb-3">
                        <input type="password" class="form-control" id="clave" placeholder="***">
                        <label class="text-center form-label" for="clave">Escriba su contraseña</label>
                    </div>        
                    <button class="w-100 btn btn-lg btn-primary mt-2" id="acceder" type="button">Iniciar sesión</button>
                    <h6 class="text-center mt-3">O</h6>
                    <a class="w-100 btn btn-lg btn-warning" id="registrar" href="../Vamas/registrar.php" type="button">Registrarme</a>
                    
                    <hr class="my-4">
                    <h6 class="text-body-secondary text-center">Permisos reservados Vamas 2023</h6>
                    </form>
                </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="index.js">
    </script>

</body>
</html>