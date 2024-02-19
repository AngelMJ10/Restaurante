CREATE DATABASE restaurant;
USE restaurant;

CREATE TABLE persona
(
	idpersona		SMALLINT 	AUTO_INCREMENT PRIMARY KEY,
	apellidos		VARCHAR(40)	NOT NULL,
	nombre			VARCHAR(40)	NOT NULL,
	dni			CHAR(8)		NULL,
	telefono		CHAR(9)		NOT NULL,
	direccion		VARCHAR(200)	NULL,
	estado			CHAR(1)		NOT NULL DEFAULT '1',
	fecha_creacion		DATETIME	NOT NULL DEFAULT NOW(),
	fecha_fin		DATETIME	NULL
)ENGINE = INNODB;

INSERT INTO persona(nombre,apellidos,dni,telefono,direccion)
VALUES('Marquina Jaime','Ángel Eduardo',72745028,951531166,'León de Vivero MZ V LT-22'),
('Jaime Espinoza','Consuelo',75698458,947857626,'Prolongación Grau 507'),
('Marquina Jaime','Miguel Anthony',75896487,932777928,'Pasaje la tinguiña');

SELECT * FROM persona

-----------------------------------

CREATE TABLE usuario
(
	idpersona		SMALLINT	NOT NULL,
	idusuario		SMALLINT	AUTO_INCREMENT PRIMARY KEY,
	usuario			VARCHAR(20)	NOT NULL,
	clave			VARCHAR(200)	NOT NULL,
	nivelacceso		CHAR(1)		NOT NULL DEFAULT 'A',
	estado			CHAR(1)		NOT NULL DEFAULT '1',
	fecha_creacion		DATETIME	NOT NULL DEFAULT NOW(),
	fecha_fin		DATETIME	NULL,
	CONSTRAINT fk_idpersona_fk FOREIGN KEY (idpersona) REFERENCES persona (idpersona)
)ENGINE = INNODB;

INSERT INTO usuario (idpersona,usuario,clave)
VALUES	(1,'AngelMJ','SENATI'),
	(2,'ConsueloJE','SENATI');
	
SELECT * FROM usuario;
UPDATE usuario SET
	clave = '$2y$10$WY.iP85bEYxBMkVBG0jKO.9Q97kEbofLVwJPUT1OAmsDzLXQ8Pcka';
UPDATE usuario SET
	nivelacceso = 'A' WHERE idusuario = 1;
	
------------------------------

CREATE TABLE deudores
(
	idpersona		SMALLINT	NOT NULL,
	usuario_creador		SMALLINT	NOT NULL,
	iddeudor		SMALLINT	AUTO_INCREMENT PRIMARY KEY,
	aporte			DECIMAL(6,2)	NULL,
	estado			CHAR(1)		NOT NULL DEFAULT '1',
	fecha_creacion		DATETIME	NOT NULL DEFAULT NOW(),
	fecha_update		DATETIME	NULL DEFAULT NOW(),
	CONSTRAINT fk_idpersona_d FOREIGN KEY (idpersona) REFERENCES persona (idpersona),
	CONSTRAINT fk_idusuario_d FOREIGN KEY (usuario_creador) REFERENCES usuario (idusuario)
) ENGINE = INNODB;

SELECT * FROM deudores;
SELECT * FROM persona;

------------------------------------

CREATE TABLE marcas
(
	idmarca			SMALLINT 	AUTO_INCREMENT PRIMARY KEY,
	marca			VARCHAR(40)	NOT NULL,
	estado			CHAR(1)		NOT NULL DEFAULT '1',
	fecha_creacion		DATETIME	NOT NULL DEFAULT NOW(),
	fecha_fin		DATETIME	NULL
)ENGINE = INNODB;

INSERT INTO marcas(marca) 
VALUE("Inka Kola"),("Cerveza Cristal"),("Cifrut");

SELECT * FROM marcas

-----------------------------------

CREATE TABLE producto
(
	idproducto		SMALLINT	AUTO_INCREMENT PRIMARY KEY,
	idmarca			SMALLINT	NULL,
	producto		VARCHAR(50)	NOT NULL,
	tipo			CHAR(1)		NOT NULL, -- P(Plato) y B(Bebida)
	precio			DECIMAL(6,2)	NOT NULL,
	stock			INT 		NULL,
	estado			CHAR(1)		NOT NULL DEFAULT '1',
	fecha_creacion		DATETIME	NOT NULL DEFAULT NOW(),
	fecha_fin		DATETIME	NULL,
	CONSTRAINT fk_idmarca_b FOREIGN KEY (idmarca) REFERENCES marcas (idmarca)
)ENGINE = INNODB;
-- Insertando Bebidas
INSERT INTO producto(idmarca,producto,tipo,precio,stock)
VALUES(1,'Inka kola 1/2 litro','B',2,9),(2,'Cerveza Cristal 650 ml','B',6,12),
	(3,'Cifrut 1/2 litro','B',1.50,9);
	
UPDATE producto SET estado = 0 WHERE tipo = 'M' AND tipo = 'P' 
6
SELECT * FROM producto WHERE tipo = 'P';
SELECT * FROM producto WHERE tipo = 'M';
SELECT * FROM producto WHERE idmarca = 1;
SELECT * FROM producto WHERE idproducto = 6 OR idproducto = 5;


-- Insertando Platos
INSERT INTO producto(producto,precio,tipo)
VALUES	('Sopa Seca con Carapulcra','20','P'),
	('Chilcano','7','P'),
	('Ceviche con chicharron','12','P'),
	('Ceviche','10','P');

----------------------------------------

CREATE TABLE pedido
(
	idpedido	SMALLINT	AUTO_INCREMENT PRIMARY KEY,
	idusuario	SMALLINT	NOT NULL,
	fecha_creacion	DATETIME 	NOT NULL DEFAULT NOW(),
	CONSTRAINT fk_idusuario_p FOREIGN KEY (idusuario) REFERENCES usuario (idusuario)
)ENGINE = INNODB;

INSERT INTO pedido(idusuario) VALUES(1);
SELECT * FROM pedido

----------------------------

CREATE TABLE detalle_pedido
(
	idDetallePedido		SMALLINT 	AUTO_INCREMENT PRIMARY KEY,
	idpedido		SMALLINT	NOT NULL,
	idproducto		SMALLINT	NOT NULL,
	cantidad		INT 		NOT NULL,
	estado			CHAR(1)		NOT NULL DEFAULT(1),
	fecha_creacion		DATETIME 	NOT NULL DEFAULT NOW(),
	CONSTRAINT fk_idpedido_dp FOREIGN KEY (idpedido) REFERENCES pedido(idpedido),
	CONSTRAINT fk_idproducto_dp FOREIGN KEY (idproducto) REFERENCES producto(idproducto)
)ENGINE = INNODB;

INSERT INTO detalle_pedido(idpedido,idproducto,cantidad)
VALUES(1,1,2),(1,4,2);
SELECT * FROM detalle_pedido WHERE idpedido = 1;
SELECT * FROM producto WHERE idproducto = 4

---------------------------
CREATE TABLE venta
(
	idventa			SMALLINT	AUTO_INCREMENT PRIMARY KEY,
	idpedido		SMALLINT	NOT NULL,
	total			DECIMAL(6,2)	NOT NULL,
	metodo			CHAR(1)		NOT NULL,  -- 1 es efectivo, 2 yape, 3 plin
	tipoventa		CHAR(1)		NOT NULL,  -- N es normal y D es fiado
	comentario		VARCHAR(80)	NULL,
	idusuario		SMALLINT	NOT NULL,
	estado			CHAR 		NOT NULL DEFAULT(1),  -- 1 es venta normal, 2 es venta con deuda(osea que aún no ha sido pagado) y 3 es venta anulada
	fecha_creacion		DATETIME 	NOT NULL DEFAULT NOW(),
	CONSTRAINT fk_idpedido_v FOREIGN KEY (idpedido) REFERENCES pedido(idpedido),
	CONSTRAINT fk_idproducto_v FOREIGN KEY (idusuario) REFERENCES usuario(idusuario)
)
INSERT INTO venta(idpedido,total,idusuario)
VALUES(1,44,1);
SELECT * FROM venta

--------------------
CREATE TABLE deuda

(
	iddeudor		SMALLINT 	NOT NULL,
	iddeuda			SMALLINT 	AUTO_INCREMENT PRIMARY KEY,
	idventa			SMALLINT 	NOT NULL,
	comentario		VARCHAR(200)	NULL,
	estado			CHAR(1)		NOT NULL DEFAULT'1',  -- 1 es no pagado y 2 es pagado
	fecha_creacion		DATETIME	NOT NULL DEFAULT NOW(),
	fecha_update		DATETIME	NULL,
	CONSTRAINT fk_iddeudor_d FOREIGN KEY (iddeudor) REFERENCES deudores (iddeudor)
)

INSERT INTO deuda (iddeudor,idventa,comentario)
VALUES(2,65,"Pagará el 30 de octubre");

SELECT * FROM deuda WHERE iddeudor = 11
SELECT * FROM deudores
UPDATE deudores SET estado = 2 WHERE iddeudor = 10
SELECT * FROM venta WHERE estado = 1

--------------------------------

CREATE TABLE semana
(
    idsemana        SMALLINT    AUTO_INCREMENT PRIMARY KEY,
    fecha_inicio    DATE        NOT NULL,
    fecha_fin       DATE        NOT NULL,
    comentario      VARCHAR(200) NULL,
    estado          CHAR(1)     NOT NULL DEFAULT '1', -- 1 es activo y 2 es inactivo
    fecha_creacion  DATETIME    NOT NULL DEFAULT NOW(),
    fecha_update    DATETIME    NULL
)ENGINE = INNODB;

INSERT INTO semana(fecha_inicio,fecha_fin)
VALUES('2023-11-13','2023-11-25');

SELECT * FROM semana

-----------------------------

CREATE TABLE gastos
(
	idgasto 	SMALLINT 	AUTO_INCREMENT PRIMARY KEY,
	idsemana	SMALLINT	NOT NULL,
	gasto		VARCHAR(80)	NOT NULL,
	tipo		VARCHAR(40)	NOT NULL,
	precio		DECIMAL(6,2)	NOT NULL,
	estado		CHAR(1)		NOT NULL DEFAULT '1',
	fecha_creacion 	DATETIME	NOT NULL DEFAULT NOW(),
	fecha_update	DATETIME	NULL,
	CONSTRAINT fk_idsemana_g FOREIGN KEY (idsemana) REFERENCES semana (idsemana)
)ENGINE = INNODB;

SELECT * FROM gastos WHERE idsemana = 1
INSERT INTO gastos(idsemana,gasto,tipo,precio)VALUES
(1,'','',),

-------------------------------

CREATE TABLE pagos
(
	idpago			SMALLINT 	AUTO_INCREMENT PRIMARY KEY,
	iddeudor		SMALLINT 	NOT NULL,
	pago			DECIMAL(6,2)	NOT NULL,
	estado          	CHAR(1)     	NOT NULL DEFAULT '1', -- 1 es activo y 2 es inactivo
	comentario		VARCHAR(200)	NULL,
	fecha_creacion  	DATETIME    NOT NULL DEFAULT NOW(),
	fecha_update    	DATETIME    	NULL,
	CONSTRAINT fk_iddeudores_pg FOREIGN KEY(iddeudor) REFERENCES deudores (iddeudor)
)ENGINE = INNODB;

INSERT INTO pagos(iddeudor,pago)
VALUES(11,20);
SELECT * FROM pagos WHERE iddeudor = 10;