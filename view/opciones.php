<?php

// Este archivo "invocará" desde el index (Dashboard) por lo tanto
// ya no es neceario session_start()

// Paso 1. ¿Cúal es nuestro nivel de acceso?
$permiso = $_SESSION['login']['nivelacceso'];

//2. Cada perfil tendrá disponible algunas opciones
$opciones = [];

switch ($permiso) {
  case "A":
    $opciones = [
      ["menu" => "Marcas", "url" => "index.php?view=marca.php"],
      ["menu" => "Gastos", "url" => "index.php?view=gastos.php"],
      ["menu" => "Productos", "url" => "index.php?view=producto.php"],
      ["menu" => "Deudores", "url" => "index.php?view=deudores.php"],
      ["menu" => "Caja", "url" => "index.php?view=caja.php"],
      ["menu" => "Ventas", "url" => "index.php?view=ventas.php"],
      ["menu" => "Semana", "url" => "index.php?view=semana.php"],
      ["menu" => "Pruebas", "url" => "index.php?view=pruebas.php"]
    ];
  break;
  
  case "S":
    $opciones = [
      ["menu" => "Marcas", "url" => "index.php?view=marca.php"],
      ["menu" => "Productos", "url" => "index.php?view=plato.php"],
      ["menu" => "Deudores", "url" => "index.php?view=deudores.php"],
      ["menu" => "Caja", "url" => "index.php?view=caja.php"],
      ["menu" => "Ventas", "url" => "index.php?view=ventas.php"]
    ];
  break;

  case "C":
    $opciones = [
      ["menu" => "Marcas", "url" => "index.php?view=marca.php"],
      ["menu" => "Productos", "url" => "index.php?view=plato.php"],
      ["menu" => "Deudores", "url" => "index.php?view=deudores.php"],
      ["menu" => "Caja", "url" => "index.php?view=caja.php"],
      ["menu" => "Ventas", "url" => "index.php?view=ventas.php"]
    ];
  break;
}

// Paso 3. Ahora redenrizamos a la vista(SIDEBAR) las opciones que 
// corresponde a cada perfil
foreach ($opciones as $item) {
  echo "
    <li class='nav-item'>
      <a href='{$item['url']}' class='nav-link'>
        <i class='fas fa-fw fa-chart-area'></i>
        <span>{$item['menu']}</span>
      </a>
    </li>";
}

?>