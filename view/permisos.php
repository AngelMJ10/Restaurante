<?php
  // contiene todos los accesos/restricciones para cada user/vista
  session_start();

  // 1. ¿Que nivel de acceso tenemos? NIVELES: ADM, SPV, AST
$perfil = $_SESSION['login']['nivelacceso'];

  //  2.Debemos identificar a que vista estamos tratando de acceder (URL)
  $url = $_SERVER['REQUEST_URI'];
  $url_array = explode("/", $url);
  $vistaActiva = $url_array[count($url_array) - 1];
  
  // Permisos de acuerod al perfil
  $permisos = [
    "A" => ["producto.php","deudores.php","caja.php","ventas.php","marca.php","gastos.php","semana.php","pruebas.php"],
    "S" => ["producto.php","deudores.php","caja.php","ventas.php","marca.php","gastos.php"],
    "C" => ["producto.php","deudores.php","caja.php","ventas.php","marca.php","gastos.php"]
  ];
// BANDERA-s epusa para determinar sentidos como uninterruptop, verdadero o falso
  $autorizado = false;

  // 4.Comprobar si la vista coinicde con el perfil(nivelacceso)
  $vistasPermitidas = $permisos[$perfil];

  foreach($vistasPermitidas as $vista){
    if($vista == $vistaActiva) { $autorizado = true; }
  }

  // 5.Si no esta autorizado, bloqueamos la carga de la vista
  if(!$autorizado){
    echo "<h2>ACCESO RESTRINGIDO</h2>";
    exit();
  }

?>