<?php

    require_once 'Conexion.php';

    class Usuario extends Conexion{

        private $conexion;

        public function __construct()
        {
            $this->conexion = parent::getConexion();
        }

        public function login($usuario){
            try {
                $consulta = $this->conexion->prepare("SELECT * FROM usuario WHERE usuario = ? AND estado = 1");
                $consulta->execute(array($usuario));
                $datos = $consulta->fetch(PDO::FETCH_ASSOC);
                return $datos;
            } catch (Exception $e) {
                die($e->getMessage());
            } 
        }

    }

?>