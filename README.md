# Sistema Web para Gestión de Cosechas

## Descripción

Este es un sistema web para la gestión de cosechas. El sistema permite a los usuarios gestionar sus cosechas de manera eficiente y sencilla.
El backend está construido con Deno y el frontend con React. El sistema utiliza PostgreSQL como base de datos para almacenar la información de las cosechas.

## Instrucciones para ejecutar el backend en local

1. Crear una base de datos local utilizando PostgreSQL.

Crear una base de datos
Ejecutar la query de prueba con el archivo /backend/script.sql

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

INSERT INTO users (name) VALUES ('Alice'), ('Bob'), ('Charlie');
```

2. Agregar variables de entorno.

Crear un archivo .env con los datos de la base de datos creada
Existe un archivo de ejemplo .envexample

```js
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=tu_base_de_datos
DB_HOST=localhost
DB_PORT=5432
```

3. Ejecutar el servidor.

Abrir una terminal y acceder a la ruta del backend
Ejecutar el comando "deno run dev"

```bash
cd backend
deno run dev
```