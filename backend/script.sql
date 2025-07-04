CREATE TABLE IF NOT EXISTS usuario (
  id SERIAL PRIMARY KEY,
  rut VARCHAR(10) UNIQUE NOT NULL,
  nombre VARCHAR(50) NOT NULL,
  p_apellido VARCHAR(50) NOT NULL,
  s_apellido VARCHAR(50),
  contraseña VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS encargados (
  id SERIAL PRIMARY KEY,
  rut VARCHAR(12) UNIQUE NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  p_apellido VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  telefono VARCHAR(30),
  password VARCHAR(255) NOT NULL,
  empresa VARCHAR(100),
  region VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cuadrilla (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  id_encargado INTEGER REFERENCES encargados(id)
);

CREATE TABLE cosechador (
  id SERIAL PRIMARY KEY,
  rut VARCHAR(10) UNIQUE NOT NULL,
  nombre VARCHAR(50) NOT NULL,
  p_apellido VARCHAR(50) NOT NULL,
  s_apellido VARCHAR(50),
  id_cuadrilla INTEGER REFERENCES cuadrilla(id)
);

CREATE TABLE tipo_cosecha (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE,
  descripcion TEXT,
  precio_por_capacho INTEGER NOT NULL
);

CREATE TABLE cosecha (
  id SERIAL PRIMARY KEY,
  id_cuadrilla INTEGER NOT NULL REFERENCES cuadrilla(id),
  id_tipo_cosecha INTEGER NOT NULL REFERENCES tipo_cosecha(id),
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE,
  estado VARCHAR(20) DEFAULT 'activa' CHECK (estado IN ('activa', 'completada', 'cancelada'))
  CONSTRAINT valid_date_range CHECK (
    fecha_fin IS NULL OR fecha_fin >= fecha_inicio
  )
);

CREATE TABLE registro_cosecha(
  id SERIAL PRIMARY KEY,
  id_cosecha INTEGER NOT NULL REFERENCES cosecha(id),
  id_cosechador INTEGER NOT NULL REFERENCES cosechador(id),
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  cantidad_capachos INTEGER NOT NULL DEFAULT 0
);

-- Usuarios
INSERT INTO usuario (rut, nombre, p_apellido, s_apellido, contraseña) VALUES
('12345678-9', 'Juan', 'Pérez', 'González', 'juan123'),
('98765432-1', 'María', 'López', 'Martínez', 'maria456');

-- Encargados
INSERT INTO encargados (rut, nombre, p_apellido, email, telefono, password, empresa, region) VALUES
('11222333-4', 'Carlos', 'Mendoza', 'carlos.mendoza@empresa.com', '+56912345678', '$2a$10$xJwL5', 'Agrícola del Valle', 'Valparaíso'),
('22333444-5', 'Ana', 'Silva', 'ana.silva@fruticola.com', '+56923456789', '$2a$10$yKpM6', 'Frutícola Central', 'O''Higgins'),
('33444555-6', 'Pedro', 'Rojas', 'pedro.rojas@huertos.cl', '+56934567890', '$2a$10$zLqN7', 'Huertos del Sur', 'Maule'),
('44555666-7', 'Lucía', 'Vargas', 'lucia.vargas@agropec.com', '+56945678901', '$2a$10$aMbO8', 'Agropecuaria Norte', 'Coquimbo'),
('55666777-8', 'Roberto', 'Fuentes', 'roberto.fuentes@export.cl', '+56956789012', '$2a$10$bNcP9', 'Exportadora Frutícola', 'Metropolitana');

-- Cuadrillas
INSERT INTO cuadrilla (nombre, id_encargado) VALUES
('Cuadrilla Norte', 1),
('Cuadrilla Sur', 2),
('Cuadrilla Este', 3),
('Cuadrilla Oeste', 4),
('Cuadrilla Central', 5),
('Cuadrilla Especial', 1),
('Cuadrilla Rápida', 3),
('Cuadrilla Experta', 4);

-- Cosechadores (50 registros)
INSERT INTO cosechador (rut, nombre, p_apellido, s_apellido, id_cuadrilla) VALUES
('1111111-1', 'Manuel',  'García', 'Pérez', 1),
('2222222-2', 'José', 'Martínez', 'López', 1),
('3333333-3', 'Francisco', 'Rodríguez', 'Gómez', 2),
('4444444-4', 'Antonio', 'Hernández', 'Sánchez', 2),
('5555555-5', 'David', 'González', 'Fernández', 3),
('6666666-6', 'Javier', 'Díaz', 'Ramírez', 3),
('7777777-7', 'Miguel', 'Moreno', 'Álvarez', 4),
('8888888-8', 'Daniel', 'Muñoz', 'Romero', 4),
('9999999-9', 'Alejandro', 'Jiménez', 'Navarro', 5),
('1010101-0', 'Rafael', 'Ruiz', 'Torres', 5),
('1212121-2', 'Juan', 'Serrano', 'Domínguez', 6),
('1313131-3', 'Luis', 'Ramírez', 'Vázquez', 6),
('1414141-4', 'Alberto', 'Blanco', 'Molina', 7),
('1515151-5', 'Jorge', 'Suárez', 'Morales', 7),
('1616161-6', 'Pablo', 'Ortega', 'Delgado', 8),
('1717171-7', 'Fernando', 'Castillo', 'Castro', 8),
('1818181-8', 'Ricardo', 'Santos', 'Ortiz', 1),
('1919191-9', 'Eduardo', 'Guerrero', 'Rubio', 2),
('2020202-0', 'Mario', 'Lorenzo', 'Méndez', 3),
('2121212-1', 'Sergio', 'Sanz', 'Iglesias', 4),
('2323232-3', 'Alfonso', 'Medina', 'Cortés', 5),
('2424242-4', 'Joaquín', 'Garrido', 'Giménez', 6),
('2525252-5', 'Víctor', 'Calvo', 'Herrera', 7),
('2626262-6', 'Raúl', 'León', 'Reyes', 8),
('2727272-7', 'Adrián', 'Gallego', 'Flores', 1),
('2828282-8', 'Iván', 'Márquez', 'Peña', 2),
('2929292-9', 'Óscar', 'Cabrera', 'Crespo', 3),
('3030303-0', 'Rubén', 'Pascual', 'Campos', 4),
('3131313-1', 'Enrique', 'Vega', 'Soto', 5),
('3232323-2', 'Felipe', 'Fuentes', 'Guillén', 6),
('3434343-4', 'Julián', 'Rivas', 'Pardo', 7),
('3535353-5', 'Diego', 'Sáez', 'Bravo', 8),
('3636363-6', 'Gabriel', 'Aguilar', 'Roldán', 1),
('3737373-7', 'Salvador', 'Benítez', 'Gallardo', 2),
('3838383-8', 'Emilio', 'Vidal', 'Valero', 3),
('3939393-9', 'Marcos', 'Moya', 'Paredes', 4),
('4040404-0', 'Ignacio', 'Soler', 'Arias', 5),
('4141414-1', 'Héctor', 'Román', 'Carmona', 6),
('4242424-2', 'Agustín', 'Pastor', 'Varela', 7),
('4343434-3', 'Simón', 'Velasco', 'Redondo', 8),
('4545454-5', 'Alfredo', 'Santiago', 'Lozano', 1),
('4646464-6', 'Gregorio', 'Duran', 'Márquez', 2),
('4747474-7', 'Fermín', 'Herrero', 'Marcos', 3),
('4848484-8', 'Bernardo', 'Montero', 'Ríos', 4),
('4949494-9', 'César', 'Gómez', 'Sierra', 5),
('5050505-0', 'Arturo', 'Franco', 'Caballero', 6),
('5151515-1', 'Feliciano', 'Merino', 'Rey', 7),
('5252525-2', 'Eugenio', 'Palacios', 'Vicente', 8),
('5353535-3', 'Nicolás', 'Santamaría', 'Pozo', 1),
('5454545-4', 'Jacinto', 'Rico', 'Luna', 2);

-- Tipos de Cosecha
INSERT INTO tipo_cosecha (nombre, descripcion, precio_por_capacho) VALUES
('Uva de Mesa', 'Cosecha de uva de mesa para exportación', 1500),
('Manzanas', 'Cosecha de manzanas variedad Fuji y Gala', 1200),
('Naranjas', 'Cosecha de naranjas para jugo y exportación', 1000),
('Paltas', 'Cosecha de paltas Hass', 1800),
('Arándanos', 'Cosecha de arándanos para exportación', 2000);

-- Cosechas
INSERT INTO cosecha (id_cuadrilla, id_tipo_cosecha, fecha_inicio, fecha_fin, estado) VALUES
(1, 1, '2023-03-01', '2023-03-15', 'completada'),
(2, 2, '2023-03-10', '2023-03-25', 'completada'),
(3, 3, '2023-04-01', '2023-04-20', 'completada'),
(4, 4, '2023-04-15', NULL, 'activa'),
(5, 5, '2023-05-01', NULL, 'activa'),
(6, 1, '2023-05-10', NULL, 'activa'),
(7, 2, '2023-05-15', NULL, 'activa'),
(8, 3, '2023-06-01', NULL, 'activa');

-- Registros de Cosecha (ejemplo para 10 cosechadores)
-- Cosechador 1 (7 días)
INSERT INTO registro_cosecha (id_cosecha, id_cosechador, fecha, cantidad_capachos) VALUES
(1, 1, '2023-03-01', 15),
(1, 1, '2023-03-02', 18),
(1, 1, '2023-03-03', 20),
(1, 1, '2023-03-04', 16),
(1, 1, '2023-03-05', 19),
(1, 1, '2023-03-06', 17),
(1, 1, '2023-03-07', 21);

-- Cosechador 2 (7 días)
INSERT INTO registro_cosecha (id_cosecha, id_cosechador, fecha, cantidad_capachos) VALUES
(1, 2, '2023-03-01', 14),
(1, 2, '2023-03-02', 16),
(1, 2, '2023-03-03', 18),
(1, 2, '2023-03-04', 15),
(1, 2, '2023-03-05', 17),
(1, 2, '2023-03-06', 19),
(1, 2, '2023-03-07', 20);

-- Cosechador 3 (7 días)
INSERT INTO registro_cosecha (id_cosecha, id_cosechador, fecha, cantidad_capachos) VALUES
(2, 3, '2023-03-10', 12),
(2, 3, '2023-03-11', 14),
(2, 3, '2023-03-12', 16),
(2, 3, '2023-03-13', 13),
(2, 3, '2023-03-14', 15),
(2, 3, '2023-03-15', 17),
(2, 3, '2023-03-16', 18);

-- Cosechador 4 (7 días)
INSERT INTO registro_cosecha (id_cosecha, id_cosechador, fecha, cantidad_capachos) VALUES
(2, 4, '2023-03-10', 11),
(2, 4, '2023-03-11', 13),
(2, 4, '2023-03-12', 15),
(2, 4, '2023-03-13', 12),
(2, 4, '2023-03-14', 14),
(2, 4, '2023-03-15', 16),
(2, 4, '2023-03-16', 17);

-- Cosechador 5 (7 días)
INSERT INTO registro_cosecha (id_cosecha, id_cosechador, fecha, cantidad_capachos) VALUES
(3, 5, '2023-04-01', 10),
(3, 5, '2023-04-02', 12),
(3, 5, '2023-04-03', 14),
(3, 5, '2023-04-04', 11),
(3, 5, '2023-04-05', 13),
(3, 5, '2023-04-06', 15),
(3, 5, '2023-04-07', 16);

-- Cosechador 6 (7 días)
INSERT INTO registro_cosecha (id_cosecha, id_cosechador, fecha, cantidad_capachos) VALUES
(4, 6, '2023-04-15', 8),
(4, 6, '2023-04-16', 10),
(4, 6, '2023-04-17', 12),
(4, 6, '2023-04-18', 9),
(4, 6, '2023-04-19', 11),
(4, 6, '2023-04-20', 13),
(4, 6, '2023-04-21', 14);

-- Cosechador 7 (7 días)
INSERT INTO registro_cosecha (id_cosecha, id_cosechador, fecha, cantidad_capachos) VALUES
(5, 7, '2023-05-01', 20),
(5, 7, '2023-05-02', 22),
(5, 7, '2023-05-03', 24),
(5, 7, '2023-05-04', 21),
(5, 7, '2023-05-05', 23),
(5, 7, '2023-05-06', 25),
(5, 7, '2023-05-07', 26);

-- Cosechador 8 (7 días)
INSERT INTO registro_cosecha (id_cosecha, id_cosechador, fecha, cantidad_capachos) VALUES
(6, 8, '2023-05-10', 16),
(6, 8, '2023-05-11', 18),
(6, 8, '2023-05-12', 20),
(6, 8, '2023-05-13', 17),
(6, 8, '2023-05-14', 19),
(6, 8, '2023-05-15', 21),
(6, 8, '2023-05-16', 22);

-- Cosechador 9 (7 días)
INSERT INTO registro_cosecha (id_cosecha, id_cosechador, fecha, cantidad_capachos) VALUES
(7, 9, '2023-05-15', 14),
(7, 9, '2023-05-16', 16),
(7, 9, '2023-05-17', 18),
(7, 9, '2023-05-18', 15),
(7, 9, '2023-05-19', 17),
(7, 9, '2023-05-20', 19),
(7, 9, '2023-05-21', 20);

-- Cosechador 10 (7 días)
INSERT INTO registro_cosecha (id_cosecha, id_cosechador, fecha, cantidad_capachos) VALUES
(8, 10, '2023-06-01', 12),
(8, 10, '2023-06-02', 14),
(8, 10, '2023-06-03', 16),
(8, 10, '2023-06-04', 13),
(8, 10, '2023-06-05', 15),
(8, 10, '2023-06-06', 17),
(8, 10, '2023-06-07', 18);


-- Cosechador 11 (7 días - Cuadrilla 6)
INSERT INTO registro_cosecha (id_cosecha, id_cosechador, fecha, cantidad_capachos) VALUES
(6, 11, '2023-05-10', 15),
(6, 11, '2023-05-11', 17),
(6, 11, '2023-05-12', 19),
(6, 11, '2023-05-13', 16),
(6, 11, '2023-05-14', 18),
(6, 11, '2023-05-15', 20),
(6, 11, '2023-05-16', 21);

-- Cosechador 12 (7 días - Cuadrilla 6)
INSERT INTO registro_cosecha (id_cosecha, id_cosechador, fecha, cantidad_capachos) VALUES
(6, 12, '2023-05-10', 14),
(6, 12, '2023-05-11', 16),
(6, 12, '2023-05-12', 18),
(6, 12, '2023-05-13', 15),
(6, 12, '2023-05-14', 17),
(6, 12, '2023-05-15', 19),
(6, 12, '2023-05-16', 20);

-- Cosechador 13 (7 días - Cuadrilla 7)
INSERT INTO registro_cosecha (id_cosecha, id_cosechador, fecha, cantidad_capachos) VALUES
(7, 13, '2023-05-15', 13),
(7, 13, '2023-05-16', 15),
(7, 13, '2023-05-17', 17),
(7, 13, '2023-05-18', 14),
(7, 13, '2023-05-19', 16),
(7, 13, '2023-05-20', 18),
(7, 13, '2023-05-21', 19);

-- Cosechador 14 (7 días - Cuadrilla 7)
INSERT INTO registro_cosecha (id_cosecha, id_cosechador, fecha, cantidad_capachos) VALUES
(7, 14, '2023-05-15', 12),
(7, 14, '2023-05-16', 14),
(7, 14, '2023-05-17', 16),
(7, 14, '2023-05-18', 13),
(7, 14, '2023-05-19', 15),
(7, 14, '2023-05-20', 17),
(7, 14, '2023-05-21', 18);

-- Cosechador 15 (7 días - Cuadrilla 8)
INSERT INTO registro_cosecha (id_cosecha, id_cosechador, fecha, cantidad_capachos) VALUES
(8, 15, '2023-06-01', 11),
(8, 15, '2023-06-02', 13),
(8, 15, '2023-06-03', 15),
(8, 15, '2023-06-04', 12),
(8, 15, '2023-06-05', 14),
(8, 15, '2023-06-06', 16),
(8, 15, '2023-06-07', 17);

-- Cosechador 16 (7 días - Cuadrilla 8)
INSERT INTO registro_cosecha (id_cosecha, id_cosechador, fecha, cantidad_capachos) VALUES
(8, 16, '2023-06-01', 10),
(8, 16, '2023-06-02', 12),
(8, 16, '2023-06-03', 14),
(8, 16, '2023-06-04', 11),
(8, 16, '2023-06-05', 13),
(8, 16, '2023-06-06', 15),
(8, 16, '2023-06-07', 16);

-- Cosechador 17 (7 días - Cuadrilla 1)
INSERT INTO registro_cosecha (id_cosecha, id_cosechador, fecha, cantidad_capachos) VALUES
(4, 17, '2023-04-15', 9),
(4, 17, '2023-04-16', 11),
(4, 17, '2023-04-17', 13),
(4, 17, '2023-04-18', 10),
(4, 17, '2023-04-19', 12),
(4, 17, '2023-04-20', 14),
(4, 17, '2023-04-21', 15);

-- Cosechador 18 (7 días - Cuadrilla 2)
INSERT INTO registro_cosecha (id_cosecha, id_cosechador, fecha, cantidad_capachos) VALUES
(5, 18, '2023-05-01', 19),
(5, 18, '2023-05-02', 21),
(5, 18, '2023-05-03', 23),
(5, 18, '2023-05-04', 20),
(5, 18, '2023-05-05', 22),
(5, 18, '2023-05-06', 24),
(5, 18, '2023-05-07', 25);

-- Cosechador 19 (7 días - Cuadrilla 3)
INSERT INTO registro_cosecha (id_cosecha, id_cosechador, fecha, cantidad_capachos) VALUES
(6, 19, '2023-05-10', 17),
(6, 19, '2023-05-11', 19),
(6, 19, '2023-05-12', 21),
(6, 19, '2023-05-13', 18),
(6, 19, '2023-05-14', 20),
(6, 19, '2023-05-15', 22),
(6, 19, '2023-05-16', 23);

-- Cosechador 20 (7 días - Cuadrilla 4)
INSERT INTO registro_cosecha (id_cosecha, id_cosechador, fecha, cantidad_capachos) VALUES
(7, 20, '2023-05-15', 15),
(7, 20, '2023-05-16', 17),
(7, 20, '2023-05-17', 19),
(7, 20, '2023-05-18', 16),
(7, 20, '2023-05-19', 18),
(7, 20, '2023-05-20', 20),
(7, 20, '2023-05-21', 21);

-- Continuar con los cosechadores 21-30
-- Cosechador 21 (7 días - Cuadrilla 5)
INSERT INTO registro_cosecha (id_cosecha, id_cosechador, fecha, cantidad_capachos) VALUES
(8, 21, '2023-06-01', 13),
(8, 21, '2023-06-02', 15),
(8, 21, '2023-06-03', 17),
(8, 21, '2023-06-04', 14),
(8, 21, '2023-06-05', 16),
(8, 21, '2023-06-06', 18),
(8, 21, '2023-06-07', 19);

-- Cosechador 22 (7 días - Cuadrilla 6)
INSERT INTO registro_cosecha (id_cosecha, id_cosechador, fecha, cantidad_capachos) VALUES
(6, 22, '2023-05-10', 16),
(6, 22, '2023-05-11', 18),
(6, 22, '2023-05-12', 20),
(6, 22, '2023-05-13', 17),
(6, 22, '2023-05-14', 19),
(6, 22, '2023-05-15', 21),
(6, 22, '2023-05-16', 22);

-- Cosechador 23 (7 días - Cuadrilla 7)
INSERT INTO registro_cosecha (id_cosecha, id_cosechador, fecha, cantidad_capachos) VALUES
(7, 23, '2023-05-15', 14),
(7, 23, '2023-05-16', 16),
(7, 23, '2023-05-17', 18),
(7, 23, '2023-05-18', 15),
(7, 23, '2023-05-19', 17),
(7, 23, '2023-05-20', 19),
(7, 23, '2023-05-21', 20);

-- Cosechador 24 (7 días - Cuadrilla 8)
INSERT INTO registro_cosecha (id_cosecha, id_cosechador, fecha, cantidad_capachos) VALUES
(8, 24, '2023-06-01', 12),
(8, 24, '2023-06-02', 14),
(8, 24, '2023-06-03', 16),
(8, 24, '2023-06-04', 13),
(8, 24, '2023-06-05', 15),
(8, 24, '2023-06-06', 17),
(8, 24, '2023-06-07', 18);

-- Cosechador 25 (7 días - Cuadrilla 1)
INSERT INTO registro_cosecha (id_cosecha, id_cosechador, fecha, cantidad_capachos) VALUES
(4, 25, '2023-04-15', 10),
(4, 25, '2023-04-16', 12),
(4, 25, '2023-04-17', 14),
(4, 25, '2023-04-18', 11),
(4, 25, '2023-04-19', 13),
(4, 25, '2023-04-20', 15),
(4, 25, '2023-04-21', 16);

-- Cosechador 26 (7 días - Cuadrilla 2)
INSERT INTO registro_cosecha (id_cosecha, id_cosechador, fecha, cantidad_capachos) VALUES
(5, 26, '2023-05-01', 18),
(5, 26, '2023-05-02', 20),
(5, 26, '2023-05-03', 22),
(5, 26, '2023-05-04', 19),
(5, 26, '2023-05-05', 21),
(5, 26, '2023-05-06', 23),
(5, 26, '2023-05-07', 24);

-- Cosechador 27 (7 días - Cuadrilla 3)
INSERT INTO registro_cosecha (id_cosecha, id_cosechador, fecha, cantidad_capachos) VALUES
(6, 27, '2023-05-10', 15),
(6, 27, '2023-05-11', 17),
(6, 27, '2023-05-12', 19),
(6, 27, '2023-05-13', 16),
(6, 27, '2023-05-14', 18),
(6, 27, '2023-05-15', 20),
(6, 27, '2023-05-16', 21);

-- Cosechador 28 (7 días - Cuadrilla 4)
INSERT INTO registro_cosecha (id_cosecha, id_cosechador, fecha, cantidad_capachos) VALUES
(7, 28, '2023-05-15', 13),
(7, 28, '2023-05-16', 15),
(7, 28, '2023-05-17', 17),
(7, 28, '2023-05-18', 14),
(7, 28, '2023-05-19', 16),
(7, 28, '2023-05-20', 18),
(7, 28, '2023-05-21', 19);

-- Cosechador 29 (7 días - Cuadrilla 5)
INSERT INTO registro_cosecha (id_cosecha, id_cosechador, fecha, cantidad_capachos) VALUES
(8, 29, '2023-06-01', 11),
(8, 29, '2023-06-02', 13),
(8, 29, '2023-06-03', 15),
(8, 29, '2023-06-04', 12),
(8, 29, '2023-06-05', 14),
(8, 29, '2023-06-06', 16),
(8, 29, '2023-06-07', 17);

-- Cosechador 30 (7 días - Cuadrilla 6)
INSERT INTO registro_cosecha (id_cosecha, id_cosechador, fecha, cantidad_capachos) VALUES
(6, 30, '2023-05-10', 14),
(6, 30, '2023-05-11', 16),
(6, 30, '2023-05-12', 18),
(6, 30, '2023-05-13', 15),
(6, 30, '2023-05-14', 17),
(6, 30, '2023-05-15', 19),
(6, 30, '2023-05-16', 20);

-- Continuar con los cosechadores 31-40
-- Cosechador 31 (7 días - Cuadrilla 7)
INSERT INTO registro_cosecha (id_cosecha, id_cosechador, fecha, cantidad_capachos) VALUES
(7, 31, '2023-05-15', 12),
(7, 31, '2023-05-16', 14),
(7, 31, '2023-05-17', 16),
(7, 31, '2023-05-18', 13),
(7, 31, '2023-05-19', 15),
(7, 31, '2023-05-20', 17),
(7, 31, '2023-05-21', 18);

-- Cosechador 32 (7 días - Cuadrilla 8)
INSERT INTO registro_cosecha (id_cosecha, id_cosechador, fecha, cantidad_capachos) VALUES
(8, 32, '2023-06-01', 10),
(8, 32, '2023-06-02', 12),
(8, 32, '2023-06-03', 14),
(8, 32, '2023-06-04', 11),
(8, 32, '2023-06-05', 13),
(8, 32, '2023-06-06', 15),
(8, 32, '2023-06-07', 16);

-- Cosechador 33 (7 días - Cuadrilla 1)
INSERT INTO registro_cosecha (id_cosecha, id_cosechador, fecha, cantidad_capachos) VALUES
(4, 33, '2023-04-15', 9),
(4, 33, '2023-04-16', 11),
(4, 33, '2023-04-17', 13),
(4, 33, '2023-04-18', 10),
(4, 33, '2023-04-19', 12),
(4, 33, '2023-04-20', 14),
(4, 33, '2023-04-21', 15);

-- Cosechador 34 (7 días - Cuadrilla 2)
INSERT INTO registro_cosecha (id_cosecha, id_cosechador, fecha, cantidad_capachos) VALUES
(5, 34, '2023-05-01', 17),
(5, 34, '2023-05-02', 19),
(5, 34, '2023-05-03', 21),
(5, 34, '2023-05-04', 18),
(5, 34, '2023-05-05', 20),
(5, 34, '2023-05-06', 22),
(5, 34, '2023-05-07', 23);

-- Cosechador 35 (7 días - Cuadrilla 3)
INSERT INTO registro_cosecha (id_cosecha, id_cosechador, fecha, cantidad_capachos) VALUES
(6, 35, '2023-05-10', 13),
(6, 35, '2023-05-11', 15),
(6, 35, '2023-05-12', 17),
(6, 35, '2023-05-13', 14),
(6, 35, '2023-05-14', 16),
(6, 35, '2023-05-15', 18),
(6, 35, '2023-05-16', 19);

-- Cosechador 36 (7 días - Cuadrilla 4)
INSERT INTO registro_cosecha (id_cosecha, id_cosechador, fecha, cantidad_capachos) VALUES
(7, 36, '2023-05-15', 11),
(7, 36, '2023-05-16', 13),
(7, 36, '2023-05-17', 15),
(7, 36, '2023-05-18', 12),
(7, 36, '2023-05-19', 14),
(7, 36, '2023-05-20', 16),
(7, 36, '2023-05-21', 17);

-- Cosechador 37 (7 días - Cuadrilla 5)
INSERT INTO registro_cosecha (id_cosecha, id_cosechador, fecha, cantidad_capachos) VALUES
(8, 37, '2023-06-01', 9),
(8, 37, '2023-06-02', 11),
(8, 37, '2023-06-03', 13),
(8, 37, '2023-06-04', 10),
(8, 37, '2023-06-05', 12),
(8, 37, '2023-06-06', 14),
(8, 37, '2023-06-07', 15);

-- Cosechador 38 (7 días - Cuadrilla 6)
INSERT INTO registro_cosecha (id_cosecha, id_cosechador, fecha, cantidad_capachos) VALUES
(6, 38, '2023-05-10', 12),
(6, 38, '2023-05-11', 14),
(6, 38, '2023-05-12', 16),
(6, 38, '2023-05-13', 13),
(6, 38, '2023-05-14', 15),
(6, 38, '2023-05-15', 17),
(6, 38, '2023-05-16', 18);

-- Cosechador 39 (7 días - Cuadrilla 7)
INSERT INTO registro_cosecha (id_cosecha, id_cosechador, fecha, cantidad_capachos) VALUES
(7, 39, '2023-05-15', 10),
(7, 39, '2023-05-16', 12),
(7, 39, '2023-05-17', 14),
(7, 39, '2023-05-18', 11),
(7, 39, '2023-05-19', 13),
(7, 39, '2023-05-20', 15),
(7, 39, '2023-05-21', 16);

-- Cosechador 40 (7 días - Cuadrilla 8)
INSERT INTO registro_cosecha (id_cosecha, id_cosechador, fecha, cantidad_capachos) VALUES
(8, 40, '2023-06-01', 8),
(8, 40, '2023-06-02', 10),
(8, 40, '2023-06-03', 12),
(8, 40, '2023-06-04', 9),
(8, 40, '2023-06-05', 11),
(8, 40, '2023-06-06', 13),
(8, 40, '2023-06-07', 14);

-- Continuar con los cosechadores 41-50
-- Cosechador 41 (7 días - Cuadrilla 1)
INSERT INTO registro_cosecha (id_cosecha, id_cosechador, fecha, cantidad_capachos) VALUES
(4, 41, '2023-04-15', 8),
(4, 41, '2023-04-16', 10),
(4, 41, '2023-04-17', 12),
(4, 41, '2023-04-18', 9),
(4, 41, '2023-04-19', 11),
(4, 41, '2023-04-20', 13),
(4, 41, '2023-04-21', 14);

-- Cosechador 42 (7 días - Cuadrilla 2)
INSERT INTO registro_cosecha (id_cosecha, id_cosechador, fecha, cantidad_capachos) VALUES
(5, 42, '2023-05-01', 16),
(5, 42, '2023-05-02', 18),
(5, 42, '2023-05-03', 20),
(5, 42, '2023-05-04', 17),
(5, 42, '2023-05-05', 19),
(5, 42, '2023-05-06', 21),
(5, 42, '2023-05-07', 22);

-- Cosechador 43 (7 días - Cuadrilla 3)
INSERT INTO registro_cosecha (id_cosecha, id_cosechador, fecha, cantidad_capachos) VALUES
(6, 43, '2023-05-10', 11),
(6, 43, '2023-05-11', 13),
(6, 43, '2023-05-12', 15),
(6, 43, '2023-05-13', 12),
(6, 43, '2023-05-14', 14),
(6, 43, '2023-05-15', 16),
(6, 43, '2023-05-16', 17);

-- Cosechador 44 (7 días - Cuadrilla 4)
INSERT INTO registro_cosecha (id_cosecha, id_cosechador, fecha, cantidad_capachos) VALUES
(7, 44, '2023-05-15', 9),
(7, 44, '2023-05-16', 11),
(7, 44, '2023-05-17', 13),
(7, 44, '2023-05-18', 10),
(7, 44, '2023-05-19', 12),
(7, 44, '2023-05-20', 14),
(7, 44, '2023-05-21', 15);

-- Cosechador 45 (7 días - Cuadrilla 5)
INSERT INTO registro_cosecha (id_cosecha, id_cosechador, fecha, cantidad_capachos) VALUES
(8, 45, '2023-06-01', 7),
(8, 45, '2023-06-02', 9),
(8, 45, '2023-06-03', 11),
(8, 45, '2023-06-04', 8),
(8, 45, '2023-06-05', 10),
(8, 45, '2023-06-06', 12),
(8, 45, '2023-06-07', 13);

-- Cosechador 46 (7 días - Cuadrilla 6)
INSERT INTO registro_cosecha (id_cosecha, id_cosechador, fecha, cantidad_capachos) VALUES
(6, 46, '2023-05-10', 10),
(6, 46, '2023-05-11', 12),
(6, 46, '2023-05-12', 14),
(6, 46, '2023-05-13', 11),
(6, 46, '2023-05-14', 13),
(6, 46, '2023-05-15', 15),
(6, 46, '2023-05-16', 16);

-- Cosechador 47 (7 días - Cuadrilla 7)
INSERT INTO registro_cosecha (id_cosecha, id_cosechador, fecha, cantidad_capachos) VALUES
(7, 47, '2023-05-15', 8),
(7, 47, '2023-05-16', 10),
(7, 47, '2023-05-17', 12),
(7, 47, '2023-05-18', 9),
(7, 47, '2023-05-19', 11),
(7, 47, '2023-05-20', 13),
(7, 47, '2023-05-21', 14);

-- Cosechador 48 (7 días - Cuadrilla 8)
INSERT INTO registro_cosecha (id_cosecha, id_cosechador, fecha, cantidad_capachos) VALUES
(8, 48, '2023-06-01', 6),
(8, 48, '2023-06-02', 8),
(8, 48, '2023-06-03', 10),
(8, 48, '2023-06-04', 7),
(8, 48, '2023-06-05', 9),
(8, 48, '2023-06-06', 11),
(8, 48, '2023-06-07', 12);

-- Cosechador 49 (7 días - Cuadrilla 1)
INSERT INTO registro_cosecha (id_cosecha, id_cosechador, fecha, cantidad_capachos) VALUES
(4, 49, '2023-04-15', 7),
(4, 49, '2023-04-16', 9),
(4, 49, '2023-04-17', 11),
(4, 49, '2023-04-18', 8),
(4, 49, '2023-04-19', 10),
(4, 49, '2023-04-20', 12),
(4, 49, '2023-04-21', 13);

-- Cosechador 50 (7 días - Cuadrilla 2)
INSERT INTO registro_cosecha (id_cosecha, id_cosechador, fecha, cantidad_capachos) VALUES
(5, 50, '2023-05-01', 15),
(5, 50, '2023-05-02', 17),
(5, 50, '2023-05-03', 19),
(5, 50, '2023-05-04', 16),
(5, 50, '2023-05-05', 18),
(5, 50, '2023-05-06', 20),
(5, 50, '2023-05-07', 21);