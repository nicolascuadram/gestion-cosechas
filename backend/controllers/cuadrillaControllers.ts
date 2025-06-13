import { Context } from "@oak/oak/context";
import client from "../database.ts";

// Listar todas las cuadrillas con encargado y cosechadores
export const getCuadrillas = async (ctx: Context) => {
  const cuadrillas = await client.queryObject(`
    SELECT c.id, c.nombre, c.id_encargado, e.nombre AS encargado_nombre, e.p_apellido AS encargado_p_apellido
    FROM cuadrilla c
    LEFT JOIN encargados e ON c.id_encargado = e.id
    ORDER BY c.id
  `);

  // Para cada cuadrilla, obtener sus cosechadores
  const cuadrillasConCosechadores = await Promise.all(
    cuadrillas.rows.map(async (cuadrilla: any) => {
      const cosechadores = await client.queryObject(`
        SELECT id, nombre, p_apellido, id_cuadrilla FROM cosechador WHERE id_cuadrilla = $1
      `, [cuadrilla.id]);
      return { ...cuadrilla, cosechadores: cosechadores.rows };
    })
  );

  ctx.response.body = cuadrillasConCosechadores;
};

// Crear cuadrilla
export const createCuadrilla = async (ctx: Context) => {
  if(ctx.request.hasBody) {
    const body = await ctx.request.body.json();
    console.log("Body:", body);
    const { nombre, encargadoId } = body;
    console.log("Nombre:", nombre, "ID Encargado:", encargadoId);

    if (!nombre || !encargadoId) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Nombre e ID de encargado son requeridos" };
      return;
    }
    const result = await client.queryObject(
      "INSERT INTO cuadrilla (nombre, id_encargado) VALUES ($1, $2) RETURNING *",
      [nombre, encargadoId]
    );
    ctx.response.status = 201;
    ctx.response.body = result.rows[0];
    } else {
    ctx.response.status = 400;
    ctx.response.body = { message: "Tipo de body no soportado o body vacío" };
    }
};

// Editar cuadrilla
export const updateCuadrilla = async (ctx: Context) => {
  if (ctx.request.hasBody) {
    const body = await ctx.request.body.json();
    const { nombre, encargadoId } = body;
    const id = ctx.params.id;
    if (!nombre || !encargadoId) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Nombre e ID de encargado son requeridos" };
      return;
    }
    const result = await client.queryObject(
      "UPDATE cuadrilla SET nombre = $1, id_encargado = $2 WHERE id = $3 RETURNING *",
      [nombre, encargadoId, id]
    );
    if (result.rows.length === 0) {
      ctx.response.status = 404;
      ctx.response.body = { message: "Cuadrilla no encontrada" };
      return;
    }
    ctx.response.body = result.rows[0];
  } else {
    ctx.response.status = 400;
    ctx.response.body = { message: "Tipo de body no soportado o body vacío" };
  }
};

// Eliminar cuadrilla
export const deleteCuadrilla = async (ctx: Context) => {
  const id = ctx.params.id;
  // Primero quitar cosechadores de la cuadrilla
  await client.queryObject("UPDATE cosechador SET id_cuadrilla = NULL WHERE id_cuadrilla = $1", [id]);
  // Luego eliminar cuadrilla
  const result = await client.queryObject("DELETE FROM cuadrilla WHERE id = $1 RETURNING *", [id]);
  if (result.rows.length === 0) {
    ctx.response.status = 404;
    ctx.response.body = { message: "Cuadrilla no encontrada" };
    return;
  }
  ctx.response.status = 204;
};

// Asignar cosechador a cuadrilla
export const asignarCosechador = async (ctx: Context) => {
  const id = ctx.params.id;
  const { id_cuadrilla } = await ctx.request.body.json();
  await client.queryObject(
    "UPDATE cosechador SET id_cuadrilla = $1 WHERE id = $2",
    [id_cuadrilla, id]
  );
  ctx.response.body = { message: "Cosechador actualizado" };
};

// Quitar cosechador de cuadrilla
export const quitarCosechador = async (ctx: Context) => {
  const id = ctx.params.id;
  await client.queryObject(
    "UPDATE cosechador SET id_cuadrilla = NULL WHERE id = $1",
    [id]
  );
  ctx.response.body = { message: "Cosechador removido de cuadrilla" };
};