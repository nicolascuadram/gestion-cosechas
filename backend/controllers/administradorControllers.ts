import { Context } from "@oak/oak/context";
import client from "../database.ts";

export const getTipo_cosecha = async (ctx) => {
  const result = await client.queryObject("SELECT * FROM tipo_cosecha");
  ctx.response.body = result.rows;
};


export const createTipo_cosecha = async (ctx: Context) => {
  try {
    if (ctx.request.hasBody) {
      const body = await ctx.request.body.json();

      const { nombre, descripcion, precio_por_capacho} = body;

      if (!nombre || !descripcion || !precio_por_capacho) {
        ctx.response.status = 400;
        ctx.response.body = { message: "Faltan campos obligatorios" };
        return;
      }

      const result = await client.queryObject<{ id: number }>(
        `INSERT INTO tipo_cosecha (nombre, descripcion, precio_por_capacho)
        VALUES ($1, $2, $3)
        RETURNING id;`,
        [nombre, descripcion, precio_por_capacho]
      );

      ctx.response.status = 201;
      ctx.response.body = { id: result.rows[0].id, message: "Encargado creado exitosamente" };
    } else {
      ctx.response.status = 400;
      ctx.response.body = { message: "Tipo de body no soportado o body vacío" };
    }
  } catch (error) {
    console.error("Error al crear encargado:", error);
    ctx.response.status = 500;
    ctx.response.body = { message: "Error al crear encargado", error: error.message };
  }
};

// Editar un tipo_cosecha por ID
export const updateTipo_cosecha = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    if (!id) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Falta el ID en la URL" };
      return;
    }

    if (ctx.request.hasBody) {
      const body = await ctx.request.body.json();
      const { nombre, descripcion, precio_por_capacho } = body;

      if (!nombre || !descripcion || !precio_por_capacho) {
        ctx.response.status = 400;
        ctx.response.body = { message: "Faltan campos obligatorios" };
        return;
      }

      const result = await client.queryObject(
        `UPDATE tipo_cosecha 
         SET nombre = $1, descripcion = $2, precio_por_capacho = $3
         WHERE id = $4`,
        [nombre, descripcion, precio_por_capacho, id]
      );

      if (result.rowCount && result.rowCount > 0) {
        ctx.response.status = 200;
        ctx.response.body = { message: "Tipo de cosecha actualizado exitosamente" };
      } else {
        ctx.response.status = 404;
        ctx.response.body = { message: "Tipo de cosecha no encontrado" };
      }
    } else {
      ctx.response.status = 400;
      ctx.response.body = { message: "Body no enviado o vacío" };
    }
  } catch (error) {
    console.error("Error al actualizar tipo_cosecha:", error);
    ctx.response.status = 500;
    ctx.response.body = { message: "Error al actualizar tipo_cosecha", error: error.message };
  }
};

// Eliminar un tipo_cosecha por ID
export const deleteTipo_cosecha = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    if (!id) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Falta el ID en la URL" };
      return;
    }

    const result = await client.queryObject(
      `DELETE FROM tipo_cosecha WHERE id = $1`,
      [id]
    );

    if (result.rowCount && result.rowCount > 0) {
      ctx.response.status = 200;
      ctx.response.body = { message: "Tipo de cosecha eliminado exitosamente" };
    } else {
      ctx.response.status = 404;
      ctx.response.body = { message: "Tipo de cosecha no encontrado" };
    }
  } catch (error) {
    console.error("Error al eliminar tipo_cosecha:", error);
    ctx.response.status = 500;
    ctx.response.body = { message: "Error al eliminar tipo_cosecha", error: error.message };
  }
};

export const getCosecha = async (ctx) => {
  const result = await client.queryObject("SELECT * FROM cosecha");
  ctx.response.body = result.rows;
};

export const addCosecha = async (ctx: Context) => {
  try {
    // 1. Verificar si hay cuerpo en la solicitud (igual que en tu función que funciona)
    if (!ctx.request.hasBody) {
      ctx.response.status = 400;
      ctx.response.body = { error: "No se recibieron datos" };
      return;
    }

    // 2. Obtener el cuerpo como JSON (usando el mismo método que en createTipo_cosecha)
    const body = await ctx.request.body.json();

    console.log("Datos recibidos:", body); // Para depuración

    // 3. Validaciones básicas (similar a tu función working)
    if (!body.id_cuadrilla || !body.id_tipo_cosecha || !body.fecha_inicio) {
      ctx.response.status = 400;
      ctx.response.body = { 
        error: "Faltan campos obligatorios",
        required: ["id_cuadrilla", "id_tipo_cosecha", "fecha_inicio"]
      };
      return;
    }

    // 4. Validar referencias en la base de datos (igual que en tu función working)
    const [cuadrillaExists, tipoExists] = await Promise.all([
      client.queryObject("SELECT 1 FROM cuadrilla WHERE id = $1", [body.id_cuadrilla]),
      client.queryObject("SELECT 1 FROM tipo_cosecha WHERE id = $1", [body.id_tipo_cosecha])
    ]);

    if (!cuadrillaExists.rowCount) {
      ctx.response.status = 400;
      ctx.response.body = { error: "La cuadrilla especificada no existe" };
      return;
    }

    if (!tipoExists.rowCount) {
      ctx.response.status = 400;
      ctx.response.body = { error: "El tipo de cosecha especificado no existe" };
      return;
    }

    // 5. Insertar en la base de datos (similar a tu función working)
    const result = await client.queryObject(
      `INSERT INTO cosecha 
       (id_cuadrilla, id_tipo_cosecha, fecha_inicio, fecha_fin, estado)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        body.id_cuadrilla,
        body.id_tipo_cosecha,
        body.fecha_inicio,
        body.fecha_fin || null,
        body.estado || 'activa'
      ]
    );

    ctx.response.status = 201;
    ctx.response.body = result.rows[0];

  } catch (error) {
    console.error("Error en addCosecha:", error);
    ctx.response.status = 500;
    ctx.response.body = { 
      error: "Error interno del servidor",
      details: error.message 
    };
  }
};

export const updateCosecha = async (ctx: Context) => {
  try {
    // 1. Verificar si hay cuerpo en la solicitud
    if (!ctx.request.hasBody) {
      ctx.response.status = 400;
      ctx.response.body = { error: "No se recibieron datos" };
      return;
    }

    // 2. Obtener parámetro ID y cuerpo como JSON
    const id = ctx.params.id;
    const body = await ctx.request.body.json();

    console.log("Intentando actualizar cosecha ID:", id);
    console.log("Datos recibidos:", body);

    // 3. Validaciones básicas
    if (!body.id_cuadrilla || !body.id_tipo_cosecha || !body.fecha_inicio) {
      ctx.response.status = 400;
      ctx.response.body = { 
        error: "Faltan campos obligatorios",
        required: ["id_cuadrilla", "id_tipo_cosecha", "fecha_inicio"]
      };
      return;
    }

    // 4. Validar referencias en la base de datos
    const [cosechaExistente, cuadrillaExistente, tipoExistente] = await Promise.all([
      client.queryObject("SELECT 1 FROM cosecha WHERE id = $1", [id]),
      client.queryObject("SELECT 1 FROM cuadrilla WHERE id = $1", [body.id_cuadrilla]),
      client.queryObject("SELECT 1 FROM tipo_cosecha WHERE id = $1", [body.id_tipo_cosecha])
    ]);

    if (!cosechaExistente.rowCount) {
      ctx.response.status = 404;
      ctx.response.body = { error: "La cosecha a actualizar no existe" };
      return;
    }

    if (!cuadrillaExistente.rowCount) {
      ctx.response.status = 400;
      ctx.response.body = { error: "La cuadrilla especificada no existe" };
      return;
    }

    if (!tipoExistente.rowCount) {
      ctx.response.status = 400;
      ctx.response.body = { error: "El tipo de cosecha especificado no existe" };
      return;
    }

    // 5. Validación de fechas (solo si fecha_fin está presente)
    if (body.fecha_fin && new Date(body.fecha_fin) < new Date(body.fecha_inicio)) {
      ctx.response.status = 400;
      ctx.response.body = { error: "La fecha fin no puede ser anterior a la fecha inicio" };
      return;
    }

    // 6. Actualizar en la base de datos
    const result = await client.queryObject(
      `UPDATE cosecha SET
        id_cuadrilla = $1,
        id_tipo_cosecha = $2,
        fecha_inicio = $3,
        fecha_fin = $4,
        estado = $5
      WHERE id = $6
      RETURNING *`,
      [
        body.id_cuadrilla,
        body.id_tipo_cosecha,
        body.fecha_inicio,
        body.fecha_fin || null,
        body.estado || 'activa',
        id
      ]
    );

    if (result.rowCount && result.rowCount > 0) {
      ctx.response.status = 200;
      ctx.response.body = {
        success: true,
        data: result.rows[0],
        message: "Cosecha actualizada exitosamente"
      };
    } else {
      ctx.response.status = 500;
      ctx.response.body = { error: "No se pudo actualizar la cosecha" };
    }
  } catch (error) {
    console.error("Error en updateCosecha:", error);
    ctx.response.status = 500;
    ctx.response.body = {
      error: "Error interno del servidor",
      details: error.message
    };
  }
};

export const deleteCosecha = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    if (!id) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Falta el ID en la URL" };
      return;
    }

    const result = await client.queryObject(
      `DELETE FROM cosecha WHERE id = $1`,
      [id]
    );

    if (result.rowCount && result.rowCount > 0) {
      ctx.response.status = 200;
      ctx.response.body = { message: "Cosecha eliminada exitosamente" };
    } else {
      ctx.response.status = 404;
      ctx.response.body = { message: "Cosecha no encontrada" };
    }
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = { error: error.message };
  }
};

export const getSingleCosecha = async (ctx: Context) => {
  try {
    const id = ctx.params.id;
    if (!id) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Falta el ID en la URL" };
      return;
    }

    const result = await client.queryObject(
      `SELECT * FROM cosecha WHERE id = $1`,
      [id]
    );

    if (result.rowCount && result.rowCount > 0) {
      ctx.response.body = result.rows[0];
    } else {
      ctx.response.status = 404;
      ctx.response.body = { message: "Cosecha no encontrada" };
    }
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = { error: error.message };
  }
};
