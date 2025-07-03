CREATE TABLE usuario (
  id SERIAL PRIMARY KEY,
  rut VARCHAR(10) UNIQUE NOT NULL,
  nombre VARCHAR(50) NOT NULL,
  p_apellido VARCHAR(50) NOT NULL,
  s_apellido VARCHAR(50),
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('administrador', 'encargado')),
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

CREATE TABLE registro_cosecha (
  id SERIAL PRIMARY KEY,
  id_cosecha INTEGER NOT NULL REFERENCES cosecha(id),
  id_cosechador INTEGER NOT NULL REFERENCES cosechador(id),
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  cantidad_capachos INTEGER NOT NULL DEFAULT 0
);

