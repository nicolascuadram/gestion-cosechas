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


export const getReportes = async (ctx: Context) => {
  try {
    const result = await client.queryObject(`
      SELECT 
        rc.id,
        c.id AS id_cosecha,
        co.nombre || ' ' || co.p_apellido AS nombre_cosechador,
        cu.nombre AS nombre_cuadrilla,
        tc.nombre AS nombre_cultivo,
        rc.fecha,
        rc.cantidad_capachos,
        tc.precio_por_capacho
      FROM registro_cosecha rc
      JOIN cosecha c ON rc.id_cosecha = c.id
      JOIN cosechador co ON rc.id_cosechador = co.id
      JOIN cuadrilla cu ON c.id_cuadrilla = cu.id
      JOIN tipo_cosecha tc ON c.id_tipo_cosecha = tc.id
      ORDER BY rc.fecha DESC
    `);
    ctx.response.body = result.rows;
  } catch (error) {
    console.error("Error al cargar reportes:", error);
    ctx.response.status = 500;
    ctx.response.body = { message: "Error al cargar reportes", error: error.message };
  }
};