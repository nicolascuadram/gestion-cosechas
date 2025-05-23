CREATE TABLE usuario (
  id SERIAL PRIMARY KEY,
  rut VARCHAR(10) UNIQUE NOT NULL,
  nombre VARCHAR(50) NOT NULL,
  p_apellido VARCHAR(50) NOT NULL,
  s_apellido VARCHAR(50),
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('administrador', 'encargado')),
  contraseña VARCHAR(20)
);

CREATE TABLE cuadrilla (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  id_encargado INTEGER REFERENCES usuario(id)
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
);

CREATE TABLE registro_cosecha (
  id SERIAL PRIMARY KEY,
  id_cosecha INTEGER NOT NULL REFERENCES cosecha(id),
  id_cosechador INTEGER NOT NULL REFERENCES cosechador(id),
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  cantidad_capachos INTEGER NOT NULL DEFAULT 0
);